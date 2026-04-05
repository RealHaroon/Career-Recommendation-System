const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profile.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/",  protect, getProfile);
router.put("/",  protect, updateProfile);

module.exports = router;