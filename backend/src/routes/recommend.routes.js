const express = require("express");
const { predict, history } = require("../controllers/recommend.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/",        protect, predict);
router.get("/history",  protect, history);

module.exports = router;