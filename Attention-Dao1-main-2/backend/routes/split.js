import { Router } from "express";
import { privyMiddleware } from "../middleware/privyMiddleware.js";
import SplitModel from "../model/Split.js";
import { generateSplit } from "../utils/transaction.js";

const router = Router();

router.post("/add-new-split", privyMiddleware, async (req, res) => {

  try {
    const { id: privyId } = req.user;
    const userAddress = req.user.wallet?.address;

    if (!userAddress) {
      return res.status(400).json({
          status: false,
          error: "User wallet address not found.",
      });
    }

    const { attentionAddress, influencerAddress } = req.body;

    if (!attentionAddress || !influencerAddress) {
      return res.status(400).json({
        status: false,
        error: "Request body must include 'attentionAddress' and 'influencerAddress'.",
      });
    }
    
    const splitAddress = await generateSplit(
      attentionAddress,
      userAddress,
      influencerAddress
    );

    const newSplit = new SplitModel.create({
      privyId,
      splitAddress
    });

    const result = await newSplit.save();
    res.status(201).json({
      status: true,
      data: result
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      error
    });
  }

});

export default router;