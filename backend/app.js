// Initialize Express app
const express = require("express");
const app = express();
app.use(express.json());

//Initialize CORS
const cors = require('cors')
app.use(cors())

//Initialize Cookie Parse
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//Import Routes
//const artists = require("./api/getArtists");
const auth = require("./api/auth")
const forum = require("./forum");


//initialize Routes
app.use('/auth', auth)
app.use('/forum', forum);


// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

