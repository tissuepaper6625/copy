import express from "express";
import axios from "axios";
import ShortUniqueId from "short-unique-id";
import { privyMiddleware } from "../middleware/privyMiddleware.js";
import TokenModel from "../model/Token.js";
import { fetchPriceHistory } from "../utils/marketcap.js";
import { createPost, parseTwitterUrl, fetchTwitterAccount, fetchTwitterPost } from "../utils/tweets.js";
import { generateSplit } from "../utils/transaction.js";
import { PrivyClient } from "@privy-io/server-auth";
import { generateTokenMetadata } from "../utils/metadata.js";
import { checkUserCanCreate, updateUserLimits, updatePlatformLimits, getUserLimits } from "../utils/limits.js";
import { verifyPayment } from "../utils/payments.js";
import { requireEmailVerification, getEmailStatus } from "../utils/emailVerification.js";
import SponsoredTweet from "../model/SponsoredTweet.js";
import MemathonParticipant from "../model/MemathonParticipant.js";
import rateLimit from 'express-rate-limit';
import ImageModel from '../model/Image.js';

const router = express.Router();
const privy = new PrivyClient(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);

// Rate limiter: 5 requests per minute per IP for token deployment
const deployLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { status: 'error', message: 'Too many token creation requests, please try again later.' }
});

// Remove BYPASS_AUTH and use privyMiddleware for all environments
router.post("/deploy", deployLimiter, privyMiddleware, requireEmailVerification, async (req, res, next) => {
  try {
    const {
      name,
      symbol,
      image,
      description,
      original_post,
      generatedImage,
      generatedCaption,
      paymentId
    } = req.body;
    const user = req.user;
    const uid = new ShortUniqueId({ dictionary: "hex" });
    const requestKey = uid.stamp(32);
    
    if (!original_post || typeof original_post !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Invalid or missing original_post (tweet URL)' });
    }

    // Check user limits and payment requirements
    const limitsCheck = await checkUserCanCreate(user.id, user.wallet?.address, user.twitter?.username);
    console.log('[TOKEN DEPLOY] Limits check:', limitsCheck);
    
    // If user cannot create at all (platform limits, daily limits, etc.)
    if (!limitsCheck.canCreate) {
      return res.status(402).json({ 
        status: 'error', 
        message: 'Creation limit reached',
        details: `User daily remaining: ${limitsCheck.userDailyRemaining}, Platform remaining: ${limitsCheck.platformRemaining}`
      });
    }
    
    // If user requires payment but no paymentId provided
    if (limitsCheck.requiresPayment && !paymentId) {
      return res.status(402).json({ 
        status: 'error', 
        message: 'Payment required',
        details: `User free remaining: ${limitsCheck.userRemaining}, Payment amount: $${limitsCheck.paymentAmount / 100}`
      });
    }
    
    // If paymentId provided, verify the payment
    let isValidPayment = false;
    if (paymentId) {
      isValidPayment = await verifyPayment(user.id, paymentId);
      if (!isValidPayment) {
        return res.status(402).json({ 
          status: 'error', 
          message: 'Invalid or already used payment',
          details: `Payment ID: ${paymentId} could not be verified`
        });
      }
      console.log('[TOKEN DEPLOY] Payment verified:', paymentId);
    }

    // Use unclaimed wallet for influencer
    // const influencer = process.env.UNCLAIMED_WALLET_ADDRESS || "0x0000000000000000000000000000000000000000";
    // const attention = process.env.TREASURY_ADDRESS;
    const userAddress = user.wallet.address;
    // Determine influencer address
    let influencerAddress = process.env.UNCLAIMED_WALLET_ADDRESS || "0x0000000000000000000000000000000000000000";
    let influencerTwitter = "localtestuser";
    // If you have tweet context, extract influencer Twitter handle from it
    if (req.body.inspirationPost && req.body.inspirationPost.author && req.body.inspirationPost.author.username) {
      influencerTwitter = req.body.inspirationPost.author.username;
    } else if (req.body.influencer_twitter) {
      influencerTwitter = req.body.influencer_twitter;
    }
    // If influencer wallet is provided and valid, use it
    if (req.body.influencer_wallet && typeof req.body.influencer_wallet === 'string' && req.body.influencer_wallet.startsWith('0x') && req.body.influencer_wallet.length === 42) {
      influencerAddress = req.body.influencer_wallet;
    }
    const spltAddress = await generateSplit(process.env.TREASURY_ADDRESS, userAddress, influencerAddress);
    const result = await axios.post("https://www.clanker.world/api/tokens/deploy", {
      name,
      symbol,
      image,
      requestorAddress: spltAddress,
      creatorRewardsPercentage: 80,
      tokenPair: "WETH",
      description,
      requestKey
    }, {
      headers: {
        "x-api-key": process.env.CLANKER_API_KEY,
        "Content-Type": "application/json"
      }
    });
    const data = result.data;
    const postId = "localtestpostid";
    const newToken = new TokenModel({
      ...data,
      img_url: image,
      tweet: postId,
      original_post: original_post,
      owner_twitter: user.twitter.username,
      influencer_twitter: influencerTwitter,
      unclaimed: true,
      owner_address: userAddress,
      influencer_address: influencerAddress,
      generatedImage: generatedImage,
      generatedCaption: generatedCaption
    });
    // [Metadata] generate and attach metadata
    const generatedMetadata = await generateTokenMetadata(newToken);
    console.log('Generated metadata:', generatedMetadata);
    newToken.metadata = generatedMetadata;
    await newToken.save();
    // Direct update to ensure metadata is written
    await TokenModel.updateOne({ _id: newToken._id }, { $set: { metadata: generatedMetadata } });
    // Post about the token creation (optional, don't fail if this fails)
    try {
      const postResult = await createPost(description);
      if (postResult && postResult.success) {
        console.log('Token creation posted to Twitter:', postResult.tweetUrl);
      }
    } catch (postError) {
      console.error('Failed to post token creation to Twitter:', postError);
      // Don't fail the token creation if Twitter posting fails
    }
    // Check if this token was created from a sponsored tweet (memathon participation)
    try {
      // Extract tweet ID from original_post URL to check if it's sponsored
      const tweetIdMatch = original_post.match(/status\/(\d+)/);
      if (tweetIdMatch) {
        const tweetId = tweetIdMatch[1];
        const sponsoredTweet = await SponsoredTweet.findOne({ 
          tweetId: tweetId, 
          isActive: true 
        });

        if (sponsoredTweet) {
          // Get user's email for tracking
          const emailStatus = await getEmailStatus(req, res, () => {});
          
          // Create memathon participant record
          const participant = new MemathonParticipant({
            userId: user.id,
            userEmail: emailStatus?.emailAddress || 'unknown@example.com',
            twitterUsername: user.twitter.username,
            walletAddress: userAddress,
            sponsoredTweetId: sponsoredTweet._id,
            tokenContractAddress: data.contract_address,
            memathonSeason: sponsoredTweet.memathonSeason,
            category: sponsoredTweet.category,
            tokenPerformance: {
              initialMarketCap: parseFloat(data.starting_market_cap || '0'),
              currentMarketCap: parseFloat(data.starting_market_cap || '0')
            }
          });

          await participant.save();

          // Update sponsored tweet stats
          await SponsoredTweet.findByIdAndUpdate(sponsoredTweet._id, {
            $inc: { 
              'stats.coins': 1,
              'stats.participants': 1
            }
          });

          console.log(`[MEMATHON PARTICIPANT] ${user.twitter.username} created token ${data.contract_address} for sponsored tweet ${tweetId} in season ${sponsoredTweet.memathonSeason}`);
        }
      }
    } catch (memathonError) {
      console.error('Error tracking memathon participant:', memathonError);
      // Don't fail token creation if memathon tracking fails
    }

    // Update user and platform limits
    const isPaidToken = isValidPayment || false; // Token is paid if payment was verified
    await updateUserLimits(user.id, isPaidToken);
    await updatePlatformLimits(isPaidToken);
    
    console.log(`[TOKEN DEPLOY] Token created successfully. Contract: ${data.contract_address}, Paid: ${isPaidToken}, PaymentId: ${paymentId || 'none'}`);
    
    // Automatically post to X/Twitter during token deployment (View-on-X logic)
    try {
      // Generate comprehensive tweet text using the existing function
      const tweetText = createComprehensiveTweetText(newToken, newToken.metadata);
      
      // Post to Twitter with the token image through attention account
      const result = await createPost(tweetText, newToken.img_url);
      
      if (result && result.success) {
        // Store the tweet URL in the token document
        newToken.tweet_url = result.tweetUrl;
        await newToken.save();
        
        console.log(`[TOKEN DEPLOY] Token shared on X successfully! Tweet URL: ${result.tweetUrl}`);
      } else {
        console.error('[TOKEN DEPLOY] Failed to post to Twitter:', result?.error || 'Unknown error');
      }
    } catch (twitterError) {
      console.error('[TOKEN DEPLOY] Twitter posting error during deployment:', twitterError);
      // Don't fail token creation if Twitter posting fails
    }
    
    return res.status(200).json({ status: 'success', data: newToken });
  } catch (err) {
    // console.error('Bypass deploy error:', err);
    return res.status(500).json({ status: 'error', message: 'Bypass deploy failed', details: err.message });
  }
});

router.get("/fetch-influencers/:time", async (req, res) => {

  try {
    const { time = "market_cap" } = req.params;
    await TokenModel.aggregate([
      {
        $group: {
          _id: "$influencer_twitter",
          market_cap: { $sum: { $toDouble: `$${time}` } },
          last_market_cap: { $sum: { $toDouble: `$last_${time}` } },
          count: { $sum: 1 },
        }
      },
      {
        $sort: { market_cap: -1 }
      }
    ])
      .then(result => {
        res.status(200).json({
          influencers: result
        })
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err)
      });
  } catch (error) {

  }

});

router.get("/fetch-creators/:range", async (req, res) => {

  try {
    const { range = "market_cap" } = req.params;
    await TokenModel.aggregate([
      {
        $group: {
          _id: "$owner_twitter",
          market_cap: { $sum: { $toDouble: `$${range}` } },
          last_market_cap: { $sum: { $toDouble: `$last_${range}` } },
          count: { $sum: 1 },
        }
      },
      {
        $sort: { market_cap: -1 }
      }
    ])
      .then(result => {
        res.status(200).json({
          creators: result
        })
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err)
      });
  } catch (error) {

  }

});

router.post("/", async (req, res) => {
  const { query, searchBy, sortBy } = req.body;
  const regex = new RegExp(query, 'i');

  let matchStage = {};

  switch (searchBy) {
    case 'symbol':
      matchStage = { symbol: { $regex: regex } };
      break;
    case 'creator':
      matchStage = { owner_twitter: { $regex: regex } };
      break;
    case 'description':
      matchStage = { name: { $regex: regex } };
      break;
    case 'contract':
      matchStage = { contract_address: { $regex: regex } };
      break;
    case 'all':
    default:
      matchStage = {
        $or: [
          { name: { $regex: regex } },
          { symbol: { $regex: regex } },
          { owner_twitter: { $regex: regex } },
          { influencer_twitter: { $regex: regex } },
          { contract_address: { $regex: regex } }
        ]
      };
      break;
  }
  const pipeline = [
    { $match: matchStage }
  ];

  switch (sortBy) {
    case "trending":
      pipeline.push(
        {
          $addFields: {
            priceNum: { $toDouble: "$price" },
            lastPriceNum: { $toDouble: "$last_price" }
          }
        },
        {
          $addFields: {
            change: {
              $cond: [
                { $eq: ["$lastPriceNum", 0] },
                0,
                {
                  $multiply: [
                    { $divide: [{ $subtract: ["$priceNum", "$lastPriceNum"] }, "$lastPriceNum"] },
                    100
                  ]
                }
              ]
            }
          }
        },
        { $sort: { change: -1 } }
      );
      break;
    case "popular":
      pipeline.push({ $sort: { market_cap: -1 } });
      break;
    case "new":
    default:
      pipeline.push({ $sort: { created_at: -1 } });
      break;
  }

  const tokensRaw = await TokenModel.aggregate(pipeline);
  // For each token, fetch contentType from Image model
  const tokens = await Promise.all(tokensRaw.map(async (token) => {
    let contentType = undefined;
    if (token.generatedImage || token.img_url) {
      const imageDoc = await ImageModel.findOne({
        $or: [
          { ipfsUrl: token.generatedImage },
          { ipfsUrl: token.img_url },
          { gatewayUrl: token.generatedImage },
          { gatewayUrl: token.img_url }
        ]
      });
      if (imageDoc && imageDoc.contentType) {
        contentType = imageDoc.contentType;
      }
    }
    return { ...token, contentType };
  }));
  res.status(200).json({
    tokens
  });
});

router.get("/item/:contract_address", async (req, res) => {
  const { contract_address } = req.params;
  const token = await TokenModel.findOne({
    contract_address
  });

  let contentType = undefined;
  if (token && (token.generatedImage || token.img_url)) {
    // Try to find the image by IPFS URL (either generatedImage or img_url)
    const imageDoc = await ImageModel.findOne({
      $or: [
        { ipfsUrl: token.generatedImage },
        { ipfsUrl: token.img_url },
        { gatewayUrl: token.generatedImage },
        { gatewayUrl: token.img_url }
      ]
    });
    if (imageDoc && imageDoc.contentType) {
      contentType = imageDoc.contentType;
    }
  }

  res.status(200).json({
    token: token ? { ...token.toObject(), contentType } : null,
  });
});

router.post("/chart/:contract_address", async (req, res) => {
  const { contract_address } = req.params;
  const { duration } = req.body;
  const token = await TokenModel.findOne({
    contract_address
  });
  let market = {};
  if (token) {
    market = await fetchPriceHistory(token.contract_address, duration)
  }
  res.status(200).json({
    priceHistory: market?.market?.priceHistory ?? []
  });
});

router.get("/get-by-user/:username", async (req, res) => {
  const { username } = req.params;
  const tokens = await TokenModel.find({
    $or: [
      {
        owner_twitter: username,
      },
      {
        influencer_twitter: username
      }
    ]
  });

  res.status(200).json({
    tokens,
  });
});


router.get("/get-top-markets", async (req, res) => {
  const tokens = await TokenModel.aggregate([
    {
      $addFields: {
        priceNum: { $toDouble: "$price" },
        lastPriceNum: { $toDouble: "$last_price" }
      }
    },
    {
      $addFields: {
        change: {
          $cond: [
            { $eq: ["$lastPriceNum", 0] },
            0,
            {
              $multiply: [
                { $divide: [{ $subtract: ["$priceNum", "$lastPriceNum"] }, "$lastPriceNum"] },
                100
              ]
            }
          ]
        }
      }
    },
    { $sort: { change: -1 } },
    { $limit: 4 }
  ]);

  res.status(200).json({
    tokens
  });
});

router.post("/check-by-post", async(req, res) => {

  try {

    const { original_post, influencer, username } = req.body;
    const token = await TokenModel.findOne({
      owner_twitter: username,
      influencer_twitter: influencer,
      original_post: original_post
    });

    if (token) {
      res.status(200).json({
        status: true
      });
    } else {
      res.status(200).json({
        status: false
      });
    }

  } catch(error) {
    console.log(error)
    res.status(200).json({
      status: false
    });
  }

});

router.patch("/:contract_address", privyMiddleware, async (req, res) => {
  try {
    const { contract_address } = req.params;
    const updates = req.body;

    // Allowed fields for update
    const allowedUpdates = ['name', 'symbol', 'img_url', 'description'];
    const isValidUpdate = Object.keys(updates).every(key => allowedUpdates.includes(key));

    if (!isValidUpdate) {
      return res.status(400).json({
        error: "Invalid update fields",
        allowedFields: allowedUpdates
      });
    }

    // Find the token
    const token = await TokenModel.findOne({ contract_address });
    if (!token) {
      return res.status(404).json({ error: "Token not found" });
    }

    // Prepare mock CID and transaction hash
    const mockCID = `mockQm${Math.random().toString(36).substring(2, 15)}`;
    const mockTxHash = `0x${Math.random().toString(36).substring(2, 22)}`;

    // Update fields and versioning
    Object.keys(updates).forEach(key => {
      token[key] = updates[key];
    });
    token.metadata_cid = mockCID;
    token.metadata_version = (token.metadata_version || 1) + 1;
    token.last_updated = new Date();

    // Add to update history
    token.update_history = token.update_history || [];
    token.update_history.push({
      cid: mockCID,
      txHash: mockTxHash,
      updatedAt: new Date(),
      fields: Object.keys(updates)
    });

    // Save changes
    const updatedToken = await token.save();

    res.json({
      ...updatedToken.toObject(),
      mock_services: {
        ipfs_cid: mockCID,
        tx_hash: mockTxHash,
        message: "Production implementation requires API keys"
      }
    });
  } catch (error) {
    console.error("Metadata update error:", error);
    res.status(500).json({ error: "Failed to update metadata" });
  }
});

// New endpoint for influencers to claim their tokens
router.post("/claim/:contract_address", privyMiddleware, async (req, res) => {
  try {
    const { contract_address } = req.params;
    const user = req.user;
    const privyId = req.body.privyId || req.headers['x-privy-id'];
    if (!privyId) {
      return res.status(401).json({ status: 'error', message: 'Missing Privy user ID' });
    }
    const userData = await privy.getUserById(privyId);
    if (!userData) {
      return res.status(401).json({ status: 'error', message: 'User not found or not authenticated with Privy' });
    }
    
    // Find the token
    const token = await TokenModel.findOne({ contract_address });
    if (!token) {
      return res.status(404).json({ 
        status: "error",
        message: "Token not found" 
      });
    }
    
    // Check if token is unclaimed
    if (!token.unclaimed) {
      return res.status(400).json({ 
        status: "error",
        message: "This token is already claimed" 
      });
    }
    
    // Check if the user is the influencer
    if (userData.twitter.username !== token.influencer_twitter) {
      return res.status(403).json({ 
        status: "error",
        message: "Only the influencer can claim this token" 
      });
    }
    
    // Update the token with the influencer's wallet address
    const updatedToken = await TokenModel.findOneAndUpdate(
      { contract_address },
      { 
        $set: { 
          influencer_address: userData.wallet.address,
          unclaimed: false 
        } 
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: "success",
      message: "Token claimed successfully!",
      token: updatedToken
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status: "error",
      message: "Failed to claim token" 
    });
  }
});

// Get unclaimed tokens for a user
router.get("/unclaimed/:username", async (req, res) => {
  try {
    const { username } = req.params;
    
    const unclaimedTokens = await TokenModel.find({
      influencer_twitter: username,
      unclaimed: true
    });
    
    res.status(200).json({
      status: "success",
      unclaimedTokens,
      count: unclaimedTokens.length
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status: "error",
      message: "Failed to fetch unclaimed tokens" 
    });
  }
});

// PATCH /token/:contract_address - Update token metadata
router.patch("/:contract_address", privyMiddleware, async (req, res) => {
  try {
    const { contract_address } = req.params;
    const updates = req.body;

    // Allowed fields for update
    const allowedUpdates = ['name', 'symbol', 'img_url', 'description'];
    const isValidUpdate = Object.keys(updates).every(key => allowedUpdates.includes(key));

    if (!isValidUpdate) {
      return res.status(400).json({
        error: "Invalid update fields",
        allowedFields: allowedUpdates
      });
    }

    // Find the token
    const token = await TokenModel.findOne({ contract_address });
    if (!token) {
      return res.status(404).json({ error: "Token not found" });
    }

    // Prepare mock CID and transaction hash
    const mockCID = `mockQm${Math.random().toString(36).substring(2, 15)}`;
    const mockTxHash = `0x${Math.random().toString(36).substring(2, 22)}`;

    // Update fields and versioning
    Object.keys(updates).forEach(key => {
      token[key] = updates[key];
    });
    token.metadata_cid = mockCID;
    token.metadata_version = (token.metadata_version || 1) + 1;
    token.last_updated = new Date();

    // Add to update history
    token.update_history = token.update_history || [];
    token.update_history.push({
      cid: mockCID,
      txHash: mockTxHash,
      updatedAt: new Date(),
      fields: Object.keys(updates)
    });

    // Save changes
    const updatedToken = await token.save();

    res.json({
      ...updatedToken.toObject(),
      mock_services: {
        ipfs_cid: mockCID,
        tx_hash: mockTxHash,
        message: "Production implementation requires API keys"
      }
    });
  } catch (error) {
    console.error("Metadata update error:", error);
    res.status(500).json({ error: "Failed to update metadata" });
  }
});

router.post("/view-on-x/:contract_address", privyMiddleware, async (req, res) => {
  try {
    const { contract_address } = req.params;
    
    // Find the token
    const token = await TokenModel.findOne({ contract_address });
    if (!token) {
      return res.status(404).json({ 
        status: "error",
        message: "Token not found" 
      });
    }

    // Check if we have a stored tweet URL from deployment
    if (token.tweet_url) {
      return res.status(200).json({
        status: "success",
        message: "Redirecting to existing X post",
        tweetUrl: token.tweet_url,
        redirect: true
      });
    }

    // Fallback: If no stored tweet URL, create a new post (legacy behavior)
    console.log(`[VIEW-ON-X] No stored tweet URL found for ${contract_address}, creating new post`);
    
    // Generate or get existing metadata
    let metadata = token.metadata;
    if (!metadata) {
      metadata = await generateTokenMetadata(token);
      token.metadata = metadata;
      await token.save();
    }

    // Create comprehensive Twitter post with all necessary context
    const tweetText = createComprehensiveTweetText(token, metadata);
    
    try {
      // Post to Twitter with the token image through attention account
      const result = await createPost(tweetText, token.img_url);
      
      if (result && result.success) {
        // Store the tweet URL for future use
        token.tweet_url = result.tweetUrl;
        await token.save();
        
        res.status(200).json({
          status: "success",
          message: "Token shared on X successfully through attention account!",
          tweetContent: tweetText,
          twitterResult: result,
          tweetUrl: result.tweetUrl,
          tweetId: result.tweetId
        });
      } else {
        throw new Error('Failed to create tweet: ' + (result.error || 'Unknown error'));
      }
      
    } catch (twitterError) {
      console.error("Twitter posting error:", twitterError);
      res.status(500).json({
        status: "error", 
        message: "Failed to post to Twitter",
        details: twitterError.message || twitterError.error || 'Unknown Twitter error'
      });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status: "error",
      message: "Failed to share token on X" 
    });
  }
});

// POST /token/generate-share/:contract_address - "Share Button" functionality  
// Generates shareable content for users to share themselves
router.post("/generate-share/:contract_address", async (req, res) => {
  try {
    const { contract_address } = req.params;
    const { platform = "twitter" } = req.body; // Support different platforms
    
    // Find the token
    const token = await TokenModel.findOne({ contract_address });
    if (!token) {
      return res.status(404).json({ 
        status: "error",
        message: "Token not found" 
      });
    }

    // Generate or get existing metadata
    let metadata = token.metadata;
    if (!metadata) {
      metadata = await generateTokenMetadata(token);
      token.metadata = metadata;
      await token.save();
    }

    // Generate shareable content based on platform
    const shareableContent = generateShareableContent(token, metadata, platform);
    
    res.status(200).json({
      status: "success",
      message: "Shareable content generated successfully!",
      platform: platform,
      shareableContent: shareableContent
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status: "error",
      message: "Failed to generate shareable content" 
    });
  }
});

// POST /token/prepare-share/:contract_address - Prepare share content for user's draft
router.post("/prepare-share/:contract_address", privyMiddleware, async (req, res) => {
  try {
    const { contract_address } = req.params;
    const { shareMethod = "draft" } = req.body; // "draft" or "post"
    
    // Find the token
    const token = await TokenModel.findOne({ contract_address });
    if (!token) {
      return res.status(404).json({ 
        status: "error",
        message: "Token not found" 
      });
    }

    // Generate or get existing metadata
    let metadata = token.metadata;
    if (!metadata) {
      metadata = await generateTokenMetadata(token);
      token.metadata = metadata;
      await token.save();
    }

    // Create share text with meme caption and token details
    const memeCaption = token.generatedCaption || token.description || `Check out ${token.name} ($${token.symbol})`;
    const shareText = `${memeCaption}\n\n🚀 Token: ${token.name} ($${token.symbol})\n\n#MemeToken #CryptoLaunch #AttentionEconomy`;
    
    // Get the meme image URL
    const imageUrl = token.generatedImage || token.img_url;
    
    if (shareMethod === "post") {
      // Post directly using our Twitter API (same as "View on X")
      try {
        const result = await createPost(shareText, imageUrl);
        
        if (result && result.success) {
          res.status(200).json({
            status: "success",
            message: "Shared on X successfully with embedded image!",
            tweetContent: shareText,
            twitterResult: result,
            imageUrl: imageUrl,
            tweetUrl: result.tweetUrl,
            tweetId: result.tweetId
          });
        } else {
          throw new Error('Failed to create tweet: ' + (result.error || 'Unknown error'));
        }
        
      } catch (twitterError) {
        console.error("Twitter posting error:", twitterError);
        res.status(500).json({
          status: "error", 
          message: "Failed to post to Twitter",
          details: twitterError.message || twitterError.error || 'Unknown Twitter error'
        });
      }
    } else {
      // Return the prepared content for user's draft
      res.status(200).json({
        status: "success",
        message: "Share content prepared successfully!",
        shareContent: {
          text: shareText,
          imageUrl: imageUrl,
          twitterIntentUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
          downloadImageUrl: imageUrl // User can download this image to attach manually
        }
      });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status: "error",
      message: "Failed to prepare share content" 
    });
  }
});

// Helper function to create comprehensive tweet text for attention account posting
function createComprehensiveTweetText(token, metadata) {
  const { original_tweet, meme_creator, influencer, earning_potential } = metadata;
  
  // Start with meme-style content first
  let tweetText = `🚀 ${token.name} ($${token.symbol})\n\n`;
  
  // Add creator and influencer info
  if (meme_creator && meme_creator.twitter_handle) {
    tweetText += `👨‍🎨 Created by: @${meme_creator.twitter_handle}\n`;
  }
  
  if (influencer && influencer.twitter_handle) {
    tweetText += `⭐ Featuring: @${influencer.twitter_handle}\n`;
  }
  
  // Add trading link only (no contract address, no split)
  if (token.contract_address) {
    tweetText += `🔄 Trade: https://app.uniswap.org/swap?outputCurrency=${token.contract_address}\n`;
  }
  
  // Add hashtags
  tweetText += `\n#MemeToken #AttentionEconomy`;
  
  // Add original tweet at the end to simulate quote tweet appearance
  if (original_tweet && original_tweet.url) {
    tweetText += `\n\n📱 Inspired by: ${original_tweet.url}`;
  }
  
  // Keep under Twitter's character limit (280 chars)
  if (tweetText.length > 280) {
    // Always include these sections if present - prioritize essential info
    let essentialPart = `🚀 ${token.name} ($${token.symbol})\n`;
    
    if (meme_creator && meme_creator.twitter_handle) {
      essentialPart += `👨‍🎨 @${meme_creator.twitter_handle}\n`;
    }
    
    if (influencer && influencer.twitter_handle) {
      essentialPart += `⭐ @${influencer.twitter_handle}\n`;
    }
    
    // Always include trading link if contract exists
    if (token.contract_address) {
      essentialPart += `🔄 Trade: https://app.uniswap.org/swap?outputCurrency=${token.contract_address}\n`;
    }
    
    // Add hashtags
    essentialPart += `#MemeToken #AttentionEconomy`;
    
    // Always include "Inspired by" at the end if available (for repost functionality)
    if (original_tweet && original_tweet.url) {
      let remainingChars = 280 - essentialPart.length - 3; // 3 chars for "\n\n📱"
      if (remainingChars > 20) { // minimum space needed
        let inspiredUrl = original_tweet.url;
        if (inspiredUrl.length > remainingChars - 15) { // 15 chars for "📱 Inspired by: "
          inspiredUrl = inspiredUrl.substring(0, remainingChars - 18) + '...'; // 18 = "📱 Inspired by: " + "..."
        }
        essentialPart += `\n\n📱 Inspired by: ${inspiredUrl}`;
      }
    }
    
    // If still too long, trim hashtags but keep inspired by
    if (essentialPart.length > 280) {
      essentialPart = essentialPart.replace(/#MemeToken #AttentionEconomy/, '').trim();
      
      // Re-add inspired by if there's space
      if (original_tweet && original_tweet.url && essentialPart.length < 260) {
        let remainingChars = 280 - essentialPart.length - 3;
        if (remainingChars > 20) {
          let inspiredUrl = original_tweet.url;
          if (inspiredUrl.length > remainingChars - 15) {
            inspiredUrl = inspiredUrl.substring(0, remainingChars - 18) + '...';
          }
          essentialPart += `\n\n📱 ${inspiredUrl}`;
        }
      }
    }
    
    // Final hard trim if needed
    if (essentialPart.length > 280) {
      essentialPart = essentialPart.substring(0, 280);
    }
    
    tweetText = essentialPart;
  }
  
  return tweetText;
}

// Helper function to generate shareable content for different platforms
function generateShareableContent(token, metadata, platform) {
  const { original_tweet, meme_creator, influencer } = metadata;
  
  // Get the best available image (generated meme image takes priority)
  const memeImage = token.generatedImage || token.img_url;
  
  // Get the generated caption or fallback to description
  const memeCaption = token.generatedCaption || token.description || `Check out ${token.name} ($${token.symbol})`;
  
  switch (platform.toLowerCase()) {
    case "twitter":
    case "x":
      return {
        text: `${memeCaption}\n\n🚀 Token: ${token.name} ($${token.symbol})\n👨‍🎨 Created by @${meme_creator?.twitter_handle || 'creator'}\n⭐ Featuring @${influencer?.twitter_handle || 'influencer'}\n\n#MemeToken #CryptoLaunch #AttentionEconomy`,
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${memeCaption}\n\n🚀 ${token.name} ($${token.symbol})`)}&hashtags=MemeToken,CryptoLaunch,AttentionEconomy`,
        image: memeImage,
        memeCaption: memeCaption,
        tokenImage: memeImage
      };
      
    case "telegram":
      return {
        text: `${memeCaption}\n\n🚀 Token: ${token.name} ($${token.symbol})\n👨‍🎨 Creator: ${meme_creator?.twitter_handle || 'Unknown'}\n⭐ Influencer: ${influencer?.twitter_handle || 'Unknown'}\n📄 Contract: ${token.contract_address}\n\n#MemeToken #CryptoLaunch`,
        url: `https://t.me/share/url?url=${encodeURIComponent(token.contract_address)}&text=${encodeURIComponent(`${memeCaption}\n\n🚀 ${token.name} ($${token.symbol})`)}`,
        image: memeImage,
        memeCaption: memeCaption,
        tokenImage: memeImage
      };
      
    case "discord":
      return {
        text: `**${memeCaption}**\n\n**🚀 Token Alert: ${token.name} ($${token.symbol})**\n👨‍🎨 **Creator:** ${meme_creator?.twitter_handle || 'Unknown'}\n⭐ **Influencer:** ${influencer?.twitter_handle || 'Unknown'}\n📄 **Contract:** \`${token.contract_address}\`\n\n#MemeToken #CryptoLaunch`,
        image: memeImage,
        memeCaption: memeCaption,
        tokenImage: memeImage
      };
      
    default:
      return {
        text: `${memeCaption}\n\nToken: ${token.name} ($${token.symbol})\nCreator: ${meme_creator?.twitter_handle || 'Unknown'}\nInfluencer: ${influencer?.twitter_handle || 'Unknown'}\nContract: ${token.contract_address}`,
        image: memeImage,
        memeCaption: memeCaption,
        tokenImage: memeImage
      };
  }
}

export default router;
