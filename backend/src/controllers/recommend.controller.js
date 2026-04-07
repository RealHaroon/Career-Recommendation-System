const { getRecommendation, getUserHistory } = require("../services/recommend.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const REQUIRED_FIELDS = [
    "gender", "ug_degree", "specialization", "interests",
    "skills", "cgpa", "has_certification", "is_working"
];

const recommend = async (req, res, next) => {
    try {
        const missing = REQUIRED_FIELDS.filter((f) => !req.body[f] && req.body[f] !== 0);
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

module.exports = { recommend, history };