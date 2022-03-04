import React from 'react'

export default function HistoryPage( {history} ) {
    document.body.style = 'background: #212121;';
    return (
        <div className="d-flex align-items-center">
            <img src={history.albumCover} style={{height:'64px', width:'64px'}} />
            <div>
                <div className="p"><font color="white">{history.title}</font></div>
                <div className="text-muted p">{history.artist}</div>
            </div>
        </div>
    )
}
