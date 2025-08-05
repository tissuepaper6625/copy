import mongoose from "mongoose";
import Memathon from "./model/Memathon.js";

const MONGO_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/attention";

const mockMemathons = [
  {
    name: "Summer Meme Fest",
    description: "Create the funniest summer-themed meme!",
    status: "active",
    start_date: new Date(Date.now() - 1000 * 60 * 60 * 24), // started yesterday
    end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // ends in 3 days
    theme: "Summer",
    rules: "No NSFW. Must be original.",
    prizes: "1st: $100, 2nd: $50, 3rd: $25",
    organizer: "admin",
    tags: ["summer", "funny", "contest"],
    is_public: true,
    current_participants: 0,
    participants: [],
  },
  {
    name: "Crypto Meme Battle",
    description: "Best meme about crypto wins!",
    status: "active",
    start_date: new Date(Date.now() - 1000 * 60 * 60 * 2), // started 2 hours ago
    end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // ends in 2 days
    theme: "Crypto",
    rules: "No plagiarism.",
    prizes: "1st: $200, 2nd: $100",
    organizer: "admin",
    tags: ["crypto", "blockchain", "funny"],
    is_public: true,
    current_participants: 0,
    participants: [],
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Memathon.deleteMany({});
  await Memathon.insertMany(mockMemathons);
  console.log("Mock memathons inserted!");
  process.exit();
}

seed(); 