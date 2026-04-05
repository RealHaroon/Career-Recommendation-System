const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");
const helmet  = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const routes       = require("./src/routes/index");
const errorHandler = require("./src/middlewares/errorHandler.middleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.NODE_ENV === "production" ? "https://yourdomain.com" : "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, try again after 15 minutes",
});
app.use("/api/auth", limiter);

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "career-recommender-backend" });
});

app.use("/api", routes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;