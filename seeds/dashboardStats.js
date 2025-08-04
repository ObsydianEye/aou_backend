require("dotenv").config();
const { MongoClient } = require("mongodb");

// Load MongoDB URI
const uri = "mongodb://localhost:27017/artist_of_udaipur";
if (!uri) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

const client = new MongoClient(uri);
const DB_NAME = "events"; // change to your actual db name

async function seedDashboardStats() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const blogs = db.collection("blogs");
    const events = db.collection("events");
    const users = db.collection("users");

    // Cleanup old mock data
    await blogs.deleteMany({ title: { $regex: /^Mock Blog/ } });
    await events.deleteMany({ title: { $regex: /^Mock Event/ } });
    await users.deleteMany({
      role: "artist",
      email: { $regex: /^mockartist\d+@example.com$/ },
    });

    const now = new Date().toISOString();

    const blogDocs = Array.from({ length: 10 }).map((_, i) => ({
      title: `Mock Blog ${i + 1}`,
      excerpt: `This is a mock excerpt for blog ${i + 1}`,
      category: "Art",
      thumbnail: "https://via.placeholder.com/150",
      content: "Mock content of the blog.",
      author: "Mock Author",
      readTime: "5 min read",
      slug: `mock-blog-${i + 1}`,
      createdAt: now,
      updatedAt: now,
    }));

    const eventDocs = Array.from({ length: 5 }).map((_, i) => ({
      title: `Mock Event ${i + 1}`,
      date: now.split("T")[0],
      location: "Mock City",
      description: `Description of mock event ${i + 1}`,
      highlights: "Some highlights",
      images: ["https://via.placeholder.com/300"],
      videoHighlight: "https://www.youtube.com/embed/mockvideo",
      type: i % 2 === 0 ? "upcoming" : "past",
      createdAt: now,
      updatedAt: now,
    }));

    const artistDocs = Array.from({ length: 8 }).map((_, i) => ({
      name: `Mock Artist ${i + 1}`,
      email: `mockartist${i + 1}@example.com`,
      role: "artist",
      bio: "Mock artist bio",
      createdAt: now,
      updatedAt: now,
    }));

    await blogs.insertMany(blogDocs);
    await events.insertMany(eventDocs);
    await users.insertMany(artistDocs);

    console.log("✅ Dashboard stats seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding dashboard stats:", err);
  } finally {
    await client.close();
  }
}

seedDashboardStats();
