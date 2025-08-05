import axios from "axios";
import { TwitterApi, EUploadMimeType } from "twitter-api-v2";
import path from 'path';
import https from 'https';
import fs from 'fs';

export const formatAndSortTopTweets = (tweetData) => {
  if (!tweetData || !tweetData.tweets || tweetData.tweets.length === 0) {
    return [];
  }

  const formattedTweets = tweetData.tweets.map((tweet) => {

    const metrics = {
      "retweet_count": tweet.retweetCount,
      "reply_count": tweet.replyCount,
      "like_count": tweet.likeCount,
      "quote_count": tweet.quoteCount,
      "bookmark_count": tweet.bookmarkCount,
      "view_count": tweet.viewCount
    };
    const engagementScore =
      (metrics.like_count || 0) * 1 +
      (metrics.retweet_count || 0) * 3 +
      (metrics.reply_count || 0) * 2 +
      (metrics.quote_count || 0) * 2;
    const media = tweet.extendedEntities.media?.map((entity) => entity.media_url_https);
    return {
      id: tweet.id,
      created_at: tweet.createdAt,
      text: tweet.text,
      author: {
        ...tweet.author,
        username: tweet.author.userName,
        profile_image: tweet.author.profilePicture
      },
      metrics: metrics,
      source: tweet.source,
      lang: tweet.lang,
      engagementScore,
      media
    };
  });

  return formattedTweets.sort((a, b) => b.engagementScore - a.engagementScore);
};

export const fetchTwitterAccount = async (username) => {
  try {
    const result = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
      }
    });
    return result.data.data
  } catch (err) {

  }
}

export const parseTwitterUrl = (url) => {
  const regex = /^https?:\/\/(?:www\.|mobile\.)?(twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/
  const match = url.match(regex)

  if (match) {
    return {
      username: match[2],
      postId: match[3]
    }
  } else {
    return null
  }
}

export const fetchTwitterPost = async (id) => {
  try {
    const { data } = await axios.get(`${process.env.TWITTER_API_IO_ENDPOINT}/tweets`, {
      headers: {
        'x-api-key': process.env.TWITTER_API_IO_KEY,
      },
      params: {
        tweet_ids: id
      }
    });
    return data.tweets[0];
  } catch (error) {
    console.log(error);
  }
}

export const createPost = async (text, imageUrl) => {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_KEY_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      bearerToken: process.env.TWITTER_BEARER_TOKEN,
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET
    });

    const rwClient = client.readWrite;

    //const imagePath = path.join("/root/standard/memecoin-launchpad/attention.ad/utils", 'temp_image.jpg');
    const imagePath = path.join(process.cwd(), 'temp_image.jpg');
    let media_id_string;

    // Guard: skip if imageUrl is missing or invalid
    if (!imageUrl || !/^https?:\/\//.test(imageUrl)) {
      console.error('Invalid or missing imageUrl for createPost:', imageUrl);
      return null;
    }

    // Download the image to a temporary file
    await new Promise((resolve, reject) => {
      const req = https.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          console.log(`Failed to download image, StatusCode: ${response.statusCode}`);
          reject(new Error(`Failed to download image, StatusCode: ${response.statusCode}`));
        }
        const fileStream = fs.createWriteStream(imagePath);
        response.pipe(fileStream);

        fileStream.on('finish', async () => {
          // Upload the image to Twitter
          const mediaUploadData = await rwClient.v1.uploadMedia(imagePath, { mimeType: EUploadMimeType.Jpeg });
          console.log('Image uploaded successfully:', mediaUploadData);
          resolve(mediaUploadData);
        });
      });
      req.on('error', (err) => {
        console.error('HTTPS request error:', err);
        reject(err);
      });
    }).then((mediaUploadData) => {
      media_id_string = mediaUploadData;
    })

    // Delete the temporary image file
    fs.unlinkSync(imagePath);

    console.info('media_id_string :>> ', media_id_string);

    const mediaData = await rwClient.v2.tweet(text, {
      media: {
        media_ids: [media_id_string]
      }
    });

    console.info('Tweet posted successfully:', mediaData);
    
    // Return the actual tweet data which contains the real tweet ID
    return {
      success: true,
      tweetId: mediaData.data.id,
      tweetUrl: `https://twitter.com/attentiondotad/status/${mediaData.data.id}`,
      mediaId: media_id_string,
      fullResponse: mediaData
    };
  } catch (error) {
    console.error('createPost error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create tweet',
      details: error
    };
  }
}

export const getUserFollowings = async (userName) => {
  try {
    const { data } = await axios.get(`${process.env.TWITTER_API_IO_ENDPOINT}/user/followings`, {
      headers: {
        'x-api-key': process.env.TWITTER_API_IO_KEY,
      },
      params: {
        userName
      }
    });

    return data.followings;
  } catch (error) {

  }
}

export const calculateViralScore = (tweet) => {
  // Default values for missing metrics
  const like_count = tweet.metrics.like_count || 0;
  const retweet_count = tweet.metrics.retweet_count || 0;
  const impression_count = tweet.metrics.impression_count || 10000; // Default impression count
  
  // Calculate engagement rate
  const engagementRate = (like_count + retweet_count * 2) / impression_count;
  
  // Calculate velocity (engagements per hour)
  const now = Date.now();
  const tweetTime = new Date(tweet.created_at).getTime();
  const hoursSinceCreation = Math.max(1, (now - tweetTime) / (1000 * 60 * 60));
  const velocity = (like_count + retweet_count * 2) / hoursSinceCreation;
  
  // Calculate viral score
  const viralScore = engagementRate * 100 + velocity / 10;
  
  return {
    is_viral: viralScore > 50, // Threshold for viral
    viral_score: viralScore,
    viral_metrics: {
      velocity,
      engagement_rate: engagementRate,
      impression_count
    }
  };
};

/**
 * Fetch full context for a tweet: details, replies, quotes, and trending hashtags
 * @param {string} tweetUrl - The tweet URL (x.com or twitter.com)
 * @returns {Promise<{tweet: object, replies: object[], quotes: object[], trends: string[]}>}
 */
export const fetchTweetContext = async (tweetUrl) => {
  const parsed = parseTwitterUrl(tweetUrl);
  if (!parsed) throw new Error('Invalid tweet URL');
  const { username, postId } = parsed;

  // 1. Fetch main tweet
  const tweet = await fetchTwitterPost(postId);

  // 2. Fetch replies (if available)
  let replies = [];
  try {
    const { data } = await axios.get(`${process.env.TWITTER_API_IO_ENDPOINT}/tweets/${postId}/replies`, {
      headers: { 'x-api-key': process.env.TWITTER_API_IO_KEY },
    });
    replies = data.tweets || [];
  } catch (e) {
    // Ignore if not available
  }

  // 3. Fetch quote tweets (if available)
  let quotes = [];
  try {
    const { data } = await axios.get(`${process.env.TWITTER_API_IO_ENDPOINT}/tweets/${postId}/quotes`, {
      headers: { 'x-api-key': process.env.TWITTER_API_IO_KEY },
    });
    quotes = data.tweets || [];
  } catch (e) {
    // Ignore if not available
  }

  // 4. Fetch trending hashtags/topics
  let trends = [];
  try {
    const { data } = await axios.get(`${process.env.TWITTER_API_IO_ENDPOINT}/trends`, {
      headers: { 'x-api-key': process.env.TWITTER_API_IO_KEY },
    });
    trends = (data.trends || []).map(t => t.trend_name || t.name).filter(Boolean);
  } catch (e) {
    // Ignore if not available
  }

  return { tweet, replies, quotes, trends };
};
