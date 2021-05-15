import React from 'react'
import {Link} from 'react-router-dom'

export default function Navbar() {
    document.body.style = 'background: #212121;';

    return (
        <div className="d-flex flex-row mx-3 mt-2">
            <h5 className="mx-4"><Link to='/dashboard'><font color="grey">DashBoard</font></Link></h5>
            <h5 className="mx-3"><Link to='/history'><font color="grey">History</font></Link></h5>
            <h5 className="mx-3"><Link to='/info'><font color="grey">Info</font></Link></h5>
        </div>
    )
}
