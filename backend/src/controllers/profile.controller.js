const User = require("../models/User.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            "gender", "ug_course", "ug_specialization", "interests",
            "skills", "cgpa", "has_certification", "certification_title",
            "is_working", "masters_field"
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[`profile.${field}`] = req.body[field];
            }
        });

        if (req.body.name) updates.name = req.body.name;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile, updateProfile };