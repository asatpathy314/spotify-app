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
const user = require("./api/user");
const forum = require("./api/forum");
const song = require("./api/song");
const artist = require("./api/artist");
//const liked = require("./api/liked-songs");

//initialize Routes
app.use('/auth', auth)
app.use('/forum', forum);
app.use('/song', song);
app.use('/artist', artist);
app.use('/liked', song);
app.use('/user', user);

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

