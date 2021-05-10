// https://reactjs.org/docs/hooks-reference.html#useeffect
// uses hooks API from React
import {useState, useEffect} from 'react'

// axios allow http requests from node.js
import axios from 'axios'


// useState()
// const [state, setState] = useState(initialState);
// calls setState function below in useEffect 
// and update the previous state values
export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    // input code and post a response to port 3001 for server.js to listen on
    useEffect(() =>{
        axios.post('http://localhost:3001/login', {
            code,
        }).then(res =>{
            console.log(res.data) // contains token data
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            // remove the code from the url on web page
            window.history.pushState({}, null, '/')
        }).catch(() => {
            window.location = '/'
        })
    }, [code])
    
    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
          axios
            .post("http://localhost:3001/refresh", {
              refreshToken,
            })
            .then(res => {
              setAccessToken(res.data.accessToken)
              setExpiresIn(res.data.expiresIn)
            })
            .catch(() => {
              window.location = "/"
            })
        }, (expiresIn - 60) * 1000)
    
        return () => clearInterval(interval)
      }, [refreshToken, expiresIn])

    return accessToken
}
