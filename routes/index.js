const express = require("express");
const router = express.Router();

router.get("/about", (req, res) => {
  res.send("This is the About Page");
});

router.get("/testenv", (req, res) => {
  res.send(process.env.TESTVAR);
});

router.post("/contact", (req, res) => {
  res.json({ message: "Contact data received", data: req.body });
});

module.exports = router;
