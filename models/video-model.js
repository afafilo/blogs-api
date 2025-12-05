const { db } = require('../firebase.js');
const COLLECTION_NAME = "pages";

class Video {
  /**
   * Fetch articles by category with pagination
   */
static async getByCategory(website_id, category, limit = 6, page = 0) {
  // Adjust offset for pages after first
  const offsetCount = page === 0 ? 0 : (page * limit) + 1;

  let query = db.collection(COLLECTION_NAME)
    .where("status", "==", "published")
    .where("website_id", "==", website_id)
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .offset(offsetCount)
    .limit(limit);

  const snapshot = await query.get();

  const raw = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const filtered = raw.filter(item => item.slug !== "index");

  return { items: filtered };
}


 static async getLatest(website_id, category) {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where("status", "==", "published")
      .where("website_id", "==", website_id)
      .where("category", "==", category)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
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

module.exports = Video;
