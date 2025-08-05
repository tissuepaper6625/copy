import { Router } from "express";
import MemathonParticipant from "../model/MemathonParticipant.js";
import SponsoredTweet from "../model/SponsoredTweet.js";
import TokenModel from "../model/Token.js";
import { privyMiddleware } from "../middleware/privyMiddleware.js";
import { checkAdminPrivileges } from "../utils/adminAuth.js";

const router = Router();

// GET /memathon-participant - Get participants with filtering
router.get("/", async (req, res) => {
  try {
    const { season, category, limit = 50, page = 1 } = req.query;
    
    let filter = {};
    if (season) filter.memathonSeason = parseInt(season);
    if (category && category !== 'all') filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const participants = await MemathonParticipant.find(filter)
      .populate({
        path: 'sponsoredTweetId',
        select: '_id tweetContent category memathonSeason isActive'
      })
      .sort({ winnerScore: -1, coinedAt: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Include all participants even if their sponsored tweet was deleted
    const validParticipants = participants;

    const total = await MemathonParticipant.countDocuments(filter);

    res.json({
      success: true,
      data: validParticipants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch participants'
    });
  }
});

// GET /memathon-participant/leaderboard - Get leaderboard with query params
router.get("/leaderboard", async (req, res) => {
  try {
    const { season, category } = req.query;
    
    // Build filter
    let filter = {};
    if (season) filter.memathonSeason = parseInt(season);
    if (category && category !== 'all') filter.category = category;
    
    const participants = await MemathonParticipant.find(filter)
      .populate({
        path: 'sponsoredTweetId',
        select: '_id tweetContent category memathonSeason isActive'
      })
      .sort({ winnerScore: -1, coinedAt: 1 })
      .limit(50)
      .lean();

    // Include all participants even if their sponsored tweet was deleted
    // The participants already created tokens and should remain in the leaderboard
    const validParticipants = participants;

    // Calculate rankings
    const leaderboard = validParticipants.map((participant, index) => ({
      ...participant,
      rank: index + 1,
      isWinner: index < 3, // Top 3 are winners
      performance: participant.performance || {
        marketCap: participant.tokenPerformance?.currentMarketCap || 0,
        volume24h: participant.tokenPerformance?.volume24h || 0,
        priceChange24h: participant.tokenPerformance?.priceChange24h || 0,
        holders: participant.tokenPerformance?.holders || 0,
        score: participant.winnerScore || 0
      }
    }));

    res.json({
      success: true,
      data: leaderboard,
      season: season ? parseInt(season) : null,
      category: category || 'all',
      totalParticipants: validParticipants.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// GET /memathon-participant/leaderboard/:season/:category - Get leaderboard with path params (legacy)
router.get("/leaderboard/:season/:category", async (req, res) => {
  try {
    const { season, category } = req.params;
    
    const participants = await MemathonParticipant.find({
      memathonSeason: parseInt(season),
      category: category
    })
    .populate({
      path: 'sponsoredTweetId',
      select: '_id tweetContent category memathonSeason isActive'
    })
    .sort({ winnerScore: -1, coinedAt: 1 })
    .limit(50)
    .lean();

    // Include all participants even if their sponsored tweet was deleted
    const validParticipants = participants;

    // Calculate rankings
    const leaderboard = validParticipants.map((participant, index) => ({
      ...participant,
      rank: index + 1,
      isWinner: index < 3 // Top 3 are winners
    }));

    res.json({
      success: true,
      data: {
        season: parseInt(season),
        category,
        leaderboard,
        totalParticipants: validParticipants.length
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// POST /memathon-participant/calculate-scores - Calculate winner scores (Admin only)
router.post("/calculate-scores", privyMiddleware, checkAdminPrivileges, async (req, res) => {
  try {
    const { season, category } = req.body;
    
    if (!season || !category) {
      return res.status(400).json({
        success: false,
        error: 'Season and category are required'
      });
    }

    const participants = await MemathonParticipant.find({
      memathonSeason: season,
      category: category
    });

    let updatedCount = 0;

    for (const participant of participants) {
      try {
        // Fetch latest token data
        const token = await TokenModel.findOne({ 
          contract_address: participant.tokenContractAddress 
        });

        if (token) {
          // Update performance metrics
          const currentMarketCap = parseFloat(token.market_cap || '0');
          const volume24h = parseFloat(token.volume24H || '0');
          const holders = parseInt(token.holders || '0');

          // Calculate winner score based on multiple factors
          const timeBonusMultiplier = calculateTimeBonusMultiplier(participant.coinedAt, season);
          const marketCapScore = currentMarketCap * 0.4;
          const volumeScore = volume24h * 0.3;
          const holdersScore = holders * 100 * 0.2;
          const engagementScore = (participant.tokenPerformance.socialEngagement?.views || 0) * 0.1;
          
          const winnerScore = Math.round(
            (marketCapScore + volumeScore + holdersScore + engagementScore) * timeBonusMultiplier
          );

          // Update participant record
          await MemathonParticipant.findByIdAndUpdate(participant._id, {
            $set: {
              'tokenPerformance.currentMarketCap': currentMarketCap,
              'tokenPerformance.volume24h': volume24h,
              'tokenPerformance.holders': holders,
              'tokenPerformance.peakMarketCap': Math.max(
                participant.tokenPerformance.peakMarketCap || 0,
                currentMarketCap
              ),
              winnerScore: winnerScore
            }
          });

          updatedCount++;
        }
      } catch (participantError) {
        console.error(`Error updating participant ${participant._id}:`, participantError);
      }
    }

    console.log(`[SCORE CALCULATION] ${req.adminEmail} calculated scores for ${updatedCount} participants in season ${season}, category ${category}`);

    res.json({
      success: true,
      message: `Updated scores for ${updatedCount} participants`,
      data: {
        season,
        category,
        updatedCount,
        totalParticipants: participants.length
      }
    });
  } catch (error) {
    console.error('Error calculating scores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate scores'
    });
  }
});

// POST /memathon-participant/select-winners - Select and award winners (Admin only)
router.post("/select-winners", privyMiddleware, checkAdminPrivileges, async (req, res) => {
  try {
    const { season, category, prizes } = req.body;
    
    if (!season || !category || !prizes || !Array.isArray(prizes)) {
      return res.status(400).json({
        success: false,
        error: 'Season, category, and prizes array are required',
        example: {
          season: 1,
          category: 'politics',
          prizes: [
            { placement: 1, amount: 1000, currency: 'USD' },
            { placement: 2, amount: 500, currency: 'USD' },
            { placement: 3, amount: 250, currency: 'USD' }
          ]
        }
      });
    }

    // Get top participants by score
    const topParticipants = await MemathonParticipant.find({
      memathonSeason: season,
      category: category
    })
    .sort({ winnerScore: -1, coinedAt: 1 })
    .limit(prizes.length);

    const winners = [];

    for (let i = 0; i < Math.min(topParticipants.length, prizes.length); i++) {
      const participant = topParticipants[i];
      const prize = prizes[i];

      // Update participant with winner info
      await MemathonParticipant.findByIdAndUpdate(participant._id, {
        $set: {
          placement: prize.placement,
          'prize.amount': prize.amount,
          'prize.currency': prize.currency,
          'prize.awarded': true,
          'prize.awardedAt': new Date()
        }
      });

      winners.push({
        placement: prize.placement,
        participant: participant.twitterUsername,
        email: participant.userEmail,
        tokenAddress: participant.tokenContractAddress,
        winnerScore: participant.winnerScore,
        prize: prize
      });
    }

    console.log(`[WINNER SELECTION] ${req.adminEmail} selected ${winners.length} winners for season ${season}, category ${category}`);

    res.json({
      success: true,
      message: `Selected ${winners.length} winners`,
      data: {
        season,
        category,
        winners,
        totalParticipants: topParticipants.length
      }
    });
  } catch (error) {
    console.error('Error selecting winners:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to select winners'
    });
  }
});

// GET /memathon-participant/stats/:season/:category - Get detailed stats
router.get("/stats/:season/:category", privyMiddleware, checkAdminPrivileges, async (req, res) => {
  try {
    const { season, category } = req.params;
    
    const participants = await MemathonParticipant.find({
      memathonSeason: parseInt(season),
      category: category
    }).populate('sponsoredTweetId');

    const stats = {
      totalParticipants: participants.length,
      totalTokensCreated: participants.length,
      totalValue: participants.reduce((sum, p) => sum + (p.tokenPerformance.currentMarketCap || 0), 0),
      averageMarketCap: participants.length > 0 
        ? participants.reduce((sum, p) => sum + (p.tokenPerformance.currentMarketCap || 0), 0) / participants.length 
        : 0,
      
      // Time distribution
      participationByDay: getParticipationByDay(participants),
      
      // Performance metrics
      topPerformers: participants
        .sort((a, b) => b.winnerScore - a.winnerScore)
        .slice(0, 10)
        .map(p => ({
          twitterUsername: p.twitterUsername,
          tokenAddress: p.tokenContractAddress,
          marketCap: p.tokenPerformance.currentMarketCap,
          winnerScore: p.winnerScore,
          coinedAt: p.coinedAt
        })),
      
      // Winner info
      winners: participants
        .filter(p => p.placement)
        .sort((a, b) => a.placement - b.placement)
        .map(p => ({
          placement: p.placement,
          twitterUsername: p.twitterUsername,
          prize: p.prize,
          winnerScore: p.winnerScore
        }))
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

// Helper function to calculate time bonus multiplier (early birds get bonus)
function calculateTimeBonusMultiplier(coinedAt, season) {
  // Early participation gets bonus (first 24 hours = 1.5x, first week = 1.2x)
  const now = new Date();
  const timeDiff = now - new Date(coinedAt);
  const hours = timeDiff / (1000 * 60 * 60);
  
  if (hours <= 24) return 1.5;
  if (hours <= 168) return 1.2; // 7 days
  return 1.0;
}

// Helper function to get participation by day
function getParticipationByDay(participants) {
  const byDay = {};
  participants.forEach(p => {
    const day = new Date(p.coinedAt).toISOString().split('T')[0];
    byDay[day] = (byDay[day] || 0) + 1;
  });
  return byDay;
}

export default router; 