import React from 'react'
import useAuth from './useAuth'
import {Container, Form} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player' 
import TopArtists from './TopArtists'
import axios from 'axios'
import Info from './Info'
import ArtistTreeMap from './ArtistTreeMap'
import GenreTreeMap from './GenreTreeMap'
import ShowRadio from './ShowRadio'
require('dotenv').config()

const spotifyApi = new SpotifyWebApi({
    clientId : '9df59c7cd0ed4590a8d50badc32fe8a1',
    clientSecret : 'a37e01e02bbd4f51a48077dbebc8e707',
    redirectUri : 'https://compassionate-swartz-d79cd2.netlify.app/',
})

export default function Dashboard({ code }) {
    document.body.style = 'background: #212121;';
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [topArtists, setTopArtists] = useState([])
    const [playedTrack, setPlayedTrack] = useState([])
    //const [playedHistory, setPlayedHistory] = useState([])
    const [topTracks, setTopTracks] = useState([])
    const [artistGenre, setArtistGenre] = useState([])
    const [table, setTable] = useState([])
    const [topTrackIDs, setTopTrackIDs] = useState([])
    const [audioFeats, setAudioFeats] = useState([])

    console.log(accessToken)


    function chooseTrack(track) {
        setPlayingTrack(track)
        setPlayedTrack(track)
        
        // get history from database
        // const history = async () =>{
        // const response = await axios ({
        //     url: "https://mhcheng-spotify.herokuapp.com/history",
        //     method: "GET"
        // })
        // setPlayedHistory(response.data)
        // }
    }

    // get top artists and tracks of user
    useEffect(() => {
        // make sure there is an accessToken
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        
        spotifyApi.getMyTopArtists({time_range: 'short_term'}).then(res => {
            const artistArr = res.body.items.map(artist => {
                if (!artist.images[0]) return "No image"
                 return {
                  name: artist.name,
                  genre: artist.genres[0],
                  artistImage: artist.images[0]
                }
              }) 
            let newArray = artistArr.filter(function(element) {
                return element !== "No image"
            })
            setTopArtists(newArray)
        })

        // get top tracks
        spotifyApi.getMyTopTracks({time_range: 'short_term', limit: 50})
        .then(res => { 
            setTopTracks( res.body.items.map(track => {
                    if (!track.album.images[0]) return "No image"
                    return {
                        track: track.name,
                        artist: track.artists[0].name,
                        duration: track.duration_ms,
                        artistID: track.artists[0].id,
                        genre: "",
                        albumCover: track.album.images[0].url,
                        trackID: track.id
                    }
                })
            )
        })
    }, [accessToken])

    // calling searchTrack function using spotify-Web-API-Node
    useEffect(() => {
        // if search bar is empty return empty array
        if (!search) return setSearchResults([])
        if (!accessToken) return

        // use cancel to stop search results from overflowing
        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(
              res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce(
                  (smallest, image) => {
                    if (image.height < smallest.height) return image
                    return smallest
                  },
                  track.album.images[0]
                )
                return {
                  artist: track.artists[0].name,
                  title: track.name,
                  uri: track.uri,
                  albumUrl: smallestAlbumImage.url,
                }
              })
            )
          })
          return () => (cancel = true)
    }, [search, accessToken])


    let stop = false
    useEffect(() => {
        for (var i = 0; i < topTracks.length; i++) {
            spotifyApi.getArtist(topTracks[i].artistID).then(function(data) {
                if (data.body.genres.length !== 0) {
                    setArtistGenre((oldArr) => oldArr.concat({artistID: data.body.id, genre: data.body.genres[0]}))
                }
                else {
                    setArtistGenre((oldArr) => oldArr.concat({artistID:  data.body.id, genre: "None"}))
                    }
                })
            }
        axios.post("https://mhcheng-spotify.herokuapp.com/api/insert", topTracks)
        
        // assign top track IDs
        setTopTrackIDs(topTracks.map(track=> {
            return track.trackID
        }))
    }, [topTracks])


    useEffect(() => {
        if (artistGenre.length >= topTracks.length && artistGenre.length !== 0) {
            axios.post("https://mhcheng-spotify.herokuapp.com/api/insertGenre", artistGenre)
            axios.get("https://mhcheng-spotify.herokuapp.com/api/get").then(response =>{
                setTable(response.data)
            })
        }
    }, [artistGenre])


    // get audio info after topTrackIDs are assigned
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        spotifyApi.getAudioFeaturesForTracks(topTrackIDs)
        .then(function(data) {
            setAudioFeats(data.body.audio_features)
        });
    }, [topTrackIDs])
    
    var toPost = true
    if (toPost === true) {
        axios.post("https://mhcheng-spotify.herokuapp.com/test", "hello world")
        toPost = false
    }

    return (
        <Container>
        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
            <Form.Control type="search" placeholder="Artists, songs, or albums" 
            value={search} onChange={e => setSearch(e.target.value)} />
            <div className="d-flex flex-row mt-3">
                <h3><font color="white">Your Top Artists</font></h3>
            </div>
            <div className="d-flex flex-row mb-3" style={{ overflowY: "auto" }}>
                <div className="split right">
                    {topArtists.map( artist =>(
                        <TopArtists artist={artist} />
                    ))}
                </div>
                <div className="flex-grow-1" style={{ overflowY: "auto" }}>
                    {searchResults.map(track =>(
                        <TrackSearchResult track={track} chooseTrack={chooseTrack} />
                    ))}
                </div>
            </div>
            <div>
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} playedTrack={playedTrack}/>
            </div>
        </Container>
            <Container className="d-flex flex-column mt-5" style={{ height: "100vh" }}> 
                <h3 className="graph-top-margin mb-3"><font color="white">How often an Artist Appears in your Top 50 Tracks</font></h3>
                <div>
                    <ArtistTreeMap table={table} />
                </div>
            </Container>
            <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
                <h3 className="mb-3"><font color="white">Your Favorite Genres</font></h3>
                <div className="d-flex flex-row">
                    <GenreTreeMap table={table} />
                </div>
            </Container>
            <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
                <h3 className="mb-3"><font color="white">The Duration of Your Top Songs</font></h3>
                <div>
                    <div className="text-muted p"># of songs</div>
                    <Info table={table} />
                </div>
            </Container>
            <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
                <h3 className="mb-3"><font color="white">The Audio Features You Prefer</font></h3>
                <div className="d-flex flex-row div-1 ">
                    <ShowRadio audioFeats={audioFeats} />
                    <div className="d-flex flex-column py-4 mt-3 mx-5">
                        <h4 className="mt-3 mb-3 centerRight">What the Values Represent:</h4>
                        <p className="centerRight">Accousticness: How acoustic a song is</p>
                        <p className="centerRight">Danceability: How suitable is a song for dancing</p>
                        <p className="centerRight">Energy: Measured by intensity and activity</p>
                        <p className="centerRight">Livness: Measured by involvment of audience</p>
                        <p className="centerRight">Instrument: Measured by the absence of vocal</p>
                    </div>
                </div>
            </Container>
        </Container>
    )
}
