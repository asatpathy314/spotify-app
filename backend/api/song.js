const express = require("express");
const querystring = require('querystring');
const request = require('request');
const router = express.Router();

/**
 * @api {get} / Get User's Top Tracks
 * @apiName GetTopTracks
 * @apiGroup Spotify
 * 
 * @apiParam {String} spotify_token Spotify access token.
 * @apiParam {Number} num_songs Number of top tracks to retrieve (default is 10).
 * @apiParam {String} timeframe Time range for top tracks. Valid values are "short_term", "medium_term", and "long_term".
 * 
 * @apiSuccess {Object} data JSON object containing the user's top tracks.
 * 
 * @apiError {Object} 400 Missing required parameter.
 * @apiError {Object} 500 Failed to fetch top tracks.
 * 
 */

router.get('/', (req, res) => {
    const spotify_token = req.query.spotify_token;
    const num_songs = req.query.num_songs || 10; // Default to 10 songs
    const timeframe = req.query.timeframe;
    const offset = 0;

    if (!timeframe || !spotify_token || (timeframe !== "short_term" && timeframe !== "medium_term" && timeframe !== "long_term")) {
        return res.status(400).json({ error: "Missing required parameter" });
    }

    const type = "tracks";

    const options = {
        url: `https://api.spotify.com/v1/me/top/${type}?` + querystring.stringify({
            limit: num_songs,
            time_range: timeframe,
            offset: offset
        }),
        headers: { 'Authorization': 'Bearer ' + spotify_token }
    };

    request.get(options, (error, response, body) => {
        if (error) {
            return res.status(500).json({ error: "Failed to fetch top tracks" });
        }
        const data = JSON.parse(body);
        console.log(data);
        res.status(200).json(data);
    });
});

router.get('/liked', (req, res) => {
    const spotify_token = req.query.spotify_token;
    const num_songs = req.query.num_songs || 50; // Default to 50 songs

    if (!spotify_token) {
        return res.status(400).json({ error: "Missing required parameter" });
    }

    const options = {
        url: `https://api.spotify.com/v1/me/tracks?` + querystring.stringify({
            limit: num_songs,
        }),
        headers: { 'Authorization': 'Bearer ' + spotify_token }
    };

    request.get(options, (error, response, body) => {
        if (error) {
            return res.status(500).json({ error: "Failed to fetch top tracks" });
        }
        const data = JSON.parse(body);
        console.log(data);
        res.status(200).json(data);
    });
});

module.exports = router;
