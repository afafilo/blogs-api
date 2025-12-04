const Blog = require('../models/blog-model.js');

// Expect website_id as query param: /?website_id=abc123
exports.getLatestOnePerCategory = async (req, res) => {
  try {
    const { website_id } = req.query;
    if (!website_id) return res.status(400).json({ error: "website_id is required" });

    // 1️⃣ Get featured blog to skip
    const featuredBlog = await Blog.getLatestBlog(website_id);

    // 2️⃣ Get latest per category, skipping the highlighted
    const blogs = await Blog.getLatestPerCategory(
      website_id,
      1, // limit per category
      featuredBlog?.id // skip the highlighted blog
    );

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLatestBlogsPerCategory = async (req, res) => {
  try {
    const { website_id } = req.query;
    if (!website_id) return res.status(400).json({ error: "website_id is required" });

    const blogsByCategory = await Blog.getLatestPerCategory(website_id, 6);
    res.json(blogsByCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLatestBlog = async (req, res) => {
  try {
    const { website_id } = req.query;
    if (!website_id) return res.status(400).json({ error: "website_id is required" });

    const latestBlog = await Blog.getLatestBlog(website_id);
    res.json(latestBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};