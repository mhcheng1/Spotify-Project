import React from 'react'

export default function TopArtists({ artist }) {
    return (
        <div className="d-flex align-items-center">
            <img src={artist.artistImage?.url} style={{height:'128px', width:'128px'}} />
            <div>
                <div className="p"><font color="white">{artist.name}</font></div>
                <div className="text-muted p">{artist.genre}</div>
            </div>
        </div>
    )
}
