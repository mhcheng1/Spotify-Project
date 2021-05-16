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


export default function ShowRadio( {audioFeats} ) {
    // acousticness, instrumentalness, liveness, danceability, energy
    // valence(positivity), duration, popularity, tempo, loudness

    const[avgAcous, setAvgAcous] = useState("")
    const[avgInstru, setAvgInstru] = useState("")
    const[avgLive, setAvgLive] = useState("")
    const[avgTemp, setAvgTemp] = useState("")
    const[avgLoud, setAvgLoud] = useState("")
    const[avgEneg, setAvgEneg] = useState("")
    const[avgDance, setAvgDance] = useState("")
    const[data, setData] = useState([])


    var totalAcous = 0
    var totalInstru = 0
    var totalLive = 0
    var totalTemp = 0
    var totalLoud = 0
    var totalEneg = 0
    var totalDance = 0
    useEffect(() => {
        if (audioFeats.length > 0) {
            for (var i = 0; i < audioFeats.length; i++) {
                totalAcous += audioFeats[i].acousticness
                totalInstru += audioFeats[i].instrumentalness
                totalLive += audioFeats[i].liveness
                totalTemp += audioFeats[i].tempo
                totalLoud += audioFeats[i].loudness
                totalEneg += audioFeats[i].energy
                totalDance += audioFeats[i].danceability
            }
        }
        setAvgAcous(totalAcous / audioFeats.length)
        setAvgInstru(totalInstru / audioFeats.length)
        setAvgLive(totalLive / audioFeats.length)
        setAvgTemp(totalTemp/ audioFeats.length)
        setAvgLoud(totalLoud / audioFeats.length)
        setAvgEneg(totalEneg / audioFeats.length)
        setAvgDance(totalDance / audioFeats.length)
    }, [audioFeats])

    useEffect(() => {
        setData([
            {
              subject: "Acousticness",
              A: avgAcous,
              fullMark: 1,
            
            },
            {
                subject: "Energy",
                A: avgEneg,
                fullMark: 1
            },
            {
              subject: "Instrument",
              A: avgInstru,
              fullMark: 1
            },
            {
                subject: "Liveness",
                A: avgLive,
                fullMark: 1
            },
            {
                subject: "Danceability",
                A: avgDance,
                fullMark: 1
            },
          ])
    }, [avgLoud])


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
        stroke="black"
        fill="light blue"
        fillOpacity={0.6}
      />
    </RadarChart>
  );
}