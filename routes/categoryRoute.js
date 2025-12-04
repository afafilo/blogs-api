// routes/articleRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController.js");

// GET /articles/category?website_id=123&category=dating&limit=6&cursor=abc123
router.get("/", categoryController.getCategorysByCategory);

module.exports = router;
