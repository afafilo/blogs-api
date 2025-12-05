const Category = require('../models/category-model.js');

exports.getCategorysByCategory = async (req, res) => {
  try {
    const { website_id, category, limit = 6, page = 0 } = req.query;

    if (!website_id || !category) {
      return res.status(400).json({ error: "website_id and category are required" });
    }

    const pageNum = parseInt(page);

    const { items } = await Category.getByCategory(
      website_id,
      category,
      parseInt(limit),
      pageNum
    );

    const totalItems = await Category.getTotalCount(website_id, category);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    return res.json({
      items,
      page: pageNum,
      totalItems,
      totalPages
    });

  } catch (err) {
    console.error("Error fetching Categorys:", err);
    res.status(500).json({ error: "Server error" });
  }
};

