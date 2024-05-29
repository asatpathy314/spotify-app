const express = require('express');
const router = express.Router();
const db = require('./firebase');  // Correct path to firebase.js


// router.post("/Messages", async (req, res) => {
//   try {
//     const { name } = req.body;
//     const docRef = await db.collection("user").add({
//       name: name,
//       date: new Date()
//     });
//     res.status(201).json({ message: `Successfully created post with id ${docRef.id}` });
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// });


// router.post("/forums/:forumId/posts", async (req, res) => {
//     try {
//       const { forumId } = req.params;
//       const { title, description, userId } = req.body;
//       const post = {
//         title,
//         description,
//         userId,
//         upvotes: 0,
//         date: new Date()
//       };
//       await db.collection("forum").doc(forumId).collection("posts").add(post);
//       res.status(201).json({ message: 'Successfully created post' });
//     } catch (e) {
//       res.status(400).json({ error: e.message });
//     }
// });

// Fetch the specific conversation
router.get('/conversation', async (req, res) => {
  try {
    const conversationId = req.query.conversationId; // Access conversationId from URL params
    console.log("I am here", conversationId);

    if (!conversationId) {
      return res.status(405).json({ error: "ConvoId is required" });
    }
    const convoDoc = await db.collection("conversation").doc(conversationId).get(); // Use conversationId here

    if (!convoDoc.exists) { // Check for conversation existence
      return res.status(404).json({ error: "Conversation not found" });
    }

    const convoData = convoDoc.data();

    console.log(convoData);
    res.status(200).json({ convoData });
    
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//fetch a conversation array of a specific user
router.get("/", async (req, res) => {
  try {
    // Assuming you get the userId from the request (e.g., req.userId)
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const userDoc = await db.collection("user").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const conversations = userData.conversations || [];

    console.log(conversations);
    res.status(200).json({ conversations });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
 
module.exports = router;
