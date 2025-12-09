// routes/pages.js
const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/allBlogController.js');

router.get('/pages/:website_id', pagesController.getAllPages);
router.get('/pages/grouped/:website_id', pagesController.getAllPagesGrouped);

module.exports = router;
