const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/User.model");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new ApiError(401, "Unauthorized — no token provided"));
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return next(new ApiError(401, "User no longer exists"));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ApiError(401, "Invalid or expired token"));
    }
};

module.exports = { protect };