import { model, Schema } from "mongoose";

const memathonSchema = new Schema({
    created_at: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'voting', 'completed', 'cancelled', 'on_hold'],
        default: 'draft',
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    voting_end_date: {
        type: Date,
    },
    max_participants: {
        type: Number,
        default: null, // null means unlimited
    },
    current_participants: {
        type: Number,
        default: 0,
    },
    theme: {
        type: String,
        required: true,
    },
    rules: {
        type: String,
    },
    prizes: {
        type: String,
    },
    organizer: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    is_public: {
        type: Boolean,
        default: true,
    },
    participants: [{
        userId: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        enrolled_at: {
            type: Date,
            default: Date.now,
        },
    }],
});

export default model("Memathon", memathonSchema); 