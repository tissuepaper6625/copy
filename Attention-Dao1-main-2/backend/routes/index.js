import axios from "axios";
import express from "express";
import { formatAndSortTopTweets } from "../utils/tweets.js";
import TokenModel from "../model/Token.js";
import { fetchPosition, fetchTokenPrice } from "../utils/marketcap.js";

const router = express.Router();
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const v2BaseUrl = "https://api.twitter.com/2";
// const v1BaseUrl = 'https://api.twitter.com/1.1';

const twitterClient = axios.create({
  headers: {
    Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
  },
});

// fetch trending worldwide
router.get("/fetch-trends", async (_, res) => {
  try {
    const response = await twitterClient.get(
      `${v2BaseUrl}/trends/by/woeid/23424977?max_trends=50`,
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// fetch tweets by trend
router.get("/fetch-tweets-by-trend", async (_, res) => {
  try {
    const query = "Signal";

    const response = await twitterClient.get(
      `${v2BaseUrl}/tweets/search/recent`,
      {
        params: {
          query: query,
          max_results: 50,
          "tweet.fields": "created_at,public_metrics,text,lang,source,geo",
          expansions: "author_id,attachments.media_keys,geo.place_id",
          "user.fields":
            "name,username,profile_image_url,verified,description,location",
          "place.fields": "country,country_code,full_name,geo,name,place_type",
        },
      },
    );

    res.send(formatAndSortTopTweets(response.data));
  } catch (error) {
    res.send(error);
  }
});

router.get("/get-uncollected-fees", async (req, res) => {

  try {
    const tokens = await TokenModel.find();
    await Promise.all(tokens.map(async(token) => {
      await fetchPosition(token.position_id);
    }));

    res.status(200).json({
      "result": tokens
    })
  } catch (error) {
    console.log(error)
    res.status(200).json(error);
  }

});

router.get("/fetch-price", async (req, res) => {

  try {
    const tokens = await TokenModel.find();
    await Promise.all(tokens.map(async(token) => {
      await fetchTokenPrice(token);
    }));
    // const token = await fetchTokenPrice("0x3849cc93e7b71b37885237cd91a215974135cd8d", "1973799");

    res.status(200).json({
      "result": "ok"
    })
  } catch (error) {
    console.log(error)
    res.status(200).json(error);
  }

});

export default router;