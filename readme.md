# Spotify Song Preferences and Player
[link](https://mhcheng-spotifyapp.netlify.app/)

The application makes use of Spotify auth and contains music playing functionality. In addition, it presents a visualization of the user's song preference as various graphs, and includes a feature that can select songs based on the user's mood.

## Demo:
<img src="https://github.com/mhcheng1/Meng-Hsin_Cheng/blob/main/Spotify-Project/demo/SpotifyApp.gif" width="650">

## Features
A functional web player with search function implemented.
* User's favorite artist
<img src= "https://github.com/mhcheng1/Meng-Hsin_Cheng/blob/main/Spotify-Project/demo/graph3.png" width="650">
* Duration of user's most listened songs
<img src= "https://github.com/mhcheng1/Meng-Hsin_Cheng/blob/main/Spotify-Project/demo/graph2.png" width="650">
* Preference of audio features in a song, such as danceability and liveness
<img src= "https://github.com/mhcheng1/Meng-Hsin_Cheng/blob/main/Spotify-Project/demo/graph1.png" width="650">
* Favorite genres
<img src= "https://github.com/mhcheng1/Meng-Hsin_Cheng/blob/main/Spotify-Project/demo/custom_search.png" width="650">

User can search for a song based on the mood. For instance a user can search for a slow groovy song suitable for dancing.
User can search and play songs directly using the application.

## Technical Architecture 

Frontend: 
 - React.js
 - Hosted on Netlify

Backend:
 - Node.js/Express.js
 - Hosted on Heroku

Database:
 - MySQL

Diagram:

![Technical Architecture](Documentation/Architecture.png)

Spotify User Authorization Flow
![Spotify User Auth Flow](Documentation/Spotify-Auth-Flow.png)
[Reference: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/]

## Libraries Used
* [spotify-web-api-node](https://www.npmjs.com/package/spotify-web-api-node)
* [react-spotify-web-playback](https://www.npmjs.com/package/react-spotify-web-playback)
* recharts

Documentation for Spotify Web API for auth: https://developer.spotify.com/documentation/web-api/ <br><br>

