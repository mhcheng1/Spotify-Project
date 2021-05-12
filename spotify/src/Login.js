import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import "./styles.css";
import Button from 'react-bootstrap/Button'

const AUTH_URL =   "https://accounts.spotify.com/authorize?client_id=9df59c7cd0ed4590a8d50badc32fe8a1&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-top-read"

export default function Login() {
    document.body.style = 'background: #2E2E2E;';
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="ml-10">
                <h1 className="mx-3">
                    <font color="white">  
                        Welcome <br></br>  
                    </font>
                </h1>  
                <Button bsStyle="primary" href={AUTH_URL} size="lg">Login with Spotify</Button>
            </div>
        </Container>
    )
}


