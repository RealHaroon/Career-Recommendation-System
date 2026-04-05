const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recommendationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recommendation",
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            default: "",
        },
        wasHelpful: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);