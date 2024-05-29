const express = require('express');
const router = express.Router();
const db = require('./firebase');  // Correct path to firebase.js


router.post("/forum", async (req, res) => {
  try {
    const { name } = req.body;
    const docRef = await db.collection("forum").add({
      name: name,
      date: new Date()
    });
    res.status(201).json({ message: `Successfully created forum with id ${docRef.id}` });
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


router.get("/forums", async (req, res) => {
  try {
    const forumsSnapshot = await db.collection("forum").get();
    const forums = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ forums });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


router.get("/forums/:forumId", async (req, res) => {
  try {
    const { forumId } = req.params;
    const forumDoc = await db.collection("forum").doc(forumId).get();
    if (!forumDoc.exists) {
      res.status(404).json({ message: 'Forum not found' });
      return;
    }
    const forum = { id: forumDoc.id, ...forumDoc.data() };
    res.status(200).json(forum);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


router.get("/forums/:forumId/posts", async (req, res) => {
  try {
    const { forumId } = req.params;
    const postsSnapshot = await db.collection("forum").doc(forumId).collection("posts").get();
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ posts });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const commentsSnapshot = await db.collection("posts").doc(postId).collection("comments").get();
    const comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ comments });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


router.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, userId } = req.body;
    const comment = {
      text,
      userId,
      date: new Date()
    };
    await db.collection("posts").doc(postId).collection("comments").add(comment);
    res.status(201).json({ message: 'Successfully created comment' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


module.exports = router;