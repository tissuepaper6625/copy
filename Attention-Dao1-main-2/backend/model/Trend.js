import { model, Schema } from "mongoose";

const Trend = new Schema(
  {
    trend_name: String,
    tweet_count: Number,
  },
  {
    timestamps: true,
  }
);

const TrendModel = model("trend", Trend);

export default TrendModel;
