import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import Map from "./Map";

import surrenderFlag from "styles/images/surrenderFlag.png"

import "styles/views/game/Game.scss"

// MockData
import jsonTileMockData from "./jsonTileMockData";

const Game = ({ id }) => {

    const [gameMode, setGameMode] = useState("");
    const [gameType, setGameType] = useState("");
    const [mapData, setMapData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Set Mock map data
                setGameMode(jsonTileMockData.gameMode);
                setGameType(jsonTileMockData.gameType);
                setMapData(jsonTileMockData.map);

            } catch (error) {

            }
        }

        fetchData().then(() => {
        });
    }, []);

    return (
        <div id={"gameContainer"}>
            {/* Disable zooming, as it leads to white lines between tiles */}
            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>

            <div className={"mapContainer"}>
                <Map mapData={mapData}/>
            </div>

            <div className={"surrenderFlagContainer"}>
                <img className={"pixelated"} src={surrenderFlag}
                     alt={"A white flag - press to surrender"}/>
            </div>

        </div>
    );
}

export default Game;
