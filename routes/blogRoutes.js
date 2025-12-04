const express = require('express'); 
const router = express.Router(); 
const blogController = require('../controllers/blogController');

router.get('/', blogController.getLatestOnePerCategory);
router.get('/per-category', blogController.getLatestBlogsPerCategory);
router.get('/latest', blogController.getLatestBlog);

module.exports = router;