const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/artist_of_udaipur", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

// Define the Blog schema with timestamps for auto-createdAt and updatedAt
const blogSchema = new mongoose.Schema(
  {
    title: String,
    excerpt: String,
    category: String,
    thumbnail: String,
    content: String,
    author: String,
    readTime: String,
    slug: String,
    published: Boolean,
  },
  { timestamps: true } // Automatically handle createdAt and updatedAt
);

const Blog = mongoose.model("Blog", blogSchema);

// New data
const blogData = [
  {
    title: "Exploring Van Gogh's Starry Night",
    excerpt:
      "Dive deep into the swirling skies and mysteries of Van Gogh's masterpiece.",
    category: "Art",
    thumbnail:
      "https://images.unsplash.com/photo-1753561881904-37dee26b7a2d?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Starry Night is more than just a painting—it's a glimpse into Van Gogh's soul...",
    author: "Anna Artwell",
    readTime: "4 min read",
    slug: "van-gogh-starry-night",
    published: true,
  },
  {
    title: "The Future of AI in Healthcare",
    excerpt:
      "From diagnostics to personalized treatment—AI is changing the game.",
    category: "Tech",
    thumbnail:
      "https://images.unsplash.com/photo-1753550639305-92c17f3532db?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "AI in healthcare is revolutionizing patient care through advanced diagnostics...",
    author: "Dr. Alex Future",
    readTime: "6 min read",
    slug: "ai-in-healthcare",
    published: true,
  },
  {
    title: "Minimalist Home Design Ideas",
    excerpt:
      "Less is more. Discover how to style your home with clean lines and functionality.",
    category: "Design",
    thumbnail:
      "https://images.unsplash.com/photo-1735657090736-0c8484323c90?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Minimalism focuses on simplicity, purpose, and clarity in every design...",
    author: "Linda Design",
    readTime: "5 min read",
    slug: "minimalist-home-design",
    published: true,
  },
  {
    title: "A Journey Through Japanese Zen Gardens",
    excerpt:
      "Experience the tranquility and aesthetic balance of Japan's finest Zen gardens.",
    category: "Travel",
    thumbnail:
      "https://plus.unsplash.com/premium_photo-1753231445664-984412ff405b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Japanese Zen gardens are a visual representation of peace, simplicity, and harmony...",
    author: "Sakura Nomura",
    readTime: "6 min read",
    slug: "zen-gardens-japan",
    published: true,
  },
  {
    title: "Why You Should Start Journaling in 2025",
    excerpt: "Journaling is more than writing—it's a wellness tool.",
    category: "Lifestyle",
    thumbnail:
      "https://images.unsplash.com/photo-1683009427479-c7e36bbb7bca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "From reducing stress to boosting creativity, journaling is a daily habit worth building...",
    author: "Jane Mindwell",
    readTime: "4 min read",
    slug: "start-journaling-2025",
    published: true,
  },
  {
    title: "Understanding Cryptocurrency: A Beginner's Guide",
    excerpt:
      "Everything you need to know before investing in digital currency.",
    category: "Finance",
    thumbnail:
      "https://images.unsplash.com/photo-1741851373856-67a519f0c014?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Crypto is not just a trend—it's reshaping global finance. Let's break it down...",
    author: "Chris Ledger",
    readTime: "7 min read",
    slug: "crypto-guide-beginners",
    published: true,
  },
  {
    title: "How to Brew the Perfect Cup of Coffee",
    excerpt: "Brew like a barista with these essential tips.",
    category: "Food & Drink",
    thumbnail:
      "https://images.unsplash.com/photo-1750665645109-6b2b84bf5abd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "From beans to brewing methods, elevate your coffee game in your own kitchen...",
    author: "Brew Master Joe",
    readTime: "5 min read",
    slug: "perfect-coffee-guide",
    published: true,
  },
  {
    title: "10 Inspiring Women in Tech You Should Know",
    excerpt: "Meet the women who are transforming technology.",
    category: "Tech",
    thumbnail:
      "https://images.unsplash.com/photo-1682685797661-9e0c87f59c60?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "From AI researchers to startup founders, these women are breaking barriers...",
    author: "Elena Codehart",
    readTime: "6 min read",
    slug: "inspiring-women-in-tech",
    published: true,
  },
  {
    title: "The Science of Sleep: Why 8 Hours Matter",
    excerpt: "Sleep isn't a luxury—it's essential to your health.",
    category: "Health",
    thumbnail:
      "https://images.unsplash.com/photo-1752805936031-b6b6db069190?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "Learn how quality sleep improves memory, mood, and longevity...",
    author: "Dr. Nora Restwell",
    readTime: "5 min read",
    slug: "science-of-sleep",
    published: true,
  },
  {
    title: "A Beginner's Guide to Investing in Stocks",
    excerpt: "Grow your wealth by learning the basics of stock investing.",
    category: "Finance",
    thumbnail:
      "https://images.unsplash.com/photo-1752867823419-e56031e9d737?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Stock market investing doesn't have to be intimidating. Start here...",
    author: "Warren Newbie",
    readTime: "7 min read",
    slug: "stocks-investing-basics",
    published: true,
  },
  {
    title: "The Rise of Sustainable Fashion",
    excerpt: "How eco-conscious brands are changing the industry.",
    category: "Fashion",
    thumbnail:
      "https://images.unsplash.com/photo-1682686581413-0a0ec9bb35bb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Fast fashion has met its match. Consumers are now demanding sustainability...",
    author: "Clara Green",
    readTime: "6 min read",
    slug: "sustainable-fashion-trend",
    published: true,
  },
  {
    title: "Top 5 Programming Languages to Learn in 2025",
    excerpt: "Stay ahead of the curve with these in-demand languages.",
    category: "Tech",
    thumbnail:
      "https://plus.unsplash.com/premium_photo-1753303051854-0e9b97c3c895?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Whether you're new or experienced, these languages will future-proof your career...",
    author: "Dev Guru",
    readTime: "5 min read",
    slug: "top-programming-languages-2025",
    published: true,
  },
  {
    title: "Meditation for Beginners: How to Get Started",
    excerpt: "Clear your mind and find calm in a chaotic world.",
    category: "Lifestyle",
    thumbnail: "https://images.unsplash.com/photo-1753236408632-3ea319dd823d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Meditation can reduce stress and increase focus. Start with just 5 minutes a day...",
    author: "Zen Lin",
    readTime: "4 min read",
    slug: "meditation-beginners-guide",
    published: true,
  },
];

// Seed database
async function resetAndSeedBlogs() {
  try {
    // Clear the collection
    await Blog.deleteMany({});
    console.log("All blogs deleted.");

    // Insert new blog data
    await Blog.insertMany(blogData);
    console.log("New blogs inserted.");
  } catch (error) {
    console.error("Error seeding blogs:", error);
  } finally {
    // Ensure the connection closes after the operation
    await mongoose.connection.close();
  }
}

resetAndSeedBlogs();
