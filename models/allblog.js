// models/Pages.js
const { db } = require('../firebase.js');
const COLLECTION_NAME = 'pages';

class Pages {
  static REQUIRED_CATEGORIES = [
    "culture",
    "dating",
    "psychology",
    "travel",
    "realities",
    "our-process",
  ];

static async getAll(website_id) {
  const snapshot = await db
    .collection(COLLECTION_NAME)
    .where("website_id", "==", website_id)
    .where("status", "==", "published")
    .orderBy("createdAt", "desc")
    .get();

  if (snapshot.empty) return [];

  const items = [];

  snapshot.forEach(doc => {
    const data = doc.data();

    // filter categories
    if (!Pages.REQUIRED_CATEGORIES.includes(data.category)) return;

    items.push({ id: doc.id, ...data });
  });

  return items;
}


  // Grouped pages (only published)
  static async getAllGrouped(website_id) {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where("website_id", "==", website_id)
      .where("status", "==", "published")          // <-- ADDED
      .orderBy("createdAt", "desc")
      .get();

    const groups = {};
    Pages.REQUIRED_CATEGORIES.forEach(cat => (groups[cat] = []));

    snapshot.forEach(doc => {
      const data = doc.data();
      if (Pages.REQUIRED_CATEGORIES.includes(data.category)) {
        groups[data.category].push({ id: doc.id, ...data });
      }
    });

    return groups;
  }
}

module.exports = Pages;
