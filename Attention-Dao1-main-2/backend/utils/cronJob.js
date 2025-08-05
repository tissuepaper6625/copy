import axios from "axios";
import { CronJob } from "cron";
import Post from "../model/Post.js";
import Trend from "../model/Trend.js";
import { formatAndSortTopTweets, calculateViralScore } from "./tweets.js";

const TWITTER_API_IO_KEY = process.env.TWITTER_API_IO_KEY;
const v2BaseUrl = "https://api.twitter.com/2";

class CronService {
  constructor() {
    this.jobs = {};
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    console.info("Initializing cron jobs...");

    this.addJob("databaseCleanup", "0 */5 * * *", async () => {
      try {
        console.info("Running database cleanup job");
        const twitterClient = axios.create({
          headers: {
            'x-api-key': TWITTER_API_IO_KEY,
          },
        });
        
        // Fetch current trends
        const trendsResponse = await twitterClient.get(
          `${v2BaseUrl}/trends/?woeid=23424977&&max_trends=50`
        );
        const trends = trendsResponse.data;

        // Update trends collection
        await Trend.bulkWrite(
          trends.data.map((trend) => ({
            updateOne: {
              filter: { trend_name: trend.name },
              update: { $set: trend },
              upsert: true,
            },
          }))
        );

        // Process each trend's tweets
        await Promise.all(
          trends.data.map(async (trend) => {
            try {
              const tweetsResponse = await twitterClient.get(
                `${v2BaseUrl}/tweet/advanced_search`,
                { params: { query: trend.name } }
              );
              
              // Format tweets and calculate viral scores
              const formattedTweets = formatAndSortTopTweets(tweetsResponse.data);
              const tweetsWithViralScores = formattedTweets.map(tweet => {
                const viralData = calculateViralScore(tweet);
                return {
                  ...tweet,
                  ...viralData,
                  trend_name: trend.name
                };
              });

              // Update posts collection
              await Post.bulkWrite(
                tweetsWithViralScores.map((tweet) => ({
                  updateOne: {
                    filter: { id: tweet.id },
                    update: { $set: tweet },
                    upsert: true,
                  },
                }))
              );
              
              console.info(`Processed ${tweetsWithViralScores.length} tweets for trend: ${trend.name}`);
            } catch (error) {
              console.error(`Error processing trend ${trend.name}:`, error);
            }
          })
        );
        
        console.info("Trends and tweets updated with viral scores");
      } catch (error) {
        console.error("Database cleanup job failed", error);
      }
    });

    this.initialized = true;
    console.info("All cron jobs initialized");
  }

  addJob(name, cronTime, task, timezone = "UTC") {
    if (this.jobs[name]) {
      console.warn(`Cron job "${name}" already exists and will be replaced`);
      this.jobs[name].stop();
    }

    console.info(
      `Adding cron job: ${name}, schedule: ${cronTime}, timezone: ${timezone}`
    );

    this.jobs[name] = new CronJob(
      cronTime,
      async () => {
        const startTime = Date.now();
        console.info(`Starting cron job: ${name}`);

        try {
          await task();
          const duration = Date.now() - startTime;
          console.info(`Cron job completed: ${name}, duration: ${duration}ms`);
        } catch (error) {
          console.error(`Cron job failed: ${name}`, { error });
        }
      },
      null,
      true,
      timezone
    );

    return this.jobs[name];
  }

  startJob(name) {
    if (!this.jobs[name]) {
      console.warn(`Cannot start job "${name}": job does not exist`);
      return false;
    }

    if (!this.jobs[name].running) {
      console.info(`Starting cron job: ${name}`);
      this.jobs[name].start();
      return true;
    }

    console.info(`Cron job "${name}" is already running`);
    return false;
  }

  stopJob(name) {
    if (!this.jobs[name]) {
      console.warn(`Cannot stop job "${name}": job does not exist`);
      return false;
    }

    if (this.jobs[name].running) {
      console.info(`Stopping cron job: ${name}`);
      this.jobs[name].stop();
      return true;
    }

    console.info(`Cron job "${name}" is already stopped`);
    return false;
  }

  getStatus() {
    return Object.keys(this.jobs).map((name) => ({
      name,
      running: this.jobs[name].running,
      cronTime: this.jobs[name].cronTime.source,
      nextDate: this.jobs[name].running
        ? this.jobs[name].nextDate().toISOString()
        : null,
    }));
  }

  stopAll() {
    console.info("Stopping all cron jobs...");

    Object.keys(this.jobs).forEach((name) => {
      if (this.jobs[name].running) {
        this.jobs[name].stop();
        console.info(`Stopped cron job: ${name}`);
      }
    });

    console.info("All cron jobs stopped");
  }
}

const cronService = new CronService();

export default cronService;
