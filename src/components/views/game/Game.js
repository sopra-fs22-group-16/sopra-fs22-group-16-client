import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import Map from "../../fragments/game/Map";
import {ThemeProvider} from "@emotion/react";
import {defaultTheme} from "../../../styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import CustomPopUp from "../../ui/CustomPopUp";
import {Button} from "../../ui/Button";
import surrenderFlag from "styles/images/surrenderFlag.png"
import TileModel from "../../../models/TileModel";
import {useHistory} from "react-router-dom";

import "styles/views/game/Game.scss"

// MockData
import jsonTileMockData from "./jsonTileMockData";

const Game = ({id}) => {

    const history = useHistory();

    const [gameMode, setGameMode] = useState("");
    const [gameType, setGameType] = useState("");
    const [gameMap, setGameMap] = useState();

    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);

    const exampleUpdateTileInGameMap = (tile) => {
        tile.type = "river";
        tile.variant = "flat";
        // move content to new array and set it as game Map
        setGameMap([...gameMap]);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Set Mock map data
                const response = jsonTileMockData;

                setGameMode(response.gameMode);
                setGameType(response.gameType);

                let mapData = response.map;
                let mapArray = [];

                mapData.forEach((row, y) => {
                    mapArray.push([]);
                    row.forEach((tile, x) => {
                        mapArray[y].push(new TileModel(x, y, mapData[y][x]));
                    });
                });

                setGameMap(mapArray);

            } catch (error) {
                setGetDataFailed(true);
            }
        }

        fetchData();
    }, []);

    let content;
    if (gameMap) {
        content = (
            <div className={"mapContainer"}>
                <Map mapData={gameMap} onClick={exampleUpdateTileInGameMap}/>
            </div>);
    } else {
        content = (
            <div className={"loadingContainer"}>
                <ThemeProvider theme={defaultTheme}>
                    <LinearProgress color="secondary"/>
                </ThemeProvider>
            </div>);
    }

    return (
        <div id={"gameContainer"}>
            {/* Disable zooming, as it leads to white lines between tiles */}
            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>

            {content}

            <div className={"surrenderFlagContainer"}>
                <img className={"pixelated"} src={surrenderFlag}
                     alt={"A white flag - press to surrender"}/>
            </div>

            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={getDataFailed} information={"Could not get game data - Please try again later!"}>
                    <Button onClick={() =>
                        history.push('/home')
                    }>
                        Return Home
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                    <Button onClick={() =>
                        setErrorMessage("")
                    }>
                        Close
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </div>
    );
}

export default Game;
