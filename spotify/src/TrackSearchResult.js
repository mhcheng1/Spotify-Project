import React from 'react'

export default function TrackSearchResult({ track, chooseTrack}) {
    function handlePlay() {
        chooseTrack(track);
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
