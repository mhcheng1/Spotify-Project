import React from 'react'
import SpotifyPlayer from "react-spotify-web-playback"
import {useState, useEffect} from 'react'


// uses Spotify Web Player to handle the playing functions
// https://www.npmjs.com/package/react-spotify-web-playback
export default function Player({ accessToken, trackUri}) {    
    const [play, setPlay] = useState(false)
    useEffect(() => setPlay(true), [trackUri])
    if (!accessToken) return null
    
    return (
        <SpotifyPlayer token={accessToken} showSaveIcon uris={trackUri ? [trackUri] : []} 
        callback={state =>{
            if (!state.isPlaying) setPlay(false)
        }}
        play={play}
        styles={{
            activeColor: '#fff',
            bgColor: '#212121',
            color: '#fff',
            loaderColor: '#fff',
            sliderColor: '#1cb954',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
          }}
        />
    )
}
