import React from 'react'
import {useState, useEffect} from 'react'
import UserFormGraph from './UserFormGraph'


export default function UserForm( {audioFeats, userForm}) {
    // divide tracks into three sections for each audio feats
    // then select the ones that are within range
    const [finalTracks, setFinalTracks] = useState([])
    const [finalTracks1, setFinalTracks1] = useState([])
    const [finalTracks2, setFinalTracks2] = useState([])


    const [tempoArr, setTempoArr] = useState([])
    const [tempo1, setTempo1] = useState(0)
    const [tempo2, setTempo2] = useState(0)
    const [tempo3, setTempo3] = useState(0)

    const [dance1, setDance1] = useState(0)
    const [dance2, setDance2] = useState(0)
    const [dance3, setDance3] = useState(0)

    const [loud1, setLoud1] = useState(0)
    const [loud2, setLoud2] = useState(0)
    const [loud3, setLoud3] = useState(0)

    const [track, setTrack] = useState([])
    const [tempo, setTempo] = useState(0)
    const [dance, setDance] = useState(0)
    const [loud, setLoud] = useState(0)

    useEffect(() => {

    }, [audioFeats])
    
    useEffect(() => {
        var tArr = []

        for (var i = 0; i < audioFeats.length; i++) {
            tArr.push(audioFeats[i].tempo)
        }
        tArr = tArr.sort(function(a,b){
            return a-b;
        });
        
        setTempoArr(tArr)
        const tempoIndex = Math.round(tArr.length / 3) - 1

        var tempo1Area = []
        var tempo2Area = []
        var tempo3Area = []
        for (var j = 0; j < audioFeats.length; j++) {
            if (audioFeats[j].tempo < tArr[tempoIndex]) {
                tempo1Area.push(audioFeats[j])
            }
            else if (audioFeats[j].tempo < tArr[tempoIndex * 2]) {
                tempo2Area.push(audioFeats[j])
            }
            else {
                tempo3Area.push(audioFeats[j])
            }
        }
        setTempo1(tempo1Area)
        setTempo2(tempo2Area)
        setTempo3(tempo3Area)
    }, [userForm])
   
    useEffect(() => {
        if (userForm.tempo !== 0 && userForm.danceability !== 0 && userForm.loudness !== 0) {
            if (userForm.tempo === "1") {
                setFinalTracks1(tempo1)
            }
            else if (userForm.tempo === "2") {
                setFinalTracks1(tempo2)
            }
            else {
                setFinalTracks1(tempo3)
            }
        }
    }, [tempo1, tempo2, tempo3])


    useEffect(() => {
            var dArr = []
            for (var i = 0; i < finalTracks1.length; i++) {
                dArr.push(finalTracks1[i].danceability)
            }
            dArr = dArr.sort(function(a,b){
                return a-b;
            });
            const danceIndex = Math.round(dArr.length / 3) - 1

            var dance1Area = []
            var dance2Area = []
            var dance3Area = []
            for (var j = 0; j < finalTracks1.length; j++) {
                if (finalTracks1[j].danceability < dArr[danceIndex]) {
                    dance1Area.push(finalTracks1[j])
                }
                else if (finalTracks1[j].danceability < dArr[danceIndex * 2]) {
                    dance2Area.push(finalTracks1[j])
                }
                else {
                    dance3Area.push(finalTracks1[j])
                }
            }
            setDance1(dance1Area)
            setDance2(dance2Area)
            setDance3(dance3Area)
    }, [finalTracks1])

    useEffect(() => {
        if (userForm.danceability === "1") {
            setFinalTracks2(dance1)
        }
        else if (userForm.danceability === "2") {
            setFinalTracks2(dance2)
        }
        else {
            setFinalTracks2(dance3)
        }
    }, [dance1, dance2, dance3])


    useEffect(() => {
        if (finalTracks2.length > 2) {
            var lArr = []
            for (var i = 0; i < finalTracks2.length; i++) {
                lArr.push(finalTracks2[i].loudness)
            }
            lArr = lArr.sort(function(a,b){
                return a-b;
            });
            const loudIndex = Math.round(lArr.length / 3)

            var loud1Area = []
            var loud2Area = []
            var loud3Area = []
            for (var k = 0; k < finalTracks2.length; k++) {
                if (finalTracks2[k].loudness < lArr[loudIndex]) {
                    loud1Area.push(finalTracks2[k])
                }
                else if (lArr[loudIndex * 2] && finalTracks2[k].loudness < lArr[loudIndex * 2]) {
                    loud2Area.push(finalTracks2[k])
                }
                else {
                    loud3Area.push(finalTracks2[k])
                }
            }
            setLoud1(loud1Area)
            setLoud2(loud2Area)
            setLoud3(loud3Area)
        }
    }, [finalTracks2])
    
    useEffect(() => {
        if (userForm.loudness === "1") {
            setFinalTracks(loud1)
        }
        else if (userForm.loudness === "2") {
            setFinalTracks(loud2)
        }
        else{
            setFinalTracks(loud3)
        }
    }, [loud1, loud2, loud3])

    useEffect(() => {
        if (finalTracks && finalTracks.length > 0) {
            const index = Math.floor(Math.random() * finalTracks.length)
            setTrack(finalTracks[index])
        }
    }, [finalTracks])

    useEffect(() => {
        if (track.tempo) {
            setTempo(Math.round(track.tempo))
            setDance(Math.round(track.danceability * 10))
            setLoud(track.loudness)
        }
    }, [track])

    return (
        <div className="d-flex flex-column center mt-3">
            <div className="d-flex mr-3">
                <h5 className="ml-1"><font color="white">Tempo <h6 className="text-muted">{tempo} bpm</h6></font></h5>
                <h5 className="ml-1"><font color="white">Dance <h6 className="text-muted">{dance} / 10</h6></font></h5>
                <h5 className="ml-1"><font color="white">Loudness <h6 className="text-muted">{loud} db</h6></font></h5>
            </div>
            <UserFormGraph track={track}  />
        </div>
    )
}
