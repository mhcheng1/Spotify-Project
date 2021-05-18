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

const PORT = 3000;
const PORT1 = 3001;

// mongoose
// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
// );
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// })

// const usersRouter = require('./routes/history');
// app.use('/history', usersRouter);


// MySQL
// Heroku info ->  mysql://b60046b95e2443:a6972415@us-cdbr-east-03.cleardb.com/heroku_889e5e6e8267075?reconnect=true
// Jaws Maria -> mysql://y4z59yu63trbj2yl:rtmg5qdxxr2qp8iq@u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/y283yep837k86qzr
var db_config = {
  host: "us-cdbr-east-03.cleardb.com",
  user: "b60046b95e2443",
  password: "a6972415",
  database: "heroku_889e5e6e8267075"
}

 //db.connect()

  var connection;

  var spotifyID = "david999qq"
  
  var tempID
  app.post("/api/setSpotifyID", (req, res) => {
    tempID = req.body
  })
  app.get("/api/getSpotifyID", (req, res) => {
    let param = req.query.id
    res.send(param)
  })



 function handleDisconnect() {
   connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                   // the old one cannot be reused.
 
   connection.connect(function(err) {              // The server is either down
     if(err) {                                     // or restarting (takes a while sometimes).
       console.log('error when connecting to db:', err);
       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
     }                                     // to avoid a hot loop, and to allow our node script to
   });                                     // process asynchronous requests in the meantime.
                                           // If you're also serving http, display a 503 error.
   connection.on('error', function(err) {
     console.log('db error', err);
     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
       handleDisconnect();                         // lost due to either server restart, or a
     } else {                                      // connnection idle timeout (the wait_timeout
       throw err;                                  // server variable configures this)
     }
   });

   app.get("/api/get", (req, res) => {
      let param = req.query.id
      const sqlSelect = "SELECT * FROM user WHERE spotifyID=?"
      connection.query(sqlSelect, [param] , (err, results) => {
        res.send(results)
        //res.send(tempID)
      })
    })

  
  app.get("/api/getTrackInfo", (req, res) => {
      let param = req.query.trackID
      const sqlSelect = "SELECT * FROM user WHERE trackID=?"
      connection.query(sqlSelect, [param] , (err, results) => {
        res.send(results)
        //res.send(tempID)
      })
  })

    // handles top track insertion
  app.post("/api/insert", (req, res) => {
    var track
    var artist
    var duration
    var artistID
    var albumCover
    var spotifyID = req.body[0].spotifyID
    const topTracks = req.body
    const sqlInsert = "INSERT INTO user(track, spotifyID, artist, duration, artistID, genre, albumCover, trackID) values(?,?,?,?,?,?,?,?);"
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

        connection.query(sqlInsert, [track, spotifyID, artist, duration, artistID, genre, albumCover, trackID], (err, result) => {
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
        connection.query(sqlUpdate, [genre, artistID], (err, result) => {
          //console.log(err)
        })
      }
    })

 }
 
 handleDisconnect();


app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        refreshToken,
        clientId : '9df59c7cd0ed4590a8d50badc32fe8a1',
        clientSecret : process.env.CLIENT_SECRET,
        redirectUri : 'https://compassionate-swartz-d79cd2.netlify.app',
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



app.get("/", (req, res) => {
  res.send('go to /my-project to see my project')
})

app.get("/login", (req, res) => {
  const spotifyApi = new SpotifyWebApi({
    clientId : '9df59c7cd0ed4590a8d50badc32fe8a1',
    clientSecret : 'a37e01e02bbd4f51a48077dbebc8e707',
    redirectUri : 'https://compassionate-swartz-d79cd2.netlify.app/',
  })
  const code = 'AQB915-bzgpdSFEQIXRlF50SilyeLUiABj73j4-oZ2RPXWrcDGqDwaBjGdtRjmold5HTjRIbiXC4OxbRREkB4ELjEaZQZSwF-l73E23UErlaSci6qydECu_17hbMYtkOna-7g6frJimcnrN-ZYqQTPNAqrDpHQOZahlAfE5Ufg6agGcxtut6fdPeGo6dcE0jCG6D7ZBFgDE8IjMoZ6jUfVoYcP4h1NJK6pwWjFjF50iiCeBQLa4q21BSST1QnxXg-iv4_LueVHQKhxWrf6hS-55UY89DcfsGeotChegmlCL5v2PCfJyYUKystVTAJGNTDJhAyYi8NPwnZkkyWoy_UQIETOyFzJUbLT4mS-2qqb0FpKf3dZ-j3rLhCm_p1XwOL8ioGAaOU5zz5yYXR-wE8g'
  spotifyApi.authorizationCodeGrant(code).then(data=>{
      res.send(data.body.access_token)
    }).catch(err=>{
      console.error(err)
      res.send(err) 
    })
})


app.post('/test', (req, res) => {
  res.send("test get")
  res.sendStatus(999)
})

// https://github.com/BrOrlandi/spotify-web-api-node
// follow structure given in authorization section to translate token from code
app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        clientId : '9df59c7cd0ed4590a8d50badc32fe8a1',
        clientSecret : 'a37e01e02bbd4f51a48077dbebc8e707',
        redirectUri : 'https://compassionate-swartz-d79cd2.netlify.app/',
    })

    spotifyApi.authorizationCodeGrant(code).then(data=>{
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err=>{
        console.error(err)
        res.sendStatus(err)
        //res.sendStatus(400)
    })
})

app.listen( process.env.PORT || PORT1)