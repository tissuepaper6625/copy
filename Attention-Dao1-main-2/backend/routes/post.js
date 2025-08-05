import { Router } from "express";
import PostModel from "../model/Post.js";
import SponsoredTweet from "../model/SponsoredTweet.js";
import { fetchTwitterPost, formatAndSortTopTweets } from "../utils/tweets.js";
import axios from "axios";

const router = Router();

// Twitter API client function (reused from trend.js)
function getTwitterClients() {
  const { TWITTER_BEARER_TOKEN } = process.env;
  
  if (!TWITTER_BEARER_TOKEN) {
    throw new Error("TWITTER_BEARER_TOKEN missing – add it to .env or hosting secrets");
  }

  const twitterV2 = axios.create({
    baseURL: "https://api.twitter.com/2",
    headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
  });

  return { twitterV2 };
}

// Function to convert sponsored tweet to post format for seamless integration
function convertSponsoredTweetToPost(sponsoredTweet) {
  const tweetContent = sponsoredTweet.tweetContent || {};
  const author = tweetContent.author || {};
  const metrics = tweetContent.metrics || {};

  return {
    id: sponsoredTweet.tweetId,
    created_at: tweetContent.createdAt || sponsoredTweet.createdAt,
    text: tweetContent.text || sponsoredTweet.description || 'Sponsored content',
    author: {
      name: author.name || 'Sponsored',
      username: author.username || 'sponsored',
      verified: author.verified || false,
      description: `Sponsored by ${sponsoredTweet.sponsorName}`,
      profile_image: author.profileImageUrl || '',
      follower_count: 0,
    },
    metrics: {
      retweet_count: metrics.retweets || 0,
      reply_count: metrics.replies || 0,
      like_count: metrics.likes || 0,
      quote_count: metrics.quotes || 0,
      bookmark_count: 0,
      view_count: metrics.views || 0,
    },
    media: [],
    lang: 'en',
    engagementScore: (metrics.likes || 0) + (metrics.retweets || 0) + (metrics.replies || 0) + (metrics.quotes || 0),
    trend_name: sponsoredTweet.category, // Use category as trend_name for filtering
    
    // Additional sponsored tweet specific fields
    isSponsored: true,
    sponsorName: sponsoredTweet.sponsorName,
    sponsorContact: sponsoredTweet.sponsorContact,
    sponsoredTweetId: sponsoredTweet._id,
    priority: sponsoredTweet.priority || 1,
    memathonSeason: sponsoredTweet.memathonSeason,
    category: sponsoredTweet.category,
    amountPaid: sponsoredTweet.amountPaid,
    stats: sponsoredTweet.stats,
    twitterUrl: sponsoredTweet.twitterUrl
  };
}

// Function to intelligently merge sponsored tweets with organic posts
async function integrateSponsoredTweets(organicPosts, trend, limit = 20) {
  try {
    // Build filter for sponsored tweets
    let sponsoredFilter = { isActive: true };
    
    // If specific trend/category is requested, filter sponsored tweets accordingly
    if (trend && trend !== "all") {
      // Map common trend names to categories
      const trendToCategoryMap = {
        'politics': 'politics',
        'sports': 'sports', 
        'entertainment': 'entertainment',
        'technology': 'technology',
        'crypto': 'crypto',
        'tech': 'technology',
        'tech-buzz': 'technology'
      };
      
      const mappedCategory = trendToCategoryMap[trend.toLowerCase()];
      if (mappedCategory) {
        sponsoredFilter.category = mappedCategory;
      }
      // If no mapping, include all sponsored tweets for broader reach
    }

    // Fetch active sponsored tweets sorted by priority
    const sponsoredTweets = await SponsoredTweet.find(sponsoredFilter)
      .sort({ priority: -1, createdAt: -1 })
      .limit(Math.max(1, Math.floor(limit * 0.3))) // Max 30% sponsored content
      .lean();

    if (sponsoredTweets.length === 0) {
      return organicPosts.slice(0, limit);
    }

    // Convert sponsored tweets to post format
    const sponsoredPosts = sponsoredTweets.map(convertSponsoredTweetToPost);

    // Strategy: Intelligent interleaving based on priority and engagement
    const integratedPosts = [];
    let organicIndex = 0;
    let sponsoredIndex = 0;
    let postCount = 0;

    // Interleave posts: generally 1 sponsored per every 3-4 organic posts
    // But high-priority sponsored tweets get more prominent placement
    while (postCount < limit && (organicIndex < organicPosts.length || sponsoredIndex < sponsoredPosts.length)) {
      const shouldAddSponsored = 
        sponsoredIndex < sponsoredPosts.length && (
          // Add high priority sponsored tweets early (priority >= 5)
          (sponsoredPosts[sponsoredIndex].priority >= 5 && postCount < 3) ||
          // Regular interleaving: every 3-4 posts
          (postCount > 0 && (postCount + 1) % 4 === 0) ||
          // Force at least one sponsored if we're running out of organic
          (organicIndex >= organicPosts.length && sponsoredIndex < sponsoredPosts.length)
        );

      if (shouldAddSponsored) {
        integratedPosts.push(sponsoredPosts[sponsoredIndex]);
        sponsoredIndex++;
      } else if (organicIndex < organicPosts.length) {
        integratedPosts.push(organicPosts[organicIndex]);
        organicIndex++;
      } else if (sponsoredIndex < sponsoredPosts.length) {
        // Fallback: add remaining sponsored tweets
        integratedPosts.push(sponsoredPosts[sponsoredIndex]);
        sponsoredIndex++;
      }
      
      postCount++;
    }

    console.log(`[SPONSORED INTEGRATION] Mixed ${sponsoredPosts.length} sponsored tweets with ${organicPosts.length} organic posts for trend: ${trend}`);
    
    return integratedPosts.slice(0, limit);
    
  } catch (error) {
    console.error("Error integrating sponsored tweets:", error);
    // Fallback to organic posts only
    return organicPosts.slice(0, limit);
  }
}

// Function to fetch tweets for a specific trend
async function fetchTweetsForTrend(trendName, limit = 20) {
  try {
    const { twitterV2 } = getTwitterClients();
    const { data } = await twitterV2.get("/tweets/search/recent", {
      params: {
        query: trendName,
        max_results: limit,
        "tweet.fields": "created_at,public_metrics,text,lang,source,geo,attachments",
        expansions: "author_id,attachments.media_keys,geo.place_id",
        "user.fields": "name,username,profile_image_url,verified,description,location",
        "place.fields": "country,country_code,full_name,geo,name,place_type",
      },
    });

    const usersById = Object.fromEntries(
      (data?.includes?.users || []).map((u) => [u.id, u])
    );

    const tweets = (data?.data || []).map((t) => {
      const m = t.public_metrics || {};
      const engagement = (m.like_count || 0) + (m.retweet_count || 0) + (m.reply_count || 0) + (m.quote_count || 0);
      const user = usersById[t.author_id] || { id: t.author_id };

      return {
        id: t.id,
        created_at: t.created_at,
        text: t.text,
        author: {
          name: user.name || 'Unknown',
          username: user.username || 'unknown',
          verified: user.verified || false,
          description: user.description || '',
          profile_image: user.profile_image_url || '',
          follower_count: user.public_metrics?.followers_count || 0,
        },
        metrics: {
          retweet_count: m.retweet_count || 0,
          reply_count: m.reply_count || 0,
          like_count: m.like_count || 0,
          quote_count: m.quote_count || 0,
          bookmark_count: m.bookmark_count || 0,
          view_count: m.impression_count || 0,
        },
        lang: t.lang,
        engagementScore: engagement,
        trend_name: trendName,
      };
    });

    tweets.sort((a, b) => b.engagementScore - a.engagementScore);
    return tweets;
  } catch (error) {
    console.error("Error fetching tweets for trend:", error);
    return [];
  }
}

// Add this test endpoint for mock data
router.get('/viral-mock', async(req, res) => {
  res.json({
    tweets: [
      {
        id: '1',
        text: 'This tweet is going viral!',
        metrics: { like_count: 1500, retweet_count: 800, impression_count: 50000 },
        created_at: new Date(),
        viral_score: 92.4,
        is_viral: true,
        author: {
          username: 'viraluser',
          name: 'Viral User',
          profile_image: 'https://pbs.twimg.com/profile.jpg'
        }
      },
      {
        id: '2',
        text: 'Another trending tweet!',
        metrics: { like_count: 1200, retweet_count: 500, impression_count: 40000 },
        created_at: new Date(),
        viral_score: 85.1,
        is_viral: true,
        author: {
          username: 'trendinguser',
          name: 'Trending User',
          profile_image: 'https://pbs.twimg.com/profile2.jpg'
        }
      }
    ]
  });
});

// Add this new route to post.js
router.get('/viral', async (req, res) => {
  try {
    const viralTweets = await PostModel.find({
      is_viral: true,
      created_at: { 
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    })
    .sort({ viral_score: -1 })
    .limit(50);

    res.status(200).json({ tweets: viralTweets });
  } catch (error) {
    console.error('Viral feed error:', error);
    res.status(500).json({ error: 'Failed to fetch viral tweets' });
  }
});

router.get("/:trend", async (req, res) => {
  try {
    const { trend } = req.params;
    if (!trend) {
      return res.status(400).json({
        message: "trend is required",
      });
    }

    if (trend == "all") {
      // For "all" trend, get diverse content and integrate sponsored tweets
      const organicPosts = await PostModel.find({}).limit(15);
      const integratedPosts = await integrateSponsoredTweets(organicPosts, "all", 20);
      return res.status(200).json({
        posts: integratedPosts,
      });
    }

    // Step 1: Check if posts exist in database for this trend
    let organicPosts = await PostModel.find({
      trend_name: trend,
    });

    // Step 2: If no posts found, fetch from Twitter API
    if (organicPosts.length === 0) {
      console.log(`No posts found for trend "${trend}", fetching from Twitter...`);
      
      try {
        // Fetch tweets from Twitter API
        const tweets = await fetchTweetsForTrend(trend, 15); // Reduced to make room for sponsored
        
        if (tweets.length > 0) {
          // Step 3: Save tweets to database
          const savedPosts = await PostModel.insertMany(tweets);
          console.log(`Saved ${savedPosts.length} posts for trend "${trend}"`);
          organicPosts = savedPosts;
        } else {
          console.log(`No tweets found for trend "${trend}" on Twitter`);
        }
      } catch (twitterError) {
        console.error("Error fetching from Twitter:", twitterError.message);
        // Continue with empty posts array if Twitter fetch fails
      }
    }

    // Step 4: Integrate sponsored tweets with organic posts
    const integratedPosts = await integrateSponsoredTweets(organicPosts, trend, 20);

    res.status(200).json({
      posts: integratedPosts,
    });
  } catch (error) {
    console.error("Error in /post/:trend:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/item/:username/:post_id", async (req, res) => {

  try {
    const { username, post_id } = req.params;

    let post = await PostModel.findOne({
      id: post_id,
      "author.username": username
    });
    if (!post) {
      post = await fetchTwitterPost(post_id);
      if (!post) throw Error("Not existing post");
      const formattedPost = formatAndSortTopTweets({
        tweets: [post]
      });
      post = formattedPost[0];

      const newPost = new PostModel({
        ...post
      });

      await newPost.save();

    }

    res.status(200).json({
      post
    });

  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }

});


export default router;
