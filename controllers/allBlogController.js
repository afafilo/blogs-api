// controllers/pagesController.js
const Pages = require('../models/allblog.js');

module.exports = {
  // GET /pages/:websiteId
  getAllPages: async (req, res) => {
    try {
      const { website_id } = req.params;
      const items = await Pages.getAll(website_id);
      return res.json({ items });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch pages." });
    }
  },

  // GET /pages/grouped/:websiteId
  getAllPagesGrouped: async (req, res) => {
    try {
      const { website_id } = req.params;
      const groups = await Pages.getAllGrouped(website_id);
      return res.json({ groups });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch grouped pages." });
    }
  }
};
