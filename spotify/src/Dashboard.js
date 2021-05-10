import React from 'react'
import useAuth from './useAuth'
import {Container, Form} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player' 
import TopArtists from './TopArtists'

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
    console.log(topArtists)

    function chooseTrack(track) {
        setPlayingTrack(track)
    }

    useEffect(() => {
        // make sure there is an accessToken
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        spotifyApi.getMyTopArtists().then(res => {
            setTopArtists(res.body.items.map(artist => {
                //if (!artist.images[0]) return []
                 return {
                  name: artist.name,
                  genre: artist.genres[0],
                  artistImage: artist.images[0]
                }
              }) )
            // const artists = []
            // for (let i = 0; i < topArtists.length; i++) {
            //     if (topArtists[i] !== []) {
            //         artists.push(topArtists[i]);
            //     }
            // }
            // setTopArtists(artists)
            // console.log(topArtists)
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
            <div>
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
                        <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                    ))}
                </div>
            </div>
            <div>
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
            </div>
        </Container>
    )
}
