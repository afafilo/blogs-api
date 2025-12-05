const { db } = require('../firebase.js');
const COLLECTION_NAME = 'pages';

class Blog {
  // For featured
  static async getLatestBlog(website_id) {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where('status', '==', 'published')
      .where('website_id', '==', website_id)
      .orderBy('createdAt', 'desc')
      .limit(10) // fetch a few extra in case "index" exists
      .get();

    if (snapshot.empty) return null;

    // Exclude slug === 'index'
    const doc = snapshot.docs.find(doc => doc.data().slug !== 'index');
    if (!doc) return null;

    return { id: doc.id, ...doc.data() };
  }

  // Get latest N blogs per category filtered by website_id
  static async getLatestPerCategory(website_id, limit = 6, skipId = null) {
    const REQUIRED_CATEGORIES = [
      "culture",
      "dating",
      "psychology",
      "travel",
      "realities",
      "our-process",
    ];

    const snapshot = await db.collection(COLLECTION_NAME)
      .where("status", "==", "published")
      .where('website_id', '==', website_id)
      .orderBy("createdAt", "desc")
      .get();

    const result = {};
    REQUIRED_CATEGORIES.forEach(cat => result[cat] = []);

    snapshot.docs.forEach(doc => {
      if (doc.id === skipId) return;

      const data = doc.data();

      // Exclude slug === 'index'
      if (data.slug === 'index') return;

      const cat = data.category;
      if (REQUIRED_CATEGORIES.includes(cat) && result[cat].length < limit) {
        result[cat].push({ id: doc.id, ...data });
      }
    });

    return result;
  }
}

module.exports = Blog;
