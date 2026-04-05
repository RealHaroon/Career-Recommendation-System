const axios = require("axios");
const Recommendation = require("../models/Recommendation.model");
const ApiError = require("../utils/ApiError");

const getRecommendation = async (userId, profileData) => {
    let mlResponse;

    try {
        mlResponse = await axios.post(
            `${process.env.ML_SERVICE_URL}/predict`,
            profileData,
            { timeout: 10000 }
        );
    } catch (error) {
        throw new ApiError(503, "ML service unavailable — try again later");
    }

    const { career, confidence, top_5 } = mlResponse.data;

    const recommendation = await Recommendation.create({
        userId,
        input: profileData,
        career,
        confidence,
        top_5,
    });

    return recommendation;
};

const getUserHistory = async (userId) => {
    return Recommendation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);
};

module.exports = { getRecommendation, getUserHistory };