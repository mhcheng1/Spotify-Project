const express = require('express');
const SpotifyWebApi = require("spotify-web-api-node")
const cors = require('cors');   // encountered issue with CORS policy blocking
const bodyParser = require('body-parser');  // use for parsing json
require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('./refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        refreshToken,
        clientId : '9df59c7cd0ed4590a8d50badc32fe8a1',
        clientSecret : process.env.CLIENT_SECRET,
        redirectUri : 'http://localhost:3000',
    })
    spotifyApi.refreshAccessToken().then(data => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
})


// https://github.com/BrOrlandi/spotify-web-api-node
// follow structure given in authorization section to translate token from code
app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        clientId : '9df59c7cd0ed4590a8d50badc32fe8a1',
        clientSecret : process.env.CLIENT_SECRET,
        redirectUri : 'http://localhost:3000',
    })

    spotifyApi.authorizationCodeGrant(code).then(data=>{
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err=>{
        console.error(err)
        res.sendStatus(400)
    })
})

app.listen(3001)