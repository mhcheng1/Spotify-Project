import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Login'
import Dashboard from './Dashboard'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Navbar from './Navbar'
import ShowHistory from './ShowHistory'
import Info from './Info'

// parse the url given after login and retrieve the code within
const code = new URLSearchParams(window.location.search).get('code')

function App() {
  if (!code) {
    return <Login />
  }
  else if (code) {
    return (
      <Router>
        <Navbar />
            <Router path="/dashboard">
              <Dashboard code={code} />
            </Router>
          <Switch>
            <Router path="/history">
              <ShowHistory code={code} />
            </Router>
            <Router path="/info">
              <Info />
            </Router>
          </Switch>
      </Router>
    )
  }

  // if (code) {
  //   return <Dashboard code={code} />
  // }
  // else {
  //   return <Login />
  // } 
}

export default App;
