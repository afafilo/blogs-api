const Category = require('../models/category-model.js');

exports.getCategorysByCategory = async (req, res) => {
  try {
    const { website_id, category, limit = 6, cursor = null } = req.query;

    if (!website_id || !category) {
      return res.status(400).json({
        error: "website_id and category are required"
      });
    }

    let startAfterDoc = null;

    if (cursor) {
      startAfterDoc = await Category.getDocSnapshotById(cursor);
      if (!startAfterDoc.exists) {
        return res.status(400).json({ error: "Invalid cursor document ID" });
      }
    }

    // Fetch items for current page
    const { items, nextPageToken } = await Category.getByCategory(
        website_id,
        category,
        parseInt(limit),
        startAfterDoc
    );

    // Fetch total count
    const totalItems = await Category.getTotalCount(website_id, category);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    return res.json({
      items,
      nextCursor: nextPageToken ? nextPageToken.id : null,
      totalItems,
      totalPages
    });

  } catch (err) {
    console.error("Error fetching Categorys:", err);
    res.status(500).json({ error: "Server error" });
  }
};
