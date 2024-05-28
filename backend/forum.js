const express = require('express');
const router = express.Router();
const db = require('./api/firebase');  // Correct path to firebase.js


router.post("/forum", async (req, res) => {
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


router.post("/forums/:forumId/posts", async (req, res) => {
    try {
      const { forumId } = req.params;
      const { title, description, userId } = req.body;
      const post = {
        title,
        description,
        userId,
        upvotes: 0,
        date: new Date()
      };
      await db.collection("forum").doc(forumId).collection("posts").add(post);
      res.status(201).json({ message: 'Successfully created post' });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
});


// Fetch all forums
router.get("/forums", async (req, res) => {
    try {
      const forumsSnapshot = await db.collection("forum").get();
      const forums = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json({ forums });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
 
 


module.exports = router;
