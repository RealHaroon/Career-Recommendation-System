const { registerUser, loginUser } = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ApiError(400, "Name, email and password are required"));
        }

        const result = await registerUser({ name, email, password });
        return res.status(201).json(new ApiResponse(201, result, "Account created successfully"));
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ApiError(400, "Email and password are required"));
        }

        const result = await loginUser({ email, password });
        return res.status(200).json(new ApiResponse(200, result, "Login successful"));
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched"));
};

module.exports = { register, login, getMe };