import React from 'react'
import axios from 'axios'
import {useState, useEffect} from 'react'
import HistoryPage from './HistoryPage'
import {Container, Form} from 'react-bootstrap'


export default function ShowHistory() {
    document.body.style = 'background: #212121;';
    const [history, setHistory] = useState([{
        title: '',
        artist: '',
        albumCover: ''
    }])

    useEffect(() => {
        axios.get("http://localhost:3001/history").then((response) =>{
            setHistory(response.data)
        })
    })


    return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}> 
        <Form.Control type="search" placeholder="Artists, songs, or albums" />
                <div className="d-flex flex-row mt-3">
                    <h3><font color="white">Previously Played</font></h3>
                </div>
        <div className="d-flex flex-row mb-3" style={{ overflowY: "auto" }}>
            <div>
                {history.map( history =>(
                    <HistoryPage history={history} />
                ))}
            </div>
        </div>
    </Container>
    )
}