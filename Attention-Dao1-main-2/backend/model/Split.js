import { model, Schema } from "mongoose";

const Split = new Schema(
  {
    privyId: String,
    splitAddress: String
  },
  {
    timestamps: true
  }
);

const SplitModel = model("split", Split);

export default SplitModel;
