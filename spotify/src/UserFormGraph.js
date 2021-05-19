import "./styles.css";
import React from "react";
import { BarChart, Bar } from "recharts";
import {useState, useEffect} from 'react'
import axios from 'axios'



export default function UserFormGraph( {track} ) {
    const [data, setData] = useState([
        {
          name: "Page A",
          uv: 12
        },
        {
          name: "Page B",
          uv: 15
        },
        {
          name: "Page C",
          uv: 16
        },
      ])


      const [displayTrack, setDisplayTrack] = useState([])
      useEffect(() => {
        axios.get("http://localhost:3001/api/getTrackInfo", {
            params: {
            trackID: track.id
            }
        } ).then(response =>{
            setDisplayTrack(response.data[0])
        })
        console.log(displayTrack)
    }, [track])



    useEffect(() => {
        setData([
            {
              name: "Page A",
              uv: track.tempo
            },
            {
              name: "Page B",
              uv: track.danceability * 200
            },
            {
              name: "Page C",
              uv: track.loudness + 80
            },
          ])
    }, [track])


    

  return (
    <div className="d-flex flex-column center">
        <BarChart width={200} height={40} data={data}>
        <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
        <div className="d-flex flex-row mt-3">
            <img src={displayTrack?.albumCover} style={{height:'80px', width:'80px'}} />
            <div className="">
                <div className="p"><font color="white">{displayTrack?.track}</font></div>
                <div className="text-muted p">{displayTrack?.artist}</div>
            </div>
        </div>
    </div>
  );
}