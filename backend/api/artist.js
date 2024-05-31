const express = require("express");
const querystring = require('querystring');
const request = require('request');
const router = express.Router();

/**
 * @api {get} / Get User's Top Artists
 * @apiName GetTopArtists
 * @apiGroup Spotify
 * 
 * @apiParam {String} spotify_token Spotify access token.
 * @apiParam {Number} [num_artists=10] Number of top artists to retrieve (default is 10).
 * @apiParam {String} timeframe Time range for top artists. Valid values are "short_term", "medium_term", and "long_term".
 * 
 * @apiSuccess {Object} data JSON object containing the user's top artists.
 * 
 * @apiError {Object} 400 Missing required parameter.
 * @apiError {Object} 500 Failed to fetch top artists.
 * 
 */
router.get('/', (req, res) => {
    const spotify_token = req.query.spotify_token;
    const num_artists = req.query.num_artists || 10; // Default to 10 artists
    const timeframe = req.query.timeframe;
    const offset = 0;

    if (!timeframe || !spotify_token || (timeframe !== "short_term" && timeframe !== "medium_term" && timeframe !== "long_term")) {
        return res.status(400).json({ error: "Missing required parameter" });
    }

    const type = "artists";

    const options = {
        url: `https://api.spotify.com/v1/me/top/${type}?` + querystring.stringify({
            limit: num_artists,
            time_range: timeframe,
            offset: offset
        }),
        headers: { 'Authorization': 'Bearer ' + spotify_token }
    };

    request.get(options, (error, response, body) => {
        if (error) {
            return res.status(500).json({ error: "Failed to fetch top artists" });
        }
        const data = JSON.parse(body);
        res.status(200).json(data);
    });
});

module.exports = router;
