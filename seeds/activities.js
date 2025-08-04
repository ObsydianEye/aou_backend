require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/artist_of_udaipur";
const client = new MongoClient(uri);

const mockUsers = ["adminuser", "johndoe", "janedoe", "testuser"];
const mockActions = ["user_logged_in", "updated_profile", "deleted_account", "activities_cleared"];
const descriptions = [
  "User logged in successfully.",
  "User updated their profile.",
  "User deleted their account.",
  "Admin cleared activity logs."
];

function generateMockActivities(count) {
  const activities = [];

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * mockActions.length);
    activities.push({
      action: mockActions[index],
      description: descriptions[index],
      performedBy: mockUsers[Math.floor(Math.random() * mockUsers.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // random past time
    });
  }

  return activities;
}

async function seed() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(); // uses db from URI
    const activitiesCollection = db.collection("activities");

    const mockData = generateMockActivities(50);
    const result = await activitiesCollection.insertMany(mockData);

    console.log(`✅ Inserted ${result.insertedCount} mock activities`);
  } catch (err) {
    console.error("❌ Error inserting mock data:", err);
  } finally {
    await client.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
