import "./styles.css";
import React from "react";
import {useState, useEffect} from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

export default function ShowRadarChart ( {audioFeats}) {
    // acousticness, instrumentalness, liveness, tempo, loudness
    // danceability, energy, valence(positivity), duration, popularity

    const[avgAcous, setAvgAcous] = useState(0)
    const[avgInstru, setAvgInstru] = useState(0)
    const[avgLive, setAvgLive] = useState(0)
    const[avgTemp, setAvgTemp] = useState(0)
    const[avgLoud, setAvgLoud] = useState(0)
    //const[data, setData] = useState([])

    const data = [
        {
          subject: "Acousticness",
          A: 120,
          fullMark: 1,
        
        },
        {
          subject: "Chinese",
          A: 0.2,
          fullMark: 1
        },
        {
            subject: "Chinese",
            A: 0.4,
            fullMark: 1
        },
      ];

    var totalAcous = 0
    useEffect(() => {
        if (audioFeats.length > 0) {
            console.log(audioFeats)
            for (var i = 0; i < audioFeats.length; i++) {
                totalAcous += audioFeats[i].acousticness
            }
        }
        setAvgAcous(totalAcous / 5)
    }, [audioFeats])
    console.log(avgAcous)


  return (
    <RadarChart
      cx={300}
      cy={250}
      outerRadius={150}
      width={500}
      height={500}
      data={data}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis />
      <Radar
        name="Mike"
        dataKey="A"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
    </RadarChart>
  );
}