import express from "express";
import cronService from "../utils/cronJob.js";

const router = express.Router();

router.get("/status", (_, res) => {
  res.json(cronService.getStatus());
});

router.post("/:jobName/start", (req, res) => {
  const success = cronService.startJob(req.params.jobName);
  if (success) {
    res.json({
      status: "success",
      message: `Job ${req.params.jobName} started`,
    });
  } else {
    res.status(400).json({
      status: "error",
      message: `Could not start job ${req.params.jobName}`,
    });
  }
});

router.post("/:jobName/stop", (req, res) => {
  const success = cronService.stopJob(req.params.jobName);
  if (success) {
    res.json({
      status: "success",
      message: `Job ${req.params.jobName} stopped`,
    });
  } else {
    res.status(400).json({
      status: "error",
      message: `Could not stop job ${req.params.jobName}`,
    });
  }
});

export default router;
