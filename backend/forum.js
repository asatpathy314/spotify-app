const express = require('express');
const router = express.Router();
const db = require('./api/firebase');  // Correct path to firebase.js

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const docRef = await db.collection("forum").add({
      name: name,
      date: new Date()
    });
    res.status(201).json({ message: `Successfully created post with id ${docRef.id}` });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
