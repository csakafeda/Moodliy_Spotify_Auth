require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173/music",
        clientId: "d65b7acbcf89421faada8ab7b50a0752",
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        refreshToken
      });
      spotifyApi.refreshAccessToken()
      .then((data) => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        })
      }).catch(() => {
        res.sendStatus(400);
      })
})

app.post('/login', (req, res) => {
    res.send("Hello login!!")
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173/music",
        clientId: "d65b7acbcf89421faada8ab7b50a0752",
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      });

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            });
        }).catch((err) => {
            console.error("Error in authorizationCodeGrant:", err);
            res.status(400).json({ error: 'Authorization failed' });
        });
});

app.listen(process.env.PORT || 3001, () => {
    console.log('Listening on port 3001');
});


module.exports = app;