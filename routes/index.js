const express = require("express");
const router = express.Router();

router.get("/about", (req, res) => {
  res.send("This is the About Page");
});

router.post("/contact", (req, res) => {
  res.json({ message: "Contact data received", data: req.body });
});

module.exports = router;
