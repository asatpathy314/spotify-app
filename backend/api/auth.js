const client_id = 'eb3bc4d3cc684b9ebdc027514b24bbcc'; //insert client id
const redirect_uri = 'http://localhost:5173/profile';
const app = express();

app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});