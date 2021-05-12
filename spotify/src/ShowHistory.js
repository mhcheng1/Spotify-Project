import React from 'react'

export default function ShowHistory( { history } ) {
    return (
        <div className="d-flex align-items-center">
            <img src={history.albumCover} style={{height:'128px', width:'128px'}} />
            <div>
                <div className="p"><font color="white">{history.title}</font></div>
                <div className="text-muted p">{history.artist}</div>
            </div>
        </div>
    )
}