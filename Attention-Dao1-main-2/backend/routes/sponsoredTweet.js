import { Router } from "express";
import SponsoredTweet from "../model/SponsoredTweet.js";
import MemathonParticipant from "../model/MemathonParticipant.js";
import { privyMiddleware } from "../middleware/privyMiddleware.js";
import { checkAdminPrivileges } from "../utils/adminAuth.js";
import { TwitterApi } from "twitter-api-v2";
import { fetchTwitterPost, formatAndSortTopTweets } from "../utils/tweets.js";

const router = Router();
const twitter = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// Helper function to extract tweet ID from URL
const extractTweetId = (url) => {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

// Helper function to fetch tweet data using the same logic as home page
const fetchTweetData = async (tweetId) => {
  try {
    // Use the same fetchTwitterPost function as the home page
    const tweet = await fetchTwitterPost(tweetId);
    if (!tweet) {
      console.error('Tweet not found:', tweetId);
      return null;
    }

    // Format the tweet using the same function as home page
    const formattedTweets = formatAndSortTopTweets({
      tweets: [tweet]
    });
    
    const formattedTweet = formattedTweets[0];
    
    if (!formattedTweet) {
      console.error('Failed to format tweet:', tweetId);
      return null;
    }

    // Return in the format expected by sponsored tweets
    return {
      text: formattedTweet.text,
      author: {
        name: formattedTweet.author?.name || 'Unknown',
        username: formattedTweet.author?.username || 'unknown',
        profileImageUrl: formattedTweet.author?.profile_image_url || '',
        verified: formattedTweet.author?.verified || false
      },
      metrics: {
        retweets: formattedTweet.metrics?.retweet_count || 0,
        likes: formattedTweet.metrics?.like_count || 0,
        views: formattedTweet.metrics?.impression_count || 0,
        replies: formattedTweet.metrics?.reply_count || 0,
        quotes: formattedTweet.metrics?.quote_count || 0
      },
      createdAt: new Date(formattedTweet.created_at)
    };
  } catch (error) {
    console.error('Error fetching tweet data:', error);
    return null;
  }
};

// GET /sponsored-tweet - Get all sponsored tweets (with filtering) - PUBLIC
router.get("/", async (req, res) => {
  try {
    const { season, category, active = 'true' } = req.query;
    
    let filter = {};
    if (season) filter.memathonSeason = parseInt(season);
    if (category && category !== 'all') filter.category = category;
    if (active === 'true') filter.isActive = true;

    const sponsoredTweets = await SponsoredTweet.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: sponsoredTweets,
      count: sponsoredTweets.length
    });
  } catch (error) {
    console.error('Error fetching sponsored tweets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sponsored tweets'
    });
  }
});

// GET /sponsored-tweet/active - Get only active sponsored tweets - PUBLIC
router.get("/active", async (req, res) => {
  try {
    const { season, category } = req.query;
    
    let filter = { isActive: true };
    if (season) filter.memathonSeason = parseInt(season);
    if (category && category !== 'all') filter.category = category;

    const sponsoredTweets = await SponsoredTweet.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: sponsoredTweets,
      count: sponsoredTweets.length
    });
  } catch (error) {
    console.error('Error fetching active sponsored tweets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active sponsored tweets'
    });
  }
});

// GET /sponsored-tweet/seasons - Get all available seasons
router.get("/seasons", async (req, res) => {
  try {
    const seasons = await SponsoredTweet.distinct('memathonSeason');
    res.json({
      success: true,
      data: seasons.sort((a, b) => b - a)
    });
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seasons'
    });
  }
});

// POST /sponsored-tweet - Add new sponsored tweet (Admin only)
router.post("/", privyMiddleware, checkAdminPrivileges, async (req, res) => {
  try {
    const {
      twitterUrl,
      sponsorName,
      sponsorContact,
      category,
      memathonSeason,
      priority = 1,
      amountPaid
    } = req.body;

    // Validate required fields
    if (!twitterUrl || !sponsorName || !sponsorContact || !category || !memathonSeason || !amountPaid) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['twitterUrl', 'sponsorName', 'sponsorContact', 'category', 'memathonSeason', 'amountPaid']
      });
    }

    // Extract tweet ID
    const tweetId = extractTweetId(twitterUrl);
    if (!tweetId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Twitter URL format'
      });
    }

    // Check if tweet already exists
    const existingTweet = await SponsoredTweet.findOne({ tweetId });
    if (existingTweet) {
      return res.status(409).json({
        success: false,
        error: 'This tweet is already sponsored in the system'
      });
    }

    // Fetch tweet data from Twitter
    const tweetContent = await fetchTweetData(tweetId);
    if (!tweetContent) {
      return res.status(400).json({
        success: false,
        error: 'Unable to fetch tweet data. Please check the URL and try again.'
      });
    }

    // Create sponsored tweet
    const sponsoredTweet = new SponsoredTweet({
      twitterUrl,
      tweetId,
      sponsorName,
      sponsorContact,
      category,
      memathonSeason,
      priority,
      amountPaid,
      addedBy: req.adminEmail,
      tweetContent
    });

    await sponsoredTweet.save();

    console.log(`[SPONSORED TWEET] ${req.adminEmail} added sponsored tweet: ${tweetId} for ${sponsorName}`);

    res.status(201).json({
      success: true,
      data: sponsoredTweet,
      message: 'Sponsored tweet added successfully'
    });
  } catch (error) {
    console.error('Error creating sponsored tweet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create sponsored tweet'
    });
  }
});

// PUT /sponsored-tweet/:id - Update sponsored tweet (Admin only)
router.put("/:id", privyMiddleware, checkAdminPrivileges, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.tweetId;
    delete updates.createdAt;
    delete updates.updatedAt;

    const sponsoredTweet = await SponsoredTweet.findByIdAndUpdate(
      id,
      { ...updates, updatedBy: req.adminEmail },
      { new: true, runValidators: true }
    );

    if (!sponsoredTweet) {
      return res.status(404).json({
        success: false,
        error: 'Sponsored tweet not found'
      });
    }

    console.log(`[SPONSORED TWEET] ${req.adminEmail} updated sponsored tweet: ${id}`);

    res.json({
      success: true,
      data: sponsoredTweet,
      message: 'Sponsored tweet updated successfully'
    });
  } catch (error) {
    console.error('Error updating sponsored tweet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update sponsored tweet'
    });
  }
});

// DELETE /sponsored-tweet/:id - Deactivate sponsored tweet (Admin only)
router.delete("/:id", privyMiddleware, checkAdminPrivileges, async (req, res) => {
  try {
    const { id } = req.params;

    const sponsoredTweet = await SponsoredTweet.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        deactivatedBy: req.adminEmail,
        deactivatedAt: new Date()
      },
      { new: true }
    );

    if (!sponsoredTweet) {
      return res.status(404).json({
        success: false,
        error: 'Sponsored tweet not found'
      });
    }

    console.log(`[SPONSORED TWEET] ${req.adminEmail} deactivated sponsored tweet: ${id}`);

    res.json({
      success: true,
      message: 'Sponsored tweet deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating sponsored tweet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate sponsored tweet'
    });
  }
});

// DELETE /sponsored-tweet/:id/permanent - Permanently delete sponsored tweet (Admin only)
router.delete("/:id/permanent", privyMiddleware, checkAdminPrivileges, async (req, res) => {
  try {
    const { id } = req.params;

    const sponsoredTweet = await SponsoredTweet.findByIdAndDelete(id);

    if (!sponsoredTweet) {
      return res.status(404).json({
        success: false,
        error: 'Sponsored tweet not found'
      });
    }

    console.log(`[SPONSORED TWEET] ${req.adminEmail} permanently deleted sponsored tweet: ${id}`);

    res.json({
      success: true,
      message: 'Sponsored tweet permanently deleted'
    });
  } catch (error) {
    console.error('Error permanently deleting sponsored tweet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to permanently delete sponsored tweet'
    });
  }
});

// GET /sponsored-tweet/:id/stats - Get performance stats for a sponsored tweet
router.get("/:id/stats", privyMiddleware, checkAdminPrivileges, async (req, res) => {
  try {
    const { id } = req.params;

    const sponsoredTweet = await SponsoredTweet.findById(id);
    if (!sponsoredTweet) {
      return res.status(404).json({
        success: false,
        error: 'Sponsored tweet not found'
      });
    }

    // Get participant data for this sponsored tweet
    const participants = await MemathonParticipant.find({ 
      sponsoredTweetId: id 
    }).populate('sponsoredTweetId');

    const stats = {
      totalParticipants: participants.length,
      totalTokensCreated: participants.length,
      totalValue: participants.reduce((sum, p) => sum + (p.tokenPerformance.currentMarketCap || 0), 0),
      averageMarketCap: participants.length > 0 
        ? participants.reduce((sum, p) => sum + (p.tokenPerformance.currentMarketCap || 0), 0) / participants.length 
        : 0,
      topPerformers: participants
        .sort((a, b) => b.winnerScore - a.winnerScore)
        .slice(0, 5)
        .map(p => ({
          twitterUsername: p.twitterUsername,
          tokenAddress: p.tokenContractAddress,
          marketCap: p.tokenPerformance.currentMarketCap,
          winnerScore: p.winnerScore,
          coinedAt: p.coinedAt
        }))
    };

    res.json({
      success: true,
      data: {
        sponsoredTweet,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching sponsored tweet stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

export default router; 