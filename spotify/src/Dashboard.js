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
import ShowRadarChart from './ShowRadarChart'

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
        spotifyApi.getMyTopTracks({time_range: 'short_term', limit: 5})
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
    

    return (
        <Container>
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
            <Container className="d-flex flex-column" style={{ height: "100vh" }}> 
                <div className="graph-top-margin">
                    <GenreTreeMap table={table} />
                </div>
            </Container>
            <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
                <div className="div-1">
                    <ShowRadarChart audioFeats={audioFeats} />
                </div>
            </Container>
            <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
                <div>
                    <ArtistTreeMap table={table} />
                </div>
            </Container>
            <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
                <h3><font color="white">The Duration of Your Top Songs</font></h3>
                <div>
                    <div className="text-muted p"># of songs</div>
                    <Info table={table} />
                </div>
            </Container>
        </Container>
    )
}
