const express = require("express");
const authRoutes       = require("./auth.routes");
const profileRoutes    = require("./profile.routes");
const recommendRoutes  = require("./recommend.routes");
const feedbackRoutes   = require("./feedback.routes");

const router = express.Router();

router.use("/auth",       authRoutes);
router.use("/profile",    profileRoutes);
router.use("/recommend",  recommendRoutes);
router.use("/feedback",   feedbackRoutes);

module.exports = router;