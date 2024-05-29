var express = require('express');
var request = require('request');
var crypto = require('crypto');
const db = require('./firebase');
require('dotenv').config();
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = process.env.CLIENT_ID; // your clientId
var client_secret = process.env.SECRET_ID; // Your secret
var redirect_uri = 'http://localhost:8000/auth/callback'; // Your redirect uri

const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

var stateKey = 'spotify_auth_state';
const app = express.Router();

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('localhost:5173/profile' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(response.statusCode)
          // we can also pass the token to the browser to make requests from there
          if (response.statusCode === 200) {
            res.redirect(`http://localhost:5173/profile/${body.id}?` +
              querystring.stringify({
                access_token: access_token,
                //refresh_token: refresh_token,
                user_id: body.id
              }));
            
            // TODO: check if there is a user in the Firebase collection 'user' with id body.id. If not 
            // create a new user with the id body.id and then query spotify for favorite song and favorite artist and put it in.
            const userRef = db.collection('user').doc(body.id);
            userRef.get().then(doc => {
              if (!doc.exists) {
                // User does not exist, create a new user
                userRef.set({
                  email: body.email,
                  name: body.display_name,
                  bio: "",
                  conversations: []
                }).then(() => {
                  // Query Spotify for favorite song and favorite artist
                  const topTracksOptions = {
                    url: 'https://api.spotify.com/v1/me/top/tracks?' + querystring.stringify({
                      limit: 1,
                      time_range: 'long_term',
                    }),
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                  };
                  request.get(topTracksOptions, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                      const favoriteSong = body.items[0];
                      userRef.update({ favoriteSong: favoriteSong });
                    }
                  });

                  const topArtistsOptions = {
                    url: 'https://api.spotify.com/v1/me/top/artists?' + querystring.stringify({
                      limit: 1,
                      time_range: 'long_term',
                    }),
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                  };
                  request.get(topArtistsOptions, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                      const favoriteArtist = body.items[0];
                      userRef.update({ favoriteArtist: favoriteArtist });
                    }
                  });
                });
              }
            });  
          } else if (response.statusCode === 403) {
            res.redirect('http://localhost:5173/forbidden?' +
              querystring.stringify({
                error: "You must be registered with the app creator to use this app."
              }));
          
          } else {
            res.redirect('http://localhost:5173/forbidden?' +
              querystring.stringify({
                access_token: access_token,
                error: "An error occurred while accessing the Spotify API."
              }));
          }
        });
      } else {
        res.redirect('http://localhost:5173/profile?' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) 
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
          refresh_token = body.refresh_token;
      res.send({
        'access_token': access_token,
        'refresh_token': refresh_token
      });
    }
  });
});

module.exports = app;
