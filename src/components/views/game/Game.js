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
import UnitModel from "../../../models/UnitModel";

import "styles/views/game/Game.scss"

// MockData
import jsonTileMockData from "./jsonTileMockData";

const Game = ({id}) => {

    const history = useHistory();

    const [gameData, setGameData] = useState({gameMode: '', gameType: '', map: [[]], units: []});

    const [selectedUnit, setSelectedUnit] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {
                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Set Mock map data
                const response = jsonTileMockData;

                let mapData = response.map;
                let unitData = response.units;

                let mapArray = [];
                let unitArray = [];

                mapData.forEach((row, y) => {
                    mapArray.push([]);
                    row.forEach((tile, x) => {
                        mapArray[y].push(new TileModel(y, x, mapData[y][x]));
                    });
                });

                unitData.forEach((unit) => {
                    let y = unit.position.y;
                    let x = unit.position.x;

                    delete unit.position;
                    let unitModel = new UnitModel(y, x, unit);
                    mapArray[y][x].unit = unitModel;
                    unitArray.push(unitModel);
                });

                setGameData({
                    ...gameData,
                    gameType: response.gameType,
                    gameMode: response.gameMode,
                    map: mapArray,
                    units: unitArray
                });

            } catch (error) {
                console.log(error);
                setGetDataFailed(true);
            }
        }

        fetchData();
    }, []);


    const onMouseEnterTile = (tile) => {

    }

    const onClickTile = (tile) => {
        if(selectedUnit && selectedUnit.movableTiles.includes(tile)){
            // Show path to movable tile
            selectedUnit.showPathIndicator(false);
            selectedUnit.calculatePathToTile(tile.y, tile.x, gameData.map);
            selectedUnit.showPathIndicator(true);
            setGameData({...gameData});
        }else if(selectedUnit && (!tile.movableTiles?.includes(tile) && !tile.attackableTiles?.includes(tile))){
            // Deselect unit
            selectedUnit.showPathIndicator(false);
            setGameData({...gameData});
        }
    }

    const onClickUnit = (unit) => {
        if(selectedUnit === null || (unit.teamId === 0)/* TODO: instead check that unit is mine*/){
            if(selectedUnit){
                selectedUnit.showRangeIndicator(false);
                if(selectedUnit.path){
                    selectedUnit.showPathIndicator(false);
                    setGameData({...gameData});
                }
            }
            selectUnit(unit);
            console.log(unit.attackableTilesFromATile);
        }else if(selectedUnit /* && unit is hostile */){
            // TODO: Attack command
        }
    }

    const selectUnit = (unit) => {
        // Set the clicked unit as the selected unit
        setSelectedUnit(unit);
        // Set that the unit is selected
        unit.selected = true;
        // Calculate the movement and attack range
        unit.calculateTilesInRange(gameData.map)
        // Show the attack and movement range
        unit.showRangeIndicator(true);
    }

    return (
        <div id={"gameContainer"}>
            {/* Disable zooming, as it leads to white lines between tiles */}
            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>

            {
                (gameData.map === [[]]) ?
                    <div className={"loadingContainer"}>
                        <ThemeProvider theme={defaultTheme}>
                            <LinearProgress color="secondary"/>
                        </ThemeProvider>
                    </div>
                    :

                        <Map mapData={gameData.map}
                             unitData={gameData.units}
                             onClickTile={onClickTile}
                             onClickUnit={onClickUnit}
                             onMouseEnterTile={onMouseEnterTile}
                        />

            }

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
