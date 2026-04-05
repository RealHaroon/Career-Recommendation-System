const express = require("express");
const { submitFeedback } = require("../controllers/feedback.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, submitFeedback);

module.exports = router;