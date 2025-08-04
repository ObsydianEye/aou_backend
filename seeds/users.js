// seedUsersNoSchema.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// MongoDB connection URI and DB/Collection names
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'your_database_name';
const COLLECTION_NAME = 'users';

// Mock user data
const users = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    role: 'admin',
    password: 'password123',
    isActive: true,
  },
  {
    username: 'jane_admin',
    email: 'jane@example.com',
    role: 'super admin',
    password: 'password456',
    isActive: true,
  },
  {
    username: 'editor_emily',
    email: 'emily@example.com',
    role: 'editor',
    password: 'password789',
    isActive: false,
  },
  {
    username: 'michael99',
    email: 'michael@example.com',
    role: 'editor',
    password: 'password321',
    isActive: true,
  },
  {
    username: 'admin_alex',
    email: 'alex@example.com',
    role: 'admin',
    password: 'password654',
    isActive: false,
  }
];

async function seedUsers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Optional: Clear existing users
    await collection.deleteMany({});
    console.log('Existing users deleted');

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hash = await bcrypt.hash(user.password, 10);
        return { ...user, password: hash };
      })
    );

    // Insert mock users
    await collection.insertMany(hashedUsers);
    console.log('Mock users inserted successfully');
  } catch (err) {
    console.error('Error inserting users:', err);
  } finally {
    await client.close();
  }
}

seedUsers();
    