const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const registerUser = async ({ name, email, password }) => {
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, "Email already registered");

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return { user: user.toSafeObject(), token };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid email or password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    const token = generateToken(user._id);
    return { user: user.toSafeObject(), token };
};

module.exports = { registerUser, loginUser };