// routes/articleRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController.js");

router.get("/", videoController.getVideosByCategory);
router.get("/latest", videoController.getLatestVideo);

module.exports = router;
