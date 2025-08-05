// routes/trend.js – live trends & tweets (min limit 10, max 100)
// ----------------------------------------------------------------------------------
// Endpoints:
//   • GET /trend              – cached list (unchanged)
//   • GET /trend/live         – real‑time topics (v2 enterprise → v1.1 fallback)
//   • GET /trend/tweets       – engagement‑sorted tweets for one topic (limit 10‑100)
//
// Notes:
//   • Requires TWITTER_BEARER_TOKEN in env.
//   • Runs on port 4002 (set PORT env var or in app entry).
// ----------------------------------------------------------------------------------
import { Router } from "express";
import axios from "axios";
import TrendModel from "../model/Trend.js";

const router = Router();

// --------------------------------- Twitter API clients ---------------------------------------
function getTwitterClients() {
  const { TWITTER_BEARER_TOKEN } = process.env;
  
  if (!TWITTER_BEARER_TOKEN) {
    throw new Error("TWITTER_BEARER_TOKEN missing – add it to .env or hosting secrets");
  }

  const twitterV2 = axios.create({
    baseURL: "https://api.twitter.com/2",
    headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
  });

  const twitterV1 = axios.create({
    baseURL: "https://api.twitter.com/1.1",
    headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
  });

  return { twitterV2, twitterV1 };
}

// ==============================================================================================
// fetchTrends – v2 enterprise first, v1.1 fallback, drops null/zero volumes
// ==============================================================================================
async function fetchTrends(woeid, limit) {
  const { twitterV2, twitterV1 } = getTwitterClients();
  let raw = [];

  // 1️⃣ Try v2 enterprise
  try {
    const { data } = await twitterV2.get(`/trends/by/woeid/${woeid}`, {
      params: { max_trends: limit * 3, "trend.fields": "trend_name,tweet_count" },
    });
    if (Array.isArray(data?.data) && data.data.length) raw = data.data;
  } catch (_) {
    /* ignore – we'll fall back */
  }

  // 2️⃣ Fallback to v1.1
  if (!raw.length) {
    const { data } = await twitterV1.get("/trends/place.json", { params: { id: woeid } });
    raw = data[0]?.trends ?? [];
  }

  return raw
    .map((t) => {
      const volume = t.tweet_count ?? t.tweet_volume;
      return {
        trend_name: t.trend_name ?? t.name ?? "",
        tweet_count: typeof volume === "number" ? volume : 0,
      };
    })
    .filter((t) => t.tweet_count > 0)
    .slice(0, limit);
}

// ==============================================================================================
// GET /trend – cached list (unchanged)
// ==============================================================================================
router.get("/", async (_, res) => {
  try {
    const trends = await TrendModel.find()
      .sort({ tweet_count: -1 })
      .select({ trend_name: 1, tweet_count: 1, _id: 0 })
      .limit(7);
    res.json({ trends });
  } catch (err) {
    console.error("[trend] cached fetch failed", err);
    res.status(500).json({ message: "Could not load cached trends." });
  }
});

// ==============================================================================================
// GET /trend/live – real‑time topics
// ==============================================================================================
router.get("/live", async (req, res) => {
  const woeid = req.query.woeid || "23424977"; // default: USA
  const limit = Math.min(parseInt(req.query.limit ?? "10", 10), 50);

  try {
    const trends = await fetchTrends(woeid, limit);

    // async cache write (non‑blocking)
    if (trends.length) {
      TrendModel.bulkWrite(
        trends.map((t) => ({
          updateOne: { filter: { trend_name: t.trend_name }, update: { $set: t }, upsert: true },
        }))
      ).catch((e) => console.warn("[trend] Mongo upsert failed", e));
    }

    res.json({ trends });
  } catch (err) {
    console.error("[trend] live fetch failed", err.response?.data || err);
    res.status(502).json({ message: "Twitter trending API failed." });
  }
});

// ==============================================================================================
// GET /trend/tweets – tweets for one topic (limit 10‑100)
// ==============================================================================================
router.get("/tweets", async (req, res) => {
  const query = req.query.q;
  const requested = parseInt(req.query.limit ?? "50", 10);
  const limit = Math.max(10, Math.min(requested, 100)); // enforce ≥10, ≤100

  if (!query) return res.status(400).json({ message: "`q` query parameter is required." });

  try {
    const { twitterV2 } = getTwitterClients();
    const { data } = await twitterV2.get("/tweets/search/recent", {
      params: {
        query,
        max_results: limit,
        "tweet.fields":
          "created_at,public_metrics,text,lang,source,geo,attachments",
        expansions: "author_id,attachments.media_keys,geo.place_id",
        "user.fields":
          "name,username,profile_image_url,verified,description,location",
        "place.fields":
          "country,country_code,full_name,geo,name,place_type",
      },
    });

    const usersById = Object.fromEntries(
      (data?.includes?.users || []).map((u) => [u.id, u])
    );

    const tweets = (data?.data || []).map((t) => {
      const m = t.public_metrics || {};
      const engagement =
        (m.like_count || 0) +
        (m.retweet_count || 0) +
        (m.reply_count || 0) +
        (m.quote_count || 0);

      return {
        id: t.id,
        text: t.text,
        created_at: t.created_at,
        lang: t.lang,
        engagement,
        ...m,
        user: usersById[t.author_id] || { id: t.author_id },
      };
    });

    tweets.sort((a, b) => b.engagement - a.engagement);

    res.json({ tweets });
  } catch (err) {
    console.error("[trend] tweets fetch failed", err.response?.data || err);
    res.status(502).json({ message: "Twitter search API failed." });
  }
});

export default router;
