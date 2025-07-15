const express = require("express");
const router = express.Router();

router.get("/about", (req, res) => {
  res.send("This is the About Page");
});

router.get("/testenv", (req, res) => {
  const envVar = process.env.TESTVAR;
  const message = {
    msg: "good message",
    message: `This is a test message from ${process.env.NODE_ENV} environment with value ${envVar}`,
  };
  res.json(message);
});

router.post("/contact", (req, res) => {
  res.json({ message: "Contact data received", data: req.body });
});

module.exports = router;
