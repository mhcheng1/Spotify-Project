import React from "react";
import { Treemap } from "recharts";
import {useState, useEffect} from 'react'
import "./styles.css";

export default function GenreTreeMap ( {table} ) {
    const [treeMap, setTreeMap] = useState([])
    const [data, setData] = useState([])
    var newGenre = []
    var seenGenre = []
    


    useEffect(() => {
        if (table.length > 0) {
            for (var i = 0; i < table.length; i++) {
                if (seenGenre.indexOf(table[i].genre) > -1) {
                    for (var j = 0; j < newGenre.length; j++) {
                        if ( newGenre[j].name === table[i].genre) {
                            newGenre[j].size += 30
                            break
                        }
                    }      
                }    
                else if (table[i].genre != "None") {
                    seenGenre.push(table[i].genre)
                    newGenre.push({name: table[i].genre, size: 100})
                }    
            }
        }
        setTreeMap(newGenre)

        if (treeMap.length > 0) {
            setData(
                [{
                    name: "genres",
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
        name: "genres",
        children: treeMap
        }]}
      dataKey="size"
      ratio={4 / 3}
      stroke="#fff"
      fill="#8884d8"
    />
  );
}