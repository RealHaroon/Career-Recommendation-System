const Feedback = require("../models/Feedback.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const submitFeedback = async (req, res, next) => {
    try {
        const { recommendationId, rating, comment, wasHelpful } = req.body;

        if (!recommendationId || rating === undefined || wasHelpful === undefined) {
            return next(new ApiError(400, "recommendationId, rating and wasHelpful are required"));
        }

        const existing = await Feedback.findOne({
            userId: req.user._id,
            recommendationId,
        });

        if (existing) {
            return next(new ApiError(409, "Feedback already submitted for this recommendation"));
        }

        const feedback = await Feedback.create({
            userId: req.user._id,
            recommendationId,
            rating,
            comment: comment || "",
            wasHelpful,
        });

        return res.status(201).json(new ApiResponse(201, feedback, "Feedback submitted"));
    } catch (error) {
        next(error);
    }
};

module.exports = { submitFeedback };