import { model, Schema } from "mongoose";

const Post = new Schema(
  {
    id: String,
    created_at: String,
    text: String,
    author: {
      name: String,
      username: String,
      verified: Boolean,
      description: String,
      profile_image: String,
      follower_count: Number,
    },
    metrics: {
      retweet_count: Number,
      reply_count: Number,
      like_count: Number,
      quote_count: Number,
      bookmark_count: Number,
      view_count: Number,
    },
    media: [String],
    lang: String,
    engagementScore: Number,
    trend_name: String,
// New viral tracking fields
    is_viral: { 
      type: Boolean, 
      default: false 
    },
    viral_score: { 
      type: Number, 
      default: 0 
    },
    viral_metrics: {
      velocity: Number,
      engagement_rate: Number,
      impression_count: Number
    }
  },
  {
    timestamps: true,
  }
);

const PostModel = new model("post", Post);

export default PostModel;
