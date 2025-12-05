// models/Article.js
const { db } = require('../firebase.js');
const COLLECTION_NAME = "pages";

class Article {
  /**
   * Fetch articles by category with pagination
   */
  static async getByCategory(website_id, category, limit = 6, startAfterDoc = null) {
    let query = db.collection(COLLECTION_NAME)
      .where("status", "==", "published")
      .where("website_id", "==", website_id)
      .where("category", "==", category)
      .orderBy("createdAt", "desc")   // ← PURE NEWEST FIRST
      .limit(limit + 1);              // fetch +1 for filtering

    if (startAfterDoc) {
      query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.get();

    // Convert docs
    const raw = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Remove "index" SLUG (done here, NOT in Firestore)
    const filtered = raw.filter(item => item.slug !== "index");

    // Limit to exact page size
    const items = filtered.slice(0, limit);

    // Pagination cursor
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
