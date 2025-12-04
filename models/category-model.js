// models/Article.js
const { db } = require('../firebase.js');
const COLLECTION_NAME = "pages";

class Article {
  /**
   * Fetch articles by category with pagination
   */
static async getByCategory(website_id, category, limit = 5, startAfterDoc = null) {
  let query = db.collection(COLLECTION_NAME)
    .where("status", "==", "published")
    .where("website_id", "==", website_id)
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .limit(limit + 1); // fetch one extra

  if (startAfterDoc) {
    query = query.startAfter(startAfterDoc);
  }

  const snapshot = await query.get();

  // Filter out 'index' items
  const filteredDocs = snapshot.docs.filter(doc => doc.data().slug !== "index");

  // Map to response items
  const items = filteredDocs.slice(0, limit).map(doc => ({ id: doc.id, ...doc.data() }));

  // Determine nextPageToken from the extra doc
  const nextPageToken = filteredDocs.length > limit ? filteredDocs[limit] : null;

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
