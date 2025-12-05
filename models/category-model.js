// models/Article.js
const { db } = require('../firebase.js');
const COLLECTION_NAME = "pages";

class Article {
  /**
   * Fetch articles by category with pagination
   */
static async getByCategory(website_id, category, limit = 6, page = 0) {
  let query = db.collection(COLLECTION_NAME)
    .where("status", "==", "published")
    .where("website_id", "==", website_id)
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .offset(page * limit)
    .limit(limit + 1);

  const snapshot = await query.get();

  const raw = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const filtered = raw.filter(item => item.slug !== "index");

  const items = filtered.slice(0, limit);

  const nextPageToken =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { items, nextPageToken };
}



  /**
   * Convert ID → snapshot (required for startAfter queries)
   */
  static async getDocSnapshotById(id) {
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    return await docRef.get();
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
