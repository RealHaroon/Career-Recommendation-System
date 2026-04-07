const express = require("express");
const { recommend, history } = require("../controllers/recommend.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, recommend);
router.get("/history", protect, history);

module.exports = router;