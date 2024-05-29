const express = require("express");
const router = express.Router();
const db = require('./firebase');

router.get("/", async (req, res) => {
    try {
        // Access the query parameter "id"
        const userId = req.query.id;
        
        if (!userId) {
            return res.status(400).send("Missing query parameter: id");
        }

        // Reference to the user document
        const userDoc = await db.collection("user").doc(userId).get()
        
        if (userDoc.exists) {
            // Send the user data as response
            res.status(200).json(userDoc.data());
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/all", async(req, res) => {
    try {
        // Access the query parameter "id"
        const userId = req.query.id;
        
        if (!userId) {
            return res.status(400).send("Missing query parameter: id");
        }

        // Reference to the user document
        const usersSnapshot = await db.collection("user").get()
        const users = [];
        usersSnapshot.forEach(doc => {
            users.push({...doc.data(), id: doc.id});
        });
        res.status(200).json(users);
        
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
