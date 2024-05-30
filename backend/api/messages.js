const express = require('express');
const router = express.Router();
const db = require('./firebase');  // Correct path to firebase.js

// Fetch the specific conversation
router.get('/', async (req, res) => {
  try {
    // Access the query parameter "id"
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).send("Missing query parameter: id");
    }
    // Reference to the user document
    const userDoc = await db.collection("user").doc(userId).get();
    if (userDoc.exists) {
      const conversations = userDoc.data().conversations;
      const returnData = [];
      console.log(conversations)
      if (conversations.length > 0) {
        for (const conversation of conversations) {
          const conversationData = await conversation.get() // Assuming fetchData is defined elsewhere
          returnData.push({...conversationData.data(), id: conversationData.id});
        }
        res.status(200).send(returnData);
      } else {
        res.status(200).send({ message: "No conversations found" });
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error retrieving conversations:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
