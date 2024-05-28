// Initialize Express app
const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors());
app.use(express.json());

//Initialize Cookie Parse
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//Import Routes
//const artists = require("./api/getArtists");
const auth = require("./api/auth")

//initialize Routes
app.use('/auth', auth)

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

