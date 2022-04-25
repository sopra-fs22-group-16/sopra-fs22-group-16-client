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

    const [gameMode, setGameMode] = useState("");
    const [gameType, setGameType] = useState("");

    const [gameMap, setGameMap] = useState();
    const [unitArray, setUnitArray] = useState();

    const [selectedUnit, setSelectedUnit] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);

    const onClickTile = (tile) => {
        if (selectedUnit === null && tile.unit !== null /* TODO: && it is one of my units */) {
            // If no unit is selected and a unit is on the clicked tile
            // select this unit
            selectUnit(tile.unit);
            console.log("Selected a unit")
        } else if (selectedUnit !== null && tile.unit !== null && selectedUnit !== tile.unit /* TODO: && it is one of my units */) {
            // A unit is selected and we clicked on a tile with a unit on it and it is one of my units
            // Select this unit instead
            clearMapSelection(selectedUnit);
            selectUnit(tile.unit);
            console.log("Unit selected and clicking a different friendly unit")
        } else if (selectedUnit !== null && tile.unit !== null && selectedUnit !== tile.unit /* TODO: && it is NOT one of my units */ && selectedUnit.attackableTiles.includes(tile)) {
            // If it is a hostile unit do other stuff
            // TODO: further command processing
            console.log("Unit selected and clicking hostile unit in attack range")
        } else if (selectedUnit !== null && (tile.unit === null || selectedUnit === tile.unit) && selectedUnit.movableTiles.includes(tile)) {
            //  A unit is selected and we clicked on a tile with a NO unit on it and the tile is in movement range
            // TODO: further command processing
            console.log("Unit selected and clicking on a tile an empty or the selected units tile in movement range")
        } else if (selectedUnit !== null && tile.unit === null) {
            // We clicked on a tile outside the movement range of the selected unit and not on a hostile unit in attack range
            // Deselect the selected unit
            clearMapSelection(selectedUnit);
            console.log("Unit selected and clicking on empty tile")
        }
    }

    const clearMapSelection = (unit) => {
        unit.showRangeIndicator(false);
        unit.showPathIndicator(false);
        setSelectedUnit(null);
    }

    const selectUnit = (unit) => {
        // Set the clicked unit as the selected unit
        setSelectedUnit(unit);
        // Set that the unit is selected
        unit.selected = true;
        // Calculate the movement and attack range
        unit.calculateTilesInRange(gameMap)
        // Show the attack and movement range
        unit.showRangeIndicator(true);
    }

    const onTileEnter = (tile) => {
        if (selectedUnit != null) {
            // Check if the tile is a movable tile of the selected unit
            if (selectedUnit.movableTiles.includes(tile)) {
                selectedUnit.showPathIndicator(false);
                selectedUnit.calculatePathToTile(tile.y, tile.x, gameMap);
                selectedUnit.showPathIndicator(true);

                // Auto update does not work?
                setGameMap([...gameMap]);
            }
        }
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
                let unitArray = [];

                mapData.forEach((row, y) => {
                    mapArray.push([]);

                      row.forEach((tile, x) => {
                        let unit = null;
                        if (mapData[y][x].unit) {
                            unit = new UnitModel(x, y, mapData[y][x].unit);
                            unitArray.push(unit);
                            delete mapData[y][x].unit;
                        }
                        mapArray[y].push(new TileModel(x, y, unit, mapData[y][x]));
                      });
                });

                setUnitArray(unitArray);
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
                <Map mapData={gameMap}
                     onClickTile={onClickTile}
                     onMouseEnterTile={onTileEnter}
                />
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
