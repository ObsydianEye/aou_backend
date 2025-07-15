const express = require("express");

const app = express();
app.get("/api", (req, res) => {
  res.send("Hello Vercel");
});
const startServer = () => {
  try {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.log("Failed to start the server on port 5000");
    console.log("Error", error);
  }
};

startServer();
