/**
 * Enhanced Mock Database
 * Production-ready in-memory database with 700+ books
 * Compatible with Mongoose API
 */

const crypto = require('crypto');
const generateBooksData = require('../data/booksData');

// Generate UUID
const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

// In-memory storage
const db = {
  users: [],
  books: [],
  orders: [],
  reviews: [],
  wishlists: [],
  categories: [],
  coupons: [],
  payments: [],
  notifications: []
};

// Initialize with comprehensive data
const { categories, books } = generateBooksData();
db.categories = categories;
db.books = books;

// Add admin user
const adminUser = {
  _id: generateId(),
  username: 'admin',
  email: 'admin@zbook.com',
  password: '$2a$10$oHZma5vrklxKLfrbJyQPVu.mEvgfxqIJw3MG9/dkjxjtMfKPFZVyC', // admin123
  fullName: 'Z Book Administrator',
  phoneNumber: '+855123456789',
  address: 'Phnom Penh, Cambodia',
  city: 'Phnom Penh',
  country: 'Cambodia',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  role: 'admin',
  isEmailVerified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

// Add demo user
const demoUser = {
  _id: generateId(),
  username: 'demo',
  email: 'demo@zbook.com',
  password: '$2a$10$Ii.vVRaEHyP8YDRFpPy07e20YGrK9bmEGWUtYFvHXsTVyFBPQr9BS', // demo123
  fullName: 'Demo User',
  phoneNumber: '+855987654321',
  address: '123 Demo Street',
  city: 'Phnom Penh',
  country: 'Cambodia',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  role: 'user',
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

db.users.push(adminUser, demoUser);

// Sample coupons for discounts
const sampleCoupons = [
  { _id: generateId(), code: 'WELCOME20', discountPercent: 20, maxUses: 1000, usedCount: 0, validUntil: new Date('2025-12-31'), isActive: true },
  { _id: generateId(), code: 'SUMMER15', discountPercent: 15, maxUses: 500, usedCount: 0, validUntil: new Date('2025-08-31'), isActive: true },
  { _id: generateId(), code: 'STUDENT10', discountPercent: 10, maxUses: 2000, usedCount: 0, validUntil: new Date('2025-12-31'), isActive: true },
  { _id: generateId(), code: 'VIP25', discountPercent: 25, maxUses: 100, usedCount: 0, validUntil: new Date('2025-12-31'), isActive: true }
];
db.coupons = sampleCoupons;

// Statistics
const stats = {
  totalBooks: books.length,
  totalUsers: 2,
  totalOrders: 0,
  totalRevenue: 0
};

const matchesCondition = (item, condition) => {
  for (let key in condition) {
    if (key === '$or') {
      if (!condition.$or.some(orCondition => matchesCondition(item, orCondition))) {
        return false;
      }
      continue;
    }

    const filterValue = condition[key];
    const itemValue = item[key];

    if (typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
      if (filterValue.$regex) {
        const regex = new RegExp(filterValue.$regex, filterValue.$options || '');
        if (!regex.test(String(itemValue || ''))) return false;
      } else if (filterValue.$ne !== undefined) {
        if (itemValue === filterValue.$ne) return false;
      } else if (filterValue.$gte !== undefined) {
        if (itemValue < filterValue.$gte) return false;
      } else if (filterValue.$lte !== undefined) {
        if (itemValue > filterValue.$lte) return false;
      } else if (filterValue.$gt !== undefined) {
        if (itemValue <= filterValue.$gt) return false;
      } else if (filterValue.$lt !== undefined) {
        if (itemValue >= filterValue.$lt) return false;
      } else if (Array.isArray(filterValue.$in)) {
        if (!filterValue.$in.includes(itemValue)) return false;
      }
    } else if (itemValue !== filterValue) {
      return false;
    }
  }

  return true;
};

const populateItem = (item, field) => {
  if (!item) return item;

  const fieldName = String(field || '').split(' ')[0];
  if (fieldName === 'bookId' && item.bookId && typeof item.bookId === 'string') {
    return {
      ...item,
      bookId: db.books.find(book => book._id === item.bookId) || item.bookId,
    };
  }

  if (fieldName === 'userId' && item.userId && typeof item.userId === 'string') {
    return {
      ...item,
      userId: db.users.find(user => user._id === item.userId) || item.userId,
    };
  }

  if (fieldName === 'items.bookId' && Array.isArray(item.items)) {
    return {
      ...item,
      items: item.items.map(orderItem => ({
        ...orderItem,
        bookId: typeof orderItem.bookId === 'string'
          ? db.books.find(book => book._id === orderItem.bookId) || orderItem.bookId
          : orderItem.bookId,
      })),
    };
  }

  return item;
};

// Mock Query Builder with enhanced features
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
    } else if (typeof field === 'object' && field !== null) {
      const [sortField, sortOrder] = Object.entries(field)[0] || [];
      this.sortField = sortField;
      this.sortOrder = sortOrder === -1 ? -1 : 1;
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
    let results = this.collection.filter(item => matchesCondition(item, this.filter));

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

    if (this.populateFields.length > 0) {
      results = results.map(item => this.populateFields.reduce(
        (current, field) => populateItem(current, field),
        item
      ));
    }

    return results;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

// Enhanced Mock Model class
class MockModel {
  constructor(collection, name) {
    this.collection = collection;
    this.name = name;
  }

  // Constructor for creating new documents
  new(data) {
    const doc = {
      _id: generateId(),
      ...data,
      save: async () => {
        doc.createdAt = new Date();
        doc.updatedAt = new Date();
        this.collection.push(doc);
        return doc;
      }
    };
    return doc;
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
      select: (fields) => {
        query.selectFields = fields;
        return {
          exec: async () => {
            const results = await query.exec();
            return results[0] || null;
          },
          then: (resolve, reject) => query.exec().then(r => resolve(r[0] || null), reject)
        };
      },
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
        then: (resolve, reject) => {
          const item = this.collection.find(i => i._id === id);
          return resolve(item || null);
        }
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
    if (item) {
      if (update.$set) {
        Object.assign(item, update.$set, { updatedAt: new Date() });
      }
      if (update.$inc) {
        for (let key in update.$inc) {
          item[key] = (item[key] || 0) + update.$inc[key];
        }
      }
    }
    return Promise.resolve({ modifiedCount: item ? 1 : 0 });
  }

  updateMany(filter, update) {
    let count = 0;
    this.collection.forEach(item => {
      let matches = true;
      for (let key in filter) {
        if (item[key] !== filter[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        if (update.$set) {
          Object.assign(item, update.$set, { updatedAt: new Date() });
        }
        count++;
      }
    });
    return Promise.resolve({ modifiedCount: count });
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

  deleteMany(filter) {
    const initialLength = this.collection.length;
    for (let i = this.collection.length - 1; i >= 0; i--) {
      let matches = true;
      for (let key in filter) {
        if (this.collection[i][key] !== filter[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        this.collection.splice(i, 1);
      }
    }
    return Promise.resolve({ deletedCount: initialLength - this.collection.length });
  }
}

// Document class that supports instance methods
class MockDocument {
  constructor(data, collection) {
    Object.assign(this, data);
    this._collection = collection;
  }

  async save() {
    if (!this._id) {
      this._id = generateId();
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
    const existingIndex = this._collection.findIndex(item => item._id === this._id);
    if (existingIndex > -1) {
      this._collection[existingIndex] = this;
    } else {
      this._collection.push(this);
    }
    return this;
  }

  async populate(field) {
    Object.assign(this, populateItem(this, field));
    return this;
  }

  toJSON() {
    const { _collection, save, ...data } = this;
    return data;
  }
}

// Create model constructors
function createModel(collection, name) {
  const Model = function(data) {
    return new MockDocument(data, collection);
  };

  // Static methods
  Model.find = (filter) => new MockQuery(collection, filter);

  Model.findOne = (filter = {}) => {
    const query = new MockQuery(collection, filter);
    query.limitValue = 1;
    return {
      select: (fields) => {
        query.selectFields = fields;
        return {
          exec: async () => {
            const results = await query.exec();
            return results[0] || null;
          },
          then: (resolve, reject) => query.exec().then(r => resolve(r[0] || null), reject)
        };
      },
      exec: async () => {
        const results = await query.exec();
        return results[0] || null;
      },
      then: (resolve, reject) => query.exec().then(r => resolve(r[0] || null), reject)
    };
  };

  Model.findById = (id) => {
    const populateFields = [];
    const query = {
      populate: (field) => {
        populateFields.push(field);
        return query;
      },
      select: () => query,
      exec: async () => {
        const item = collection.find(i => i._id === id);
        if (!item) return null;

        const populated = populateFields.reduce(
          (current, field) => populateItem(current, field),
          item
        );
        return new MockDocument(populated, collection);
      },
      then: (resolve, reject) => query.exec().then(resolve, reject),
    };
    return query;
  };

  Model.findByIdAndUpdate = async (id, update, options = {}) => {
    const item = collection.find(i => i._id === id);
    if (!item) return null;

    const updateData = update.$set || update;
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        item[key] = updateData[key];
      }
    });
    item.updatedAt = new Date();

    return options.new ? item : { ...item, ...updateData };
  };

  Model.create = async (data) => {
    const doc = new MockDocument(data, collection);
    await doc.save();
    return doc;
  };

  Model.countDocuments = (filter = {}) => ({
    exec: async () => {
      const query = new MockQuery(collection, filter);
      const results = await query.exec();
      return results.length;
    },
    then: (resolve) => {
      const query = new MockQuery(collection, filter);
      return query.exec().then(r => resolve(r.length));
    }
  });

  Model.updateOne = async (filter, update) => {
    const item = collection.find(i => {
      for (let key in filter) {
        if (i[key] !== filter[key]) return false;
      }
      return true;
    });
    if (item && update.$set) {
      Object.assign(item, update.$set, { updatedAt: new Date() });
    }
    return { modifiedCount: item ? 1 : 0 };
  };

  Model.updateMany = async (filter, update) => {
    let count = 0;
    collection.forEach(item => {
      let matches = true;
      for (let key in filter) {
        if (item[key] !== filter[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        if (update.$set) {
          Object.assign(item, update.$set, { updatedAt: new Date() });
        }
        count++;
      }
    });
    return { modifiedCount: count };
  };

  Model.deleteOne = async (filter) => {
    const idx = collection.findIndex(i => {
      for (let key in filter) {
        if (i[key] !== filter[key]) return false;
      }
      return true;
    });
    if (idx > -1) {
      collection.splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  };

  Model.findOneAndDelete = async (filter = {}) => {
    const idx = collection.findIndex(i => matchesCondition(i, filter));
    if (idx === -1) return null;
    const [deleted] = collection.splice(idx, 1);
    return deleted;
  };

  Model.deleteMany = async (filter) => {
    const initialLength = collection.length;
    for (let i = collection.length - 1; i >= 0; i--) {
      let matches = true;
      for (let key in filter) {
        if (collection[i][key] !== filter[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        collection.splice(i, 1);
      }
    }
    return { deletedCount: initialLength - collection.length };
  };

  return Model;
}

// Create enhanced mock models
const mockModels = {
  Book: createModel(db.books, 'Book'),
  User: createModel(db.users, 'User'),
  Order: createModel(db.orders, 'Order'),
  Review: createModel(db.reviews, 'Review'),
  Wishlist: createModel(db.wishlists, 'Wishlist'),
  Category: createModel(db.categories, 'Category'),
  Coupon: createModel(db.coupons, 'Coupon'),
  Payment: createModel(db.payments, 'Payment'),
  Notification: createModel(db.notifications, 'Notification')
};

// Export raw db and stats for direct access
mockModels._db = db;
mockModels._stats = stats;

// Helper functions for statistics
mockModels.updateStats = () => {
  stats.totalBooks = db.books.length;
  stats.totalUsers = db.users.length;
  stats.totalOrders = db.orders.length;
  stats.totalRevenue = db.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
};

module.exports = mockModels;
