// Initialize Express app
const express = require("express");
const app = express();
app.use(express.json());

//Initialize CORS
var cors = require('cors')
app.use(cors())

// Import Routes
const artists = require("./getArtists");

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

