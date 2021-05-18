import React from "react";
import { Treemap } from "recharts";
import {useState, useEffect} from 'react'
import "./styles.css";

export default function ArtistTreeMap ( {table} ) {
    const [treeMap, setTreeMap] = useState([])
    const [data, setData] = useState([])
    var newartist = []
    var seenartist = []
    

    const data1 = [
        {
          name: "artists",
          children: [
            { name: "Axes", size: 10000 },
            { name: "Axis", size: 24593 },
            { name: "AxisGridLine", size: 652 },
            { name: "AxisLabel", size: 636 },
            { name: "CartesianAxes", size: 6703 }
          ]
        }
            
      ];


    useEffect(() => {
      console.log(treeMap)
        if (table.length > 0) {
            for (var i = 0; i < table.length; i++) {
                if (seenartist.indexOf(table[i].artist) > -1) {
                    for (var j = 0; j < newartist.length; j++) {
                        if ( newartist[j].name === table[i].artist) {
                            newartist[j].size += 30
                            break
                        }
                    }      
                }    
                else if (table[i].artist != "None") {
                    seenartist.push(table[i].artist)
                    newartist.push({name: table[i].artist, size: 100})
                }    
            }
        }
        setTreeMap(newartist)

        if (treeMap.length > 0) {
            setData(
                [{
                    name: "artists",
                    children: treeMap
                }]
            )
        }

    }, [table])

  return (
    <Treemap 
      width={600}
      height={400}
      data={[{
        name: "artists",
        children: treeMap
    }]}
      dataKey="size"
      ratio={4 / 3}
      stroke="#fff"
      fill="#8884d8"
    />
  );
}