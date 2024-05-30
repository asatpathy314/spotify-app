const express = require('express');
const router = express.Router();
const db = require('./firebase');  // Correct path to firebase.js
const { FieldValue, Timestamp } = require('firebase-admin/firestore');

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

// Fetch the specific conversation
router.get('/conversation', async (req, res) => {
  try {
    const conversationId = req.query.id;
    if (!conversationId) {
      return res.status(400).send("Missing query parameter: id");
    }
    const conversationDoc = await db.collection("conversation").doc(conversationId).get();
    if (conversationDoc.exists) {
      const conversationData = conversationDoc.data();
      res.status(200).send(conversationData);
    } else {
      res.status(404).send("Conversation not found");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post('/updateConversation', async (req, res) => {
  try {
    const conversationId = req.query.id;
    const userID = req.query.userID;
    const newMessage = req.body.messages;
    newMessage[0].timestamp = Timestamp.now();
    newMessage[0].user = db.collection("user").doc(userID);

    if (!conversationId) {
      return res.status(400).send("Missing query parameter: id");
    }

    const conversationDocRef = db.collection("conversation").doc(conversationId);
    const conversationDoc = await conversationDocRef.get();

    if (!conversationDoc.exists) {
      return res.status(404).send("Conversation not found");
    }

    await conversationDocRef.update({
      messages: FieldValue.arrayUnion(newMessage[0])
    });

    return res.status(200).send("Messages added successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post('/createConversation', async (req, res) => {
  try {
    const { content, user1Id, user2Id } = req.body;

    if (!content || !user1Id || !user2Id) {
      return res.status(400).send("Missing required fields: content, user1Id, user2Id");
    }

    // Check if a conversation already exists between the two users
    const existingConversationQuery = await db.collection('conversation')
      .where('user1', 'in', [db.collection('user').doc(user1Id), db.collection('user').doc(user2Id)])
      .where('user2', 'in', [db.collection('user').doc(user1Id), db.collection('user').doc(user2Id)])
      .get();

    if (!existingConversationQuery.empty) {
      // A conversation already exists, update it
      const existingConversation = existingConversationQuery.docs[0];
      const existingConversationId = existingConversation.id;
      const newMessage = {
        text: content,
        user: db.collection('user').doc(user1Id),
        timestamp: Timestamp.now()
      };

      await existingConversation.ref.update({
        messages: FieldValue.arrayUnion(newMessage)
      });

      return res.status(200).send({ message: "Message added to existing conversation", conversationId: existingConversationId });
    }

    // No existing conversation, create a new one
    const conversationRef = db.collection('conversation').doc();
    const conversationId = conversationRef.id;
    
    const user1Ref = db.collection('user').doc(user1Id);
    const user2Ref = db.collection('user').doc(user2Id);

    const message = {
      text: content,
      user: user1Ref,
      timestamp: Timestamp.now()
    };

    await conversationRef.set({
      user1: user1Ref,
      user2: user2Ref,
      messages: [message],
    });

    await user1Ref.update({
      conversations: FieldValue.arrayUnion(conversationRef)
    });

    await user2Ref.update({
      conversations: FieldValue.arrayUnion(conversationRef)
    });

    res.status(201).send({ message: "Conversation created successfully", conversationId: conversationId });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;


