import React from 'react'
import useAuth from './useAuth'
import {Container, Form} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player' 
import TopArtists from './TopArtists'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import Info from './Info'
import ArtistTreeMap from './ArtistTreeMap'
import GenreTreeMap from './GenreTreeMap'
import ShowRadio from './ShowRadio'
import UserForm from './UserForm'

const spotifyApi = new SpotifyWebApi({
    clientId : '9df59c7cd0ed4590a8d50badc32fe8a1'
})

export default function Dashboard({ code }) {
    document.body.style = 'background: #212121;';
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [topArtists, setTopArtists] = useState([])
    const [playedTrack, setPlayedTrack] = useState([])
    const [playedHistory, setPlayedHistory] = useState([])
    const [topTracks, setTopTracks] = useState([])
    const [artistGenre, setArtistGenre] = useState([])
    const [table, setTable] = useState([])
    const [topTrackIDs, setTopTrackIDs] = useState([])
    const [audioFeats, setAudioFeats] = useState([])
    const [userForm, setUserForm] = useState([{tempo: 0, danceability: 0, loudness: 0}])
    
    // tempo
    // danceability
    // loudness

    function chooseTrack(track) {
        setPlayingTrack(track)
        setPlayedTrack(track)
        
        // get history from database
        const history = async () =>{
        const response = await axios ({
            url: "http://localhost:3001/history",
            method: "GET"
        })
        setPlayedHistory(response.data)
        }
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
        axios.post("http://localhost:3001/api/insert", topTracks)
        
        // assign top track IDs
        setTopTrackIDs(topTracks.map(track=> {
            return track.trackID
        }))
    }, [topTracks])


    useEffect(() => {
        if (artistGenre.length >= topTracks.length && artistGenre.length !== 0) {
            axios.post("http://localhost:3001/api/insertGenre", artistGenre)
            axios.get("http://localhost:3001/api/get").then(response =>{
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
    

    const [tempoV, setTempoV] = useState(0)
    const [danceV, setDanceV] = useState(0)
    const [loudV, setLoudV] = useState(0)

    const handleChangeTempo =(e)=>{
        setTempoV(e.target.value)
    }

    const handleChangeDance =(e)=>{
        setDanceV(e.target.value)
    }

    const handleChangeLoud =(e)=>{
        setLoudV(e.target.value)
    }

    const handleChangeForm = (e)=>{
        setUserForm([{
          tempo: tempoV,
          danceability: danceV,
          loudness: loudV
        }])
    }



    return (
        <Container className="mt-3">
        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
            <Form.Control type="search" placeholder="Artists, songs, or albums" 
            value={search} onChange={e => setSearch(e.target.value)} />
            <div className="d-flex flex-row mt-3">
                <h3><font color="white">Your Top Artists</font></h3>
                <Button bsStyle="primary" size="lg">Insert</Button>
                <Button bsStyle="primary" size="lg">test</Button>
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
            <Container style={{ height: "100vh" }}> 
                <form className="d-flex flex-column py-2 center">
                <h3 className="mb-2"><font color="white">Find a Song to Your Mood</font></h3>
                    <font color="white" className="mb-1">Tempo</font>
                    <div className="d-flex flex-row mb-3">
                        <input type="radio" value="1"
                            onChange={handleChangeTempo} name="tempo" />
                            <font color="white">Slow</font>
                        <input type="radio" value="2"
                            onChange={handleChangeTempo} name="tempo" />
                            <font color="white">Medium</font>
                        <input type="radio" value="3"
                            onChange={handleChangeTempo} name="tempo"/>
                            <font color="white">Fast</font>
                    </div>
                    
                    <font color="white" className="mb-1">Danceability</font>
                    <div className="d-flex flex-row mb-3">
                        <input type="radio" value="1"
                            onChange={handleChangeDance} name="danceability" />
                            <font color="white">Chill</font>
                        <input type="radio" value="2"
                            onChange={handleChangeDance} name="danceability" />
                            <font color="white">Groovy</font>
                        <input type="radio" value="3"
                            onChange={handleChangeDance} name="danceability"/>
                            <font color="white">Dance!</font>
                    </div>

                    <font color="white" className="mb-1">Loudness</font>
                    <div className="d-flex flex-row mb-3">
                        <input type="radio" value="1"
                            onChange={handleChangeLoud} name="loudness" />
                            <font color="white">Quiet</font>
                        <input type="radio" value="2"
                            onChange={handleChangeLoud} name="loudness" />
                            <font color="white">Normal</font>
                        <input type="radio" value="3"
                            onChange={handleChangeLoud} name="loudness"/>
                            <font color="white">Loud</font>
                    </div>
                    <input type="checkbox"
                            onChange={handleChangeForm} />
                            <font color="white">Submit</font>
                </form>
                <div>
                    {userForm.map(userForm =>(
                            <UserForm  audioFeats={audioFeats} userForm={userForm} />
                    ))}
                </div>
            </Container>
        </Container>
    )
}
