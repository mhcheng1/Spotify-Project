const express = require('express');
const SpotifyWebApi = require("spotify-web-api-node")
const cors = require('cors');   // encountered issue with CORS policy blocking
require('dotenv').config()
const mongoose = require('mongoose');
const mysql = require('mysql')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// mongoose
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const usersRouter = require('./routes/history');
app.use('/history', usersRouter);


// MySQL
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

db.connect()

// handles top track insertion
app.post("/api/insert", (req, res) => {
  var track
  var artist
  var duration
  var artistID
  var albumCover
  const topTracks = req.body
  const sqlInsert = "INSERT INTO user(track, artist, duration, artistID, genre, albumCover, trackID) values(?,?,?,?,?,?,?);"
  console.log(req.body)

  var i;
  for (i = 0; i < topTracks.length; i++) {
      track = topTracks[i].track,
      artist = topTracks[i].artist,
      duration = topTracks[i].duration,
      artistID = topTracks[i].artistID
      genre = topTracks[i].genre
      albumCover = topTracks[i].albumCover
      trackID = topTracks[i].trackID

      db.query(sqlInsert, [track, artist, duration, artistID, genre, albumCover, trackID], (err, result) => {
        //console.log(err)
      })
  }
})

// handles updating top tracks genre
app.post("/api/insertGenre", (req, res) => {
  //console.log(req.body)
  var artistID
  var genre
  const genres = req.body
  for (var i = 0; i < genres.length; i++) {
    artistID = genres[i].artistID
    genre = genres[i].genre
    const sqlUpdate = "Update user SET genre = ? where artistID = ? ;"
    db.query(sqlUpdate, [genre, artistID], (err, result) => {
      //console.log(err)
    })
  }
})


app.post('/refresh', (req, res) => {
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

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM user"
  db.query(sqlSelect, (err, results) => {
    res.send(results)
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