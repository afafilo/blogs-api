// models/Article.js
const { db } = require('../firebase.js');
const COLLECTION_NAME = "pages";

class Article {
  /**
   * Fetch articles by category with pagination
   */
static async getByCategory(website_id, category, limit = 6, page = 0) {
  // 1. Fetch all IDs that match the filter
  const snapshot = await db.collection(COLLECTION_NAME)
    .where("status", "==", "published")
    .where("website_id", "==", website_id)
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .get();

  // 2. Filter out unwanted slugs
  const filtered = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(item => item.slug !== "index");

  // 3. Slice the correct page
  const start = page * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    page,
    totalItems: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };
}



  /**
   * Get total count (must match same filtering)
   */
  static async getTotalCount(website_id, category) {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where("status", "==", "published")
      .where("website_id", "==", website_id)
      .where("category", "==", category)
      .get();

    // Remove index slug here too
    return snapshot.docs.filter(doc => doc.data().slug !== "index").length;
  }
}

module.exports = Article;
