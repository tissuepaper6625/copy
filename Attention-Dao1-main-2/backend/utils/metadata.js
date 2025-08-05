import PostModel from "../model/Post.js";
import { TwitterApi } from "twitter-api-v2";

const twitter = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

export async function generateTokenMetadata(tokenDoc) {
  let post = null;
  try {
    post = await PostModel.findOne({ id: tokenDoc.tweet }).lean();
  } catch (e) {
    // fallback: post remains null
    console.log('PostModel lookup error:', e);
  }

  // Try to extract tweet ID from original_post if not found in DB
  let tweetId = tokenDoc.tweet;
  if (!post && tokenDoc.original_post) {
    const match = tokenDoc.original_post.match(/status\/(\d+)/);
    if (match) tweetId = match[1];
  }

  if (!post && tweetId) {
    try {
      const { data: tweet } = await twitter.v2.singleTweet(tweetId, {
        "tweet.fields": ["created_at", "entities"]
      });
      const tags = tweet.entities?.hashtags?.map(h => h.tag) || [];
      const metadata = {
        meme_image_url: tokenDoc.img_url || '',
        original_tweet: {
          url: tokenDoc.original_post || '',
          content: tweet.text,
          timestamp: new Date(tweet.created_at),
          tags
        },
        meme_creator: {
          wallet_address: tokenDoc.owner_address,
          twitter_handle: tokenDoc.owner_twitter
        },
        influencer: {
          wallet_address: tokenDoc.influencer_address,
          twitter_handle: tokenDoc.influencer_twitter
        },
        earning_potential: {
          token:  tokenDoc.unCollectedFeeToken,
          native: tokenDoc.unCollectedFeeNative,
          fee_breakdown: {
            creator_percentage:    80,
            influencer_percentage: 20
          }
        }
      };
      return metadata;
    } catch (e) {
      // fallback if Twitter fetch fails
      console.log('Twitter API error:', e);
    }
  }

  // fallback
  const metadata = {
    meme_image_url: tokenDoc.img_url || '',
    original_tweet: {
      url: tokenDoc.original_post || '',
      content: '',
      timestamp: '',
      tags: []
    },
    meme_creator: {
      wallet_address: tokenDoc.owner_address,
      twitter_handle: tokenDoc.owner_twitter
    },
    influencer: {
      wallet_address: tokenDoc.influencer_address,
      twitter_handle: tokenDoc.influencer_twitter
    },
    earning_potential: {
      token:  tokenDoc.unCollectedFeeToken,
      native: tokenDoc.unCollectedFeeNative,
      fee_breakdown: {
        creator_percentage:    80,
        influencer_percentage: 20
      }
    },
    warning: 'Post not found for tweet ID.'
  };
  return metadata;
}
