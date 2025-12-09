const Video = require('../models/video-model.js');

exports.getVideosByCategory = async (req, res) => {
  try {
    const { website_id, category, limit = 6, page = 0 } = req.query;

    if (!website_id || !category) {
      return res.status(400).json({ error: "website_id and category are required" });
    }

    const pageNum = parseInt(page);
    const parsedLimit = parseInt(limit);

    // Get the latest video only for first page
    let latestId = null;
    if (pageNum === 0) {
      const latestVideo = await Video.getLatest(website_id, category);
      latestId = latestVideo ? latestVideo.id : null;
    }

    // Fetch limit + 2 items on first page to ensure we still get `limit` after filtering
    const fetchLimit = parsedLimit + (pageNum === 0 ? 2 : 1);

    const { items: rawItems } = await Video.getByCategory(
      website_id,
      category,
      fetchLimit,
      pageNum
    );

    let filteredItems = rawItems;

    // Remove latest only for first page
    if (pageNum === 0 && latestId) {
      filteredItems = filteredItems.filter(item => item.id !== latestId);
    }

    // Slice to exact limit
    if (pageNum === 0) {
      filteredItems = filteredItems.slice(0, parsedLimit);
    } else {
      filteredItems = rawItems.slice(0, parsedLimit);
    }

    const totalItems = await Video.getTotalCount(website_id, category);
    const adjustedTotal = pageNum === 0 && latestId ? totalItems - 1 : totalItems;
    const totalPages = Math.ceil(adjustedTotal / parsedLimit);

    return res.json({
      items: filteredItems,
      page: pageNum,
      totalItems: adjustedTotal,
      totalPages
    });

  } catch (err) {
    console.error("Error fetching Categories:", err);
    res.status(500).json({ error: "Server error" });
  }
};





exports.getLatestVideo = async (req, res) => {
  try {
    const { website_id, category } = req.query;

    if (!website_id || !category) {
      return res.status(400).json({ error: "website_id is required" });
    }

    const latestVideo = await Video.getLatest(website_id,category);

    if (!latestVideo) {
      return res.status(404).json({ error: "No videos found" });
    }

    return res.json({ item: latestVideo });

  } catch (err) {
    console.error("Error fetching latest video:", err);
    res.status(500).json({ error: "Server error" });
  }
};