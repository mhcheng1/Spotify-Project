import React from 'react'
import useAuth from './useAuth'
import {Container, Form} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player' 
import TopArtists from './TopArtists'
import Button from 'react-bootstrap/Button'
import ShowHistory from './ShowHistory'
import axios from 'axios'

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

    function chooseTrack(track) {
        setPlayingTrack(track)
        console.log(track)
        setPlayedTrack(track)
        
        // get history from database
        const history = async () =>{
        const response = await axios ({
            url: "http://localhost:3001/history",
            method: "GET"
        })
        setPlayedHistory(response.data)
        console.log(playedHistory)
        }
    }


    useEffect(() => {
        // make sure there is an accessToken
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        
        spotifyApi.getMyTopArtists().then(res => {
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
            console.log(newArray)
            setTopArtists(newArray)
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



    return (
        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
            <Form.Control type="search" placeholder="Artists, songs, or albums" 
            value={search} onChange={e => setSearch(e.target.value)} />
            <div className="d-flex flex-row mt-3">
                <h3><font color="white">Your Top Artists</font></h3>
                <Button bsStyle="primary" className="mx-3 mb-2">History</Button>
                    {playedHistory.map( history =>(
                        <ShowHistory history={history} />
                    ))}
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
    )
}
