const { MongoClient } = require("mongodb");

// Replace this with your actual MongoDB connection string
const CONNECTION_STRING =
  "mongodb+srv://artnectdev:FRw66gRITmhFzb4r@aou-cluster.uesolgs.mongodb.net/?retryWrites=true&w=majority&appName=AOU-CLuster";

const mockEvents = [
  {
    title: "Udaipur Art Festival 2024",
    date: "2024-12-15",
    location: "City Palace, Udaipur",
    description:
      "A grand celebration of local and international art featuring paintings, sculptures, and digital art installations from renowned artists across India and abroad.",
    highlights: "Live painting sessions, Art workshops, Cultural performances",
    images: [
      "https://example.com/images/art-festival-1.jpg",
      "https://example.com/images/art-festival-2.jpg",
      "https://example.com/images/art-festival-3.jpg",
    ],
    videoHighlight: "https://youtube.com/watch?v=sample-video-1",
    type: "upcoming",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Traditional Dance Performance",
    date: "2024-11-20",
    location: "Fateh Sagar Lake Amphitheater",
    description:
      "An enchanting evening of traditional Rajasthani dance performances including Ghoomar, Kalbeliya, and Bhavai dances by acclaimed local artists.",
    highlights:
      "Traditional costumes, Live folk music, Interactive dance sessions",
    images: [
      "https://example.com/images/dance-1.jpg",
      "https://example.com/images/dance-2.jpg",
    ],
    videoHighlight: "https://youtube.com/watch?v=sample-video-2",
    type: "past",
    createdAt: new Date(2024, 10, 15),
    updatedAt: new Date(2024, 10, 21),
  },
  {
    title: "Photography Workshop by Master Photographer",
    date: "2025-01-10",
    location: "Jagmandir Island Palace",
    description:
      "Learn the art of landscape and portrait photography in the scenic beauty of Udaipur with internationally acclaimed photographer Rajesh Sharma.",
    highlights:
      "Hands-on experience, Professional equipment provided, Certificate of completion",
    images: [
      "https://example.com/images/photography-1.jpg",
      "https://example.com/images/photography-2.jpg",
      "https://example.com/images/photography-3.jpg",
      "https://example.com/images/photography-4.jpg",
    ],
    videoHighlight: null,
    type: "upcoming",
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    title: "Classical Music Concert",
    date: "2024-10-25",
    location: "Saheliyon Ki Bari",
    description:
      "An evening of soulful classical Indian music featuring sitar, tabla, and vocal performances by nationally recognized artists.",
    highlights:
      "Traditional instruments, Renowned artists, Serene garden setting",
    images: [
      "https://example.com/images/music-1.jpg",
      "https://example.com/images/music-2.jpg",
    ],
    videoHighlight: "https://youtube.com/watch?v=sample-video-3",
    type: "past",
    createdAt: new Date(2024, 9, 20),
    updatedAt: new Date(2024, 9, 26),
  },
  {
    title: "Modern Art Exhibition",
    date: "2025-02-14",
    location: "Udaipur Art Gallery",
    description:
      "Contemporary art exhibition showcasing modern interpretations of traditional Rajasthani themes by emerging local artists.",
    highlights: "Contemporary art, Local artists, Interactive installations",
    images: [
      "https://example.com/images/modern-art-1.jpg",
      "https://example.com/images/modern-art-2.jpg",
      "https://example.com/images/modern-art-3.jpg",
    ],
    videoHighlight: null,
    type: "upcoming",
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    title: "Craft Workshop - Block Printing",
    date: "2024-09-15",
    location: "Shilpgram",
    description:
      "Learn the ancient art of block printing on textiles. Create your own masterpiece using traditional wooden blocks and natural dyes.",
    highlights: "Ancient techniques, Natural dyes, Take home your creation",
    images: ["https://example.com/images/craft-1.jpg"],
    videoHighlight: "https://youtube.com/watch?v=sample-video-4",
    type: "past",
    createdAt: new Date(2024, 8, 10),
    updatedAt: new Date(2024, 8, 16),
  },
  {
    title: "Digital Art Showcase",
    date: "2025-03-20",
    location: "Maharana Pratap Memorial",
    description:
      "A cutting-edge digital art exhibition featuring NFT collections, digital paintings, and interactive multimedia installations.",
    highlights: "NFT collections, Interactive displays, Tech meets tradition",
    images: [
      "https://example.com/images/digital-1.jpg",
      "https://example.com/images/digital-2.jpg",
      "https://example.com/images/digital-3.jpg",
      "https://example.com/images/digital-4.jpg",
      "https://example.com/images/digital-5.jpg",
    ],
    videoHighlight: "https://youtube.com/watch?v=sample-video-5",
    type: "upcoming",
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    title: "Miniature Painting Workshop",
    date: "2024-08-30",
    location: "Bagore Ki Haveli",
    description:
      "Master the intricate art of Rajasthani miniature painting with guidance from traditional artists who have preserved this ancient craft.",
    highlights: "Traditional techniques, Expert guidance, Historical venue",
    images: [
      "https://example.com/images/miniature-1.jpg",
      "https://example.com/images/miniature-2.jpg",
    ],
    videoHighlight: null,
    type: "past",
    createdAt: new Date(2024, 7, 25),
    updatedAt: new Date(2024, 7, 31),
  },
  {
    title: "Street Art Festival",
    date: "2025-04-05",
    location: "Old City Streets, Udaipur",
    description:
      "Transform the streets of Udaipur into an open-air art gallery with murals, graffiti art, and street performances by local and international artists.",
    highlights: "Street murals, Live performances, Urban art culture",
    images: [
      "https://example.com/images/street-1.jpg",
      "https://example.com/images/street-2.jpg",
      "https://example.com/images/street-3.jpg",
    ],
    videoHighlight: "https://youtube.com/watch?v=sample-video-6",
    type: "upcoming",
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    title: "Sculpture Garden Opening",
    date: "2024-07-12",
    location: "Gulab Bagh",
    description:
      "Inauguration of a permanent sculpture garden featuring works by prominent Indian sculptors, celebrating the fusion of art and nature.",
    highlights:
      "Permanent installation, Nature integration, Renowned sculptors",
    images: [
      "https://example.com/images/sculpture-1.jpg",
      "https://example.com/images/sculpture-2.jpg",
      "https://example.com/images/sculpture-3.jpg",
      "https://example.com/images/sculpture-4.jpg",
    ],
    videoHighlight: "https://youtube.com/watch?v=sample-video-7",
    type: "past",
    createdAt: new Date(2024, 6, 5),
    updatedAt: new Date(2024, 6, 13),
  },
];

async function insertMockData() {
  const client = new MongoClient(CONNECTION_STRING);

  try {
    console.log("🔄 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected successfully to MongoDB");

    const db = client.db();
    const collection = db.collection("events");

    console.log("🔄 Inserting mock data...");
    const result = await collection.insertMany(mockEvents);

    console.log(`✅ Successfully inserted ${result.insertedCount} events`);
    console.log("📋 Inserted IDs:", Object.values(result.insertedIds));

    // Create text index for search functionality
    console.log("🔄 Creating text index...");
    await collection.createIndex({
      title: "text",
      description: "text",
      location: "text",
    });
    console.log("✅ Text index created successfully");

    // Create other indexes
    await collection.createIndex({ type: 1, date: 1 });
    await collection.createIndex({ createdAt: -1 });
    console.log("✅ Additional indexes created successfully");

    console.log("🎉 All done! Mock data inserted successfully");
  } catch (error) {
    console.error("❌ Error inserting mock data:", error);
  } finally {
    await client.close();
    console.log("🔒 Connection closed");
  }
}

// Run the script
insertMockData();
