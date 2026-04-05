const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        input: {
            type: Object,
            required: true,
        },
        career: {
            type: String,
            required: true,
        },
        confidence: {
            type: Number,
            required: true,
        },
        top_5: [
            {
                career:     String,
                confidence: Number,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);