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
      likes: 0,
      date: new Date().toDateString()
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


// Fetch comments for a specific post
router.get("/forums/:forumId/posts/:postId/comments", async (req, res) => {
  try {
    const { forumId, postId } = req.params;
    const commentsSnapshot = await db.collection("forum").doc(forumId).collection("posts").doc(postId).collection("comments").get();
    const comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ comments });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Add a new comment to a post
router.post("/forums/:forumId/posts/:postId/comments", async (req, res) => {
  try {
    const { forumId, postId } = req.params;
    const { text, userId } = req.body;
    const comment = {
      text,
      userId,
      likes: 0,
      date: new Date().toISOString()  // Store date in ISO format
    };
    await db.collection("forum").doc(forumId).collection("posts").doc(postId).collection("comments").add(comment);
    res.status(201).json({ message: 'Successfully created comment' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Endpoint to like a post
router.post("/forums/:forumId/posts/:postId/like", async (req, res) => {
  try {
    const { forumId, postId } = req.params;
    const postRef = db.collection("forum").doc(forumId).collection("posts").doc(postId);
    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    await postRef.update({ likes: postDoc.data().likes + 1 });
    res.status(200).json({ message: 'Post liked successfully' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Endpoint to like a comment
router.post("/forums/:forumId/posts/:postId/comments/:commentId/like", async (req, res) => {
  const { forumId, postId, commentId } = req.params;
  const { userId } = req.body;

  try {
    const commentRef = db.collection("forum").doc(forumId).collection("posts").doc(postId).collection("comments").doc(commentId);
    const commentDoc = await commentRef.get();
    if (!commentDoc.exists) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const commentData = commentDoc.data();
    const userLikes = commentData.userLikes || [];

    let newLikesCount;
    if (userLikes.includes(userId)) {
      // Unlike the comment
      userLikes.splice(userLikes.indexOf(userId), 1);
      newLikesCount = commentData.likes - 1;
    } else {
      // Like the comment
      userLikes.push(userId);
      newLikesCount = commentData.likes + 1;
    }

    await commentRef.update({ likes: newLikesCount, userLikes });
    res.status(200).json({ likes: newLikesCount, userLikes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;