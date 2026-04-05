const { getRecommendation, getUserHistory } = require("../services/recommend.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const predict = async (req, res, next) => {
    try {
        const required = [
            "gender", "ug_course", "ug_specialization", "interests",
            "skills", "cgpa", "has_certification", "certification_title",
            "is_working", "masters_field"
        ];

        const missing = required.filter((f) => req.body[f] === undefined || req.body[f] === "");
        if (missing.length > 0) {
            return next(new ApiError(400, `Missing fields: ${missing.join(", ")}`));
        }

        const result = await getRecommendation(req.user._id, req.body);
        return res.status(200).json(new ApiResponse(200, result, "Recommendation generated"));
    } catch (error) {
        next(error);
    }
};

const history = async (req, res, next) => {
    try {
        const records = await getUserHistory(req.user._id);
        return res.status(200).json(new ApiResponse(200, records, "History fetched"));
    } catch (error) {
        next(error);
    }
};

module.exports = { predict, history };