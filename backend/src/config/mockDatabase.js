/**
 * Mock Database
 * In-memory database for development without MongoDB
 * Compatible with Mongoose API
 */

const crypto = require('crypto');

// In-memory storage
const db = {
  users: [],
  books: [],
  orders: [],
  reviews: [],
  wishlists: []
};

// Generate UUID
const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

// Sample books data
const sampleBooks = [
  {
    _id: generateId(),
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    description: 'A novel set in the Jazz Age that tells the story of Jay Gatsby\'s unrequited love for Daisy Buchanan.',
    category: 'fiction',
    priceUSD: 12.99,
    priceKHR: 52500,
    stock: 50,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    averageRating: 4.5,
    totalReviews: 128,
    isTrending: true,
    isNew: false,
    isPopular: true,
    tags: ['classic', 'american', 'romance'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    description: 'A gripping tale of racial injustice and childhood innocence in the Deep South.',
    category: 'fiction',
    priceUSD: 14.99,
    priceKHR: 60500,
    stock: 45,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'],
    averageRating: 4.8,
    totalReviews: 245,
    isTrending: true,
    isNew: false,
    isPopular: true,
    tags: ['classic', 'legal', 'drama'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0-7352-1129-2',
    description: 'An easy and proven way to build good habits and break bad ones.',
    category: 'self-help',
    priceUSD: 18.99,
    priceKHR: 76500,
    stock: 100,
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400'],
    averageRating: 4.9,
    totalReviews: 567,
    isTrending: true,
    isNew: false,
    isPopular: true,
    tags: ['productivity', 'psychology', 'habits'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'The Midnight Library',
    author: 'Matt Haig',
    isbn: '978-0-5255-5947-4',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    category: 'fiction',
    priceUSD: 16.99,
    priceKHR: 68500,
    stock: 35,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'],
    averageRating: 4.3,
    totalReviews: 189,
    isTrending: true,
    isNew: true,
    isPopular: false,
    tags: ['fantasy', 'philosophy', 'contemporary'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0-441-17271-9',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.',
    category: 'science',
    priceUSD: 15.99,
    priceKHR: 64500,
    stock: 60,
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
    images: ['https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400'],
    averageRating: 4.7,
    totalReviews: 423,
    isTrending: false,
    isNew: false,
    isPopular: true,
    tags: ['sci-fi', 'classic', 'space'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    isbn: '978-0-593-13520-4',
    description: 'A lone astronaut must save the earth from disaster in this desperate, thrilling novel.',
    category: 'science',
    priceUSD: 19.99,
    priceKHR: 80500,
    stock: 75,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400'],
    averageRating: 4.9,
    totalReviews: 312,
    isTrending: false,
    isNew: true,
    isPopular: true,
    tags: ['sci-fi', 'space', 'adventure'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '978-0-374-27563-1',
    description: 'The book summarizes research that Kahneman conducted over decades.',
    category: 'non-fiction',
    priceUSD: 17.99,
    priceKHR: 72500,
    stock: 40,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'],
    averageRating: 4.6,
    totalReviews: 278,
    isTrending: false,
    isNew: false,
    isPopular: true,
    tags: ['psychology', 'thinking', 'economics'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'Educated',
    author: 'Tara Westover',
    isbn: '978-0-399-59050-4',
    description: 'A memoir about a young girl who leaves her survivalist family and goes on to earn a PhD.',
    category: 'biography',
    priceUSD: 13.99,
    priceKHR: 56500,
    stock: 55,
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
    images: ['https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400'],
    averageRating: 4.7,
    totalReviews: 334,
    isTrending: false,
    isNew: true,
    isPopular: false,
    tags: ['memoir', 'education', 'inspiring'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    isbn: '978-0-590-35340-3',
    description: 'Harry Potter has never been the star of a Quidditch team, scoring points while riding a broom.',
    category: 'adventure',
    priceUSD: 11.99,
    priceKHR: 48500,
    stock: 200,
    coverImage: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400',
    images: ['https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400'],
    averageRating: 4.9,
    totalReviews: 892,
    isTrending: true,
    isNew: false,
    isPopular: true,
    tags: ['magic', 'fantasy', 'young-adult'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '978-0-06-112241-5',
    description: 'Paulo Coelho\'s masterpiece tells the magical story of Santiago.',
    category: 'fiction',
    priceUSD: 10.99,
    priceKHR: 44500,
    stock: 80,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
    images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400'],
    averageRating: 4.4,
    totalReviews: 567,
    isTrending: false,
    isNew: false,
    isPopular: true,
    tags: ['philosophy', 'journey', 'inspiring'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Initialize with sample data
db.books = [...sampleBooks];

// Mock Query Builder
class MockQuery {
  constructor(collection, filter = {}) {
    this.collection = collection;
    this.filter = filter;
    this.sortField = null;
    this.sortOrder = 1;
    this.skipValue = 0;
    this.limitValue = null;
    this.populateFields = [];
    this.selectFields = null;
  }

  sort(field) {
    if (typeof field === 'string') {
      if (field.startsWith('-')) {
        this.sortField = field.substring(1);
        this.sortOrder = -1;
      } else {
        this.sortField = field;
        this.sortOrder = 1;
      }
    }
    return this;
  }

  skip(n) {
    this.skipValue = n;
    return this;
  }

  limit(n) {
    this.limitValue = n;
    return this;
  }

  populate(field) {
    this.populateFields.push(field);
    return this;
  }

  select(fields) {
    this.selectFields = fields;
    return this;
  }

  async exec() {
    let results = this.collection.filter(item => {
      for (let key in this.filter) {
        const filterValue = this.filter[key];
        const itemValue = item[key];

        if (typeof filterValue === 'object') {
          if (filterValue.$regex) {
            const regex = new RegExp(filterValue.$regex, filterValue.$options || '');
            if (!regex.test(itemValue)) return false;
          } else if (filterValue.$ne) {
            if (itemValue === filterValue.$ne) return false;
          } else if (Array.isArray(filterValue.$or)) {
            const matches = filterValue.$or.some(cond => {
              for (let condKey in cond) {
                const condValue = cond[condKey];
                if (typeof condValue === 'object' && condValue.$regex) {
                  const regex = new RegExp(condValue.$regex, condValue.$options || '');
                  if (!regex.test(item[condKey])) return false;
                }
              }
              return true;
            });
            if (!matches) return false;
          }
        } else if (itemValue !== filterValue) {
          return false;
        }
      }
      return true;
    });

    // Sort
    if (this.sortField) {
      results.sort((a, b) => {
        const aVal = a[this.sortField];
        const bVal = b[this.sortField];
        if (aVal < bVal) return -1 * this.sortOrder;
        if (aVal > bVal) return 1 * this.sortOrder;
        return 0;
      });
    }

    // Skip and limit
    results = results.slice(this.skipValue);
    if (this.limitValue) {
      results = results.slice(0, this.limitValue);
    }

    return results;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

// Mock Model class
class MockModel {
  constructor(collection, name) {
    this.collection = collection;
    this.name = name;
  }

  create(data) {
    const doc = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.collection.push(doc);
    return Promise.resolve(doc);
  }

  find(filter = {}) {
    return new MockQuery(this.collection, filter);
  }

  findOne(filter = {}) {
    const query = new MockQuery(this.collection, filter);
    query.limitValue = 1;
    return {
      ...query,
      exec: async () => {
        const results = await query.exec();
        return results[0] || null;
      },
      then: (resolve, reject) => query.exec().then(r => resolve(r[0] || null), reject)
    };
  }

  findById(id) {
    return {
      populate: (field) => ({
        exec: async () => {
          const item = this.collection.find(i => i._id === id);
          if (item && field === 'reviews') {
            item.reviews = db.reviews.filter(r => r.book === id);
          }
          return item || null;
        },
        then: (resolve, reject) => this.collection.find(i => i._id === id) ? resolve(this.collection.find(i => i._id === id)) : resolve(null)
      }),
      exec: async () => this.collection.find(i => i._id === id) || null,
      then: (resolve, reject) => {
        const item = this.collection.find(i => i._id === id);
        return resolve(item || null);
      }
    };
  }

  countDocuments(filter = {}) {
    const query = new MockQuery(this.collection, filter);
    return {
      exec: async () => {
        const results = await query.exec();
        return results.length;
      },
      then: (resolve, reject) => query.exec().then(r => resolve(r.length), reject)
    };
  }

  updateOne(filter, update) {
    const item = this.collection.find(i => {
      for (let key in filter) {
        if (i[key] !== filter[key]) return false;
      }
      return true;
    });
    if (item && update.$set) {
      Object.assign(item, update.$set, { updatedAt: new Date() });
    }
    return Promise.resolve({ modifiedCount: item ? 1 : 0 });
  }

  deleteOne(filter) {
    const idx = this.collection.findIndex(i => {
      for (let key in filter) {
        if (i[key] !== filter[key]) return false;
      }
      return true;
    });
    if (idx > -1) {
      this.collection.splice(idx, 1);
      return Promise.resolve({ deletedCount: 1 });
    }
    return Promise.resolve({ deletedCount: 0 });
  }
}

// Create mock models
const mockModels = {
  Book: new MockModel(db.books, 'Book'),
  User: new MockModel(db.users, 'User'),
  Order: new MockModel(db.orders, 'Order'),
  Review: new MockModel(db.reviews, 'Review'),
  Wishlist: new MockModel(db.wishlists, 'Wishlist')
};

// Also export raw db for direct access
mockModels._db = db;

module.exports = mockModels;
