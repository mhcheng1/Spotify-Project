import React from 'react'
import axios from 'axios'

export default function TrackSearchResult({ track, chooseTrack}) {
    function handlePlay() {
        chooseTrack(track);
        const playedSong = {
            title: track.title,
            artist: track.artist,
            albumCover: track.albumUrl
        }
        console.log(playedSong)
        axios.post('https://mhcheng-spotify.herokuapp.com/history/add', playedSong)
    }

    return (
        <div className="d-flex align-items-center" style={{curser: "pointer"}} onClick={handlePlay}>
            <img src={track.albumUrl} style={{height:'64px', width:'64px'}} />
            <div>
                <div className="p"><font color="white">{track.title}</font></div>
                <div className="text-muted p">{track.artist}</div>
            </div>
        </div>
    )
}
