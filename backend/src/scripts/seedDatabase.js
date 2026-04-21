/**
 * Database Seeding Script
 * Populates MongoDB with sample books data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Book = require('../models/Book');

const sampleBooks = [
  {
    title: 'The Khmer Kingdom Chronicles',
    author: 'Sophea Kheara',
    description: 'A captivating journey through the history and culture of Cambodian kingdoms from Angkor to modern times.',
    isbn: '978-9-6-11223-0',
    category: 'history',
    priceUSD: 24.99,
    priceKHR: 100000,
    discountPercent: 10,
    stock: 50,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    pages: 320,
    publishedDate: new Date('2022-01-15'),
    publisher: 'Cambodian Press',
    language: 'Khmer',
    format: 'hardcover',
    isTrending: true,
    isNew: true,
    isPopular: true,
    tags: ['cambodia', 'history', 'culture'],
  },
  {
    title: 'Gen Z: Social Media and Identity',
    author: 'Dara Teom',
    description: 'Exploring how social media shapes the identity and relationships of Generation Z in Southeast Asia.',
    isbn: '978-9-6-11224-7',
    category: 'self-help',
    priceUSD: 19.99,
    priceKHR: 80000,
    discountPercent: 0,
    stock: 80,
    coverImage: 'https://images.unsplash.com/photo-1533950904477-461a4e7ee5ff?w=400',
    pages: 280,
    publishedDate: new Date('2023-05-20'),
    publisher: 'Youth Publishing',
    language: 'English',
    format: 'paperback',
    isTrending: true,
    isNew: true,
    tags: ['genZ', 'social-media', 'identity'],
  },
  {
    title: 'The Lost Temple of Bayon',
    author: 'Visal Hong',
    description: 'An archaeological mystery unraveling secrets hidden within Cambodian temples for centuries.',
    isbn: '978-9-6-11225-4',
    category: 'mystery',
    priceUSD: 17.99,
    priceKHR: 72000,
    discountPercent: 15,
    stock: 45,
    coverImage: 'https://images.unsplash.com/photo-1519336989668-17b99fa72e81?w=400',
    pages: 350,
    publishedDate: new Date('2023-03-10'),
    publisher: 'Adventure Books',
    language: 'English',
    format: 'paperback',
    isTrending: false,
    isNew: true,
    isPopular: true,
    tags: ['cambodia', 'mystery', 'adventure'],
  },
  {
    title: 'Cambodian Cooking: Modern Recipes with Traditional Flavors',
    author: 'Nary Sophea',
    description: 'A fusion cookbook bringing traditional Cambodian cuisine to modern kitchens with fresh perspectives.',
    isbn: '978-9-6-11226-1',
    category: 'business',
    priceUSD: 22.99,
    priceKHR: 92000,
    discountPercent: 5,
    stock: 60,
    coverImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400',
    pages: 280,
    publishedDate: new Date('2022-11-01'),
    publisher: 'Culinary Arts',
    language: 'English',
    format: 'hardcover',
    isTrending: true,
    isNew: false,
    isPopular: false,
    tags: ['cambodia', 'cooking', 'culture'],
  },
  {
    title: 'The Teen Entrepreneur: Building Digital Businesses',
    author: 'Channy Roth',
    description: 'A practical guide for young entrepreneurs looking to start tech businesses in the digital age.',
    isbn: '978-9-6-11227-8',
    category: 'technology',
    priceUSD: 21.99,
    priceKHR: 88000,
    discountPercent: 0,
    stock: 70,
    coverImage: 'https://images.unsplash.com/photo-1522869635100-ff8402e2f2d7?w=400',
    pages: 250,
    publishedDate: new Date('2023-08-15'),
    publisher: 'Tech Press',
    language: 'English',
    format: 'paperback',
    isTrending: true,
    isNew: true,
    isPopular: true,
    tags: ['technology', 'business', 'entrepreneurship'],
  },
  {
    title: 'Angkor Wat: Stones and Stories',
    author: 'Mallika Srun',
    description: 'Visual and narrative journey through the architectural wonders of Angkor Wat and surrounding temples.',
    isbn: '978-9-6-11228-5',
    category: 'cambodian',
    priceUSD: 35.99,
    priceKHR: 144000,
    discountPercent: 20,
    stock: 40,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72d5f9b6a148?w=400',
    pages: 400,
    publishedDate: new Date('2022-06-01'),
    publisher: 'Heritage Press',
    language: 'Khmer',
    format: 'hardcover',
    isTrending: false,
    isNew: false,
    isPopular: true,
    tags: ['cambodia', 'temple', 'history'],
  },
  {
    title: 'Love in the Time of Wi-Fi',
    author: 'Sopha Lin',
    description: 'A romantic novel about modern relationships and love in a digital world.',
    isbn: '978-9-6-11229-2',
    category: 'romance',
    priceUSD: 15.99,
    priceKHR: 64000,
    discountPercent: 0,
    stock: 100,
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
    pages: 320,
    publishedDate: new Date('2023-02-14'),
    publisher: 'Romance Publishers',
    language: 'English',
    format: 'paperback',
    isTrending: true,
    isNew: true,
    isPopular: false,
    tags: ['romance', 'genZ', 'modern-love'],
  },
  {
    title: 'Machine Learning for Everyone',
    author: 'Thy Kim',
    description: 'An accessible introduction to machine learning concepts and practical applications.',
    isbn: '978-9-6-11230-8',
    category: 'technology',
    priceUSD: 29.99,
    priceKHR: 120000,
    discountPercent: 10,
    stock: 55,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    pages: 380,
    publishedDate: new Date('2023-04-01'),
    publisher: 'Tech Education',
    language: 'English',
    format: 'paperback',
    isTrending: true,
    isNew: true,
    isPopular: true,
    tags: ['technology', 'ai', 'learning'],
  },
  {
    title: 'Cambodia\'s Journey: Post-War Reconstruction',
    author: 'Sokhem Saravuth',
    description: 'A detailed account of Cambodia\'s remarkable recovery and development after war.',
    isbn: '978-9-6-11231-5',
    category: 'biography',
    priceUSD: 28.99,
    priceKHR: 116000,
    discountPercent: 0,
    stock: 35,
    coverImage: 'https://images.unsplash.com/photo-1500595046891-ef6ba92a9fc9?w=400',
    pages: 420,
    publishedDate: new Date('2021-09-01'),
    publisher: 'Historical Society',
    language: 'Khmer',
    format: 'hardcover',
    isTrending: false,
    isNew: false,
    isPopular: true,
    tags: ['cambodia', 'history', 'biography'],
  },
  {
    title: 'The Adventure of Young Explorers',
    author: 'Kakada Pich',
    description: 'An exciting adventure story for young readers exploring Southeast Asian mysteries.',
    isbn: '978-9-6-11232-2',
    category: 'young-adult',
    priceUSD: 14.99,
    priceKHR: 60000,
    discountPercent: 0,
    stock: 90,
    coverImage: 'https://images.unsplash.com/photo-1495538108149-8d71bcdd2f65?w=400',
    pages: 280,
    publishedDate: new Date('2023-07-01'),
    publisher: 'Young Readers Press',
    language: 'English',
    format: 'paperback',
    isTrending: false,
    isNew: true,
    isPopular: false,
    tags: ['adventure', 'young-adult', 'cambodia'],
  },
  {
    title: 'The Mindfulness for Gen Z',
    author: 'Sophanak Vuth',
    description: 'Practical mindfulness techniques and mental health tips for Generation Z.',
    isbn: '978-9-6-11233-9',
    category: 'self-help',
    priceUSD: 18.99,
    priceKHR: 76000,
    discountPercent: 15,
    stock: 65,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    pages: 240,
    publishedDate: new Date('2023-06-15'),
    publisher: 'Wellness Press',
    language: 'English',
    format: 'paperback',
    isTrending: true,
    isNew: true,
    isPopular: false,
    tags: ['self-help', 'mindfulness', 'genZ'],
  },
];

/**
 * Seed the database
 */
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('📚 Seeding database with sample books...');

    // Clear existing books
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing books');

    // Insert sample books
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`✅ Successfully seeded ${insertedBooks.length} books`);

    // Display summary
    console.log('\n📊 Database Summary:');
    const stats = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$priceUSD' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log('\nBooks by Category:');
    stats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count} books (avg: $${stat.avgPrice.toFixed(2)})`);
    });

    console.log('\n✨ Seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding script only if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
