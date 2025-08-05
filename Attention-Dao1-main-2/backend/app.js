import "dotenv/config";
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";
import cors from "cors";


import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import walletRouter from "./routes/wallet.js";
import cronJobRouter from "./routes/cronJob.js";
import postRouter from "./routes/post.js";
import trendRouter from "./routes/trend.js";
import tokenRouter from "./routes/token.js";
import splitRouter from "./routes/split.js";
import cronService from "./utils/cronJob.js";
import imageRouter from "./routes/image.js";
import aiImageGenerationRouter from "./routes/imageGeneration.js";
import memathonRouter from "./routes/memathon.js";
import sponsoredTweetRouter from "./routes/sponsoredTweet.js";
import memathonParticipantRouter from "./routes/memathonParticipant.js";
import mongoose from "mongoose";
import limitsRouter from "./routes/limits.js";
import paymentsRouter from "./routes/payments.js";
import stripeWebhookRouter from "./routes/stripeWebhook.js";
import routes from './routes/index.js';


const port = process.env.PORT || "4002";

const app = express();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected database successfully");
  })
  .catch((err) => console.log(err));


app.use(logger("dev"));
app.post('/api/payments/webhook', (req, res, next) => {
  console.log('Received POST to /api/payments/webhook');
  next();
});
app.use("/api/payments", stripeWebhookRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/test", indexRouter);
app.use("/auth", authRouter);
app.use("/auth", walletRouter);
app.use("/cron", cronJobRouter);
app.use("/post", postRouter);
app.use("/trend", trendRouter);
app.use("/token", tokenRouter);
app.use("/split", splitRouter);
app.use("/api/images", imageRouter);
app.use("/api/ai", aiImageGenerationRouter);
app.use("/memathon", memathonRouter);
app.use("/sponsored-tweet", sponsoredTweetRouter);
app.use("/memathon-participant", memathonParticipantRouter);
app.use("/api/limits", limitsRouter);
app.use("/api/payments", paymentsRouter);


app.get("/", async (req, res) => {
  res.json("Standard backend is working now!");
});

const server = http.createServer(app);

server.listen(port, () => {
  // cronService.initialize();
});
server.on("error", (err) => {
  console.log(err);
});

server.on("listening", onListening);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}

export default app;
