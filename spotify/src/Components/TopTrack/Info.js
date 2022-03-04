import React from 'react'
import axios from 'axios'
import {useState, useEffect} from 'react'
import "./styles.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function Info({ table }) {
    const [data, setData] = useState([])
    const [shortestTrack, setShortestTrack] = useState({track: "", artist: "", albumCover: '', duration: 0})
    const [longestTrack, setLongestTrack] = useState({track: "", artist: "", albumCover: '', duration: 0})


    var oneMinTrack = 0
    var twoMinTrack = 0
    var threeMinTrack = 0
    var fourMinTrack = 0
    var fiveMinTrack = 0
    
    var shortTrackDur = 50000
    var longTrackDur = 0


    useEffect(() => {
        if (table.length > 0) {
            
            for (var i = 0; i < table.length; i++) {
                // find shortest track
                if (table[i].duration/1000 < shortTrackDur) {
                    shortTrackDur = table[i].duration/1000
                    setShortestTrack({
                        track: table[i].track, 
                        artist: table[i].artist, 
                        albumCover: table[i].albumCover, 
                        duration: Math.round(table[i].duration/1000)
                    })
                }
                // find longest track
                if (table[i].duration/1000 > longTrackDur) {
                    longTrackDur = table[i].duration/1000
                    setLongestTrack({
                        track: table[i].track, 
                        artist: table[i].artist, 
                        albumCover: table[i].albumCover, 
                        duration: Math.round(table[i].duration/1000)
                    })
                }
                if (table[i].duration/1000 <= 120) {
                    oneMinTrack++
                }
                else if (table[i].duration/1000 <= 180) {
                    twoMinTrack++
                }
                else if (table[i].duration/1000 <= 240) {
                    threeMinTrack++
                }
                else if (table[i].duration/1000 <= 300) {
                    fourMinTrack++
                }
                else if (table[i].duration/1000 > 300) {
                    fiveMinTrack++
                }
                
            }
            //console.log(oneMinTrack, twoMinTrack, threeMinTrack, fourMinTrack, fiveMinTrack)            
            setData([{
                name: "1 Minute",
                Songs: oneMinTrack
              },
              {
                name: "2 Minutes",
                Songs: twoMinTrack
              },
              {
                name: "3 Minutes",
                Songs: threeMinTrack
              },
              {
                  name: "4 Minutes",
                  Songs: fourMinTrack
              },
              {
                name: "> 5 Minutes",
                Songs: fiveMinTrack
            },
            ])
        }
    }, [table])


    return (
        <div className="d-flex flex-row mt-3">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="Songs" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
        <div className="flex-grow-1" style={{ overflowY: "auto" }}>
            
            <h5 className="mt-3 mb-3"><font color="white">Shortest Track</font></h5>
            <div className="d-flex align-items-center">
                    <img src={shortestTrack.albumCover} style={{height:'64px', width:'64px'}} />
                    <div>
                        <div className="p"><font color="white">{shortestTrack.track}</font></div>
                        <div className="text-muted p">{shortestTrack.artist}</div>
                    </div>
                    <div className="p"><font color="white">{shortestTrack.duration} Seconds</font></div>
            </div>
            
            <h5 className="mt-3 mb-3"><font color="white">Longest Track</font></h5>
            
            <div className="d-flex align-items-center">
                    <img src={longestTrack.albumCover} style={{height:'64px', width:'64px'}} />
                    <div>
                        <div className="p"><font color="white">{longestTrack.track}</font></div>
                        <div className="text-muted p">{longestTrack.artist}</div>
                    </div>
                    <div className="p"><font color="white">{longestTrack.duration} Seconds</font></div>
            </div>
        </div>
        </div>
      );
}