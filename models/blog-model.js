const { db } = require('../firebase.js');
const COLLECTION_NAME = 'pages';

class Blog {
  static REQUIRED_CATEGORIES = [
    "culture",
    "dating",
    "psychology",
    "travel",
    "realities",
    "our-process",
  ];

  // For featured
  static async getLatestBlog(website_id) {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where('status', '==', 'published')
      .where('website_id', '==', website_id)
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) return null;

    // Find first valid doc:
    // - slug !== "index"
    // - category within REQUIRED_CATEGORIES
    const doc = snapshot.docs.find(doc => {
      const data = doc.data();
      return (
        data.slug !== "index" &&
        Blog.REQUIRED_CATEGORIES.includes(data.category)
      );
    });

    if (!doc) return null;

    return { id: doc.id, ...doc.data() };
  }

  // Get latest N blogs per category filtered by website_id
  static async getLatestPerCategory(website_id, limit = 6, skipId = null) {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where("status", "==", "published")
      .where('website_id', '==', website_id)
      .orderBy("createdAt", "desc")
      .get();

    const result = {};
    Blog.REQUIRED_CATEGORIES.forEach(cat => result[cat] = []);

    snapshot.docs.forEach(doc => {
      if (doc.id === skipId) return;

      const data = doc.data();

      // Exclude slug === 'index'
      if (data.slug === 'index') return;

      const cat = data.category;
      if (Blog.REQUIRED_CATEGORIES.includes(cat) && result[cat].length < limit) {
        result[cat].push({ id: doc.id, ...data });
      }
    });

    return result;
  }
}

module.exports = Blog;
