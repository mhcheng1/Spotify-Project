const express = require('express');
const SpotifyWebApi = require("spotify-web-api-node")
// encountered issue with CORS policy blocking
const cors = require('cors');
// use for parsing json
const bodyParser = require('body-parser');
//const configData = require('./config-data');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('./refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        refreshToken,
        clientId : configData.clientId,
        clientSecret : configData.clientSecret,
        redirectUri : configData.redirectUri,
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
        clientId : configData.clientId,
        clientSecret : configData.clientSecret,
        redirectUri : configData.redirectUri,
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