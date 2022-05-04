import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import Map from "components/fragments/game/Map";
import {ThemeProvider} from "@emotion/react";
import {defaultTheme} from "styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import CustomPopUp from "components/ui/CustomPopUp";
import {Button} from "components/ui/Button";
import surrenderFlag from "styles/images/surrenderFlag.png"
import TileModel from "models/TileModel";
import {useHistory} from "react-router-dom";
import UnitModel from "../../../models/UnitModel";
import {api} from "../../../helpers/api";

import "styles/views/game/Game.scss"

// MockData
import jsonTileMockData from "./jsonTileMockData";
import DropDown from "../../ui/DropDown";

function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const Game = ({id}) => {

    const history = useHistory();

    const token = localStorage.getItem("token");
    //TODO: replace with storage
    //const myTeam = localStorage.getItem("team");
    const myTeam = 0;

    const [gameData, setGameData] = useState({gameMode: '', gameType: '', map: [[]], units: []});

    const [dropDown, setDropDown] = useState({open: false, showAttack: false, y: 0, x: 0, target: null});

    const [selectedUnit, setSelectedUnit] = useState(null);

    const [lock, setLock] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {

                let response;

                response = await api.get(`/v1/game/match/${id}`, { headers: { 'token': token || '' } });

                let mapData = response.data.gameMap.tiles;
                let unitData = response.data.units;

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
                    gameType: response.data.gameType,
                    gameMode: response.data.gameMode,
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
        if (!lock) {
            if (selectedUnit && selectedUnit.traversableTiles.includes(tile)) {
                // Show path to traversable tile
                selectedUnit.showPathIndicator(false);
                setDropDown({...dropDown, open: false})

                selectedUnit.calculatePathToTile(tile.y, tile.x, gameData.map);
                selectedUnit.showPathIndicator(true);
                setGameData({...gameData});
                if (selectedUnit.tilesInAttackRangeSpecificTile[tile.y] && selectedUnit.tilesInAttackRangeSpecificTile[tile.y][tile.x]) {
                    setDropDown({open: true, showAttack: true, y: tile.y * 48, x: (tile.x + 1) * 48, target: tile})
                } else {
                    // Show small drop down as no unit is in range
                    setDropDown({open: true, showAttack: false, y: tile.y * 48, x: (tile.x + 1) * 48, target: tile})
                }

            } else if (selectedUnit && (!tile.traversableTiles?.includes(tile) && !tile.tilesInAttackRange?.includes(tile))) {
                // Deselect unit
                selectedUnit.showRangeIndicator(false);
                selectedUnit.showPathIndicator(false);
                setSelectedUnit(null);
                setDropDown({...dropDown, open: false})
                setGameData({...gameData});
            }
        }
    }

    const onClickAttack = async (tile) => {

        // if clicking directly on the unit, move up the path
        if (tile.unit) {

            //lock other actions while attacking
            setLock(true);

            gameData.map[selectedUnit.y][selectedUnit.x].unit = null;

            selectedUnit.showPathIndicator(false);
            selectedUnit.showRangeIndicator(false);
            setDropDown({...dropDown, open: false});

            for (const tile of selectedUnit.path.reverse()) {
                selectedUnit.move(tile.x, tile.y);
                setGameData({...gameData});
                await timer(250);
            }

            // TODO: complete attack

            gameData.map[selectedUnit.y][selectedUnit.x].unit = selectedUnit;

            gameData.units.forEach((unit) => {
                unit.selected = false;
                unit.tilesInAttackRange = null;
                unit.tilesInAttackRangeSpecificTile = null;
                unit.traversableTiles = null;
                unit.path = null;
                unit.pathGoal = null;
            })

            setSelectedUnit(null);

            //unlock
            setLock(false);

        } else {
            selectedUnit.showRangeIndicator(false);
            selectedUnit.traversableTiles = null;
            selectedUnit.tilesInAttackRange = selectedUnit.tilesInAttackRangeSpecificTile[tile.y][tile.x];
            selectedUnit.showRangeIndicator(true);
            setDropDown({...dropDown, open: false});
            setGameData({...gameData});

        }
    }

    const onClickWait = async (tile) => {

        // pressing wait on the tile with unit is the same as attack
        if (!tile.unit) {

            //lock other actions while moving
            setLock(true);

            //delete unit from map array
            gameData.map[selectedUnit.y][selectedUnit.x].unit = null;

            //remove current reachable tiles and arrow path indicator
            selectedUnit.showRangeIndicator(false);
            selectedUnit.showPathIndicator(false);

            //we remove the traversable tiles, so in the next movement these are recalculated (calculateTilesInRange)
            selectedUnit.traversableTiles = null;
            selectedUnit.tilesInAttackRange = null;

            setDropDown({...dropDown, open: false});

            //update position
            for (const tilePath of selectedUnit.path.reverse()) {
                selectedUnit.move(tilePath.x, tilePath.y);
                setGameData({...gameData});
                await timer(250);
            }

            //insert new unit and unselect unit
            gameData.map[selectedUnit.y][selectedUnit.x].unit = selectedUnit;
            setSelectedUnit(null);

            //unlock
            setLock(false);
        }
    }

    const onClickCancel = (tile) => {
        selectedUnit.showRangeIndicator(false);
        selectedUnit.showPathIndicator(false);
        setSelectedUnit(null);
        setGameData({...gameData});
        setDropDown({...dropDown, open: false})
    }


    const onClickUnit = (unit) => {
        if (!lock) {
            if (unit.teamId === myTeam) {
                if (selectedUnit) {
                    selectedUnit.showRangeIndicator(false);
                    if (selectedUnit.path) {
                        selectedUnit.showPathIndicator(false);
                        setGameData({...gameData});
                    }
                }
                selectUnit(unit);

            } else if (selectedUnit && unit.teamId !== myTeam) {

                const tile = gameData.map[unit.y][unit.x];

                if (selectedUnit.tilesInAttackRange.includes(tile)) {
                    selectedUnit.showPathIndicator(false)
                    
                    if (selectedUnit.traversableTiles !== null) {
                        selectedUnit.calculatePathToUnit(unit.y, unit.x, gameData.map);
                        selectedUnit.calculatePathtoAttackUnit(unit.y, unit.x, gameData.map);
                    }

                    setDropDown({open: true, showAttack: true, y: tile.y * 48, x: (tile.x + 1) * 48, target: tile})
                    selectedUnit.showPathIndicator(true);
                    setGameData({...gameData});

                }
            }
        }

    }

    const selectUnit = (unit) => {
        // Set the clicked unit as the selected unit
        setSelectedUnit(unit);
        // Set that the unit is selected
        unit.selected = true;
        // Calculate the movement and attack range
        unit.calculateTilesInRange(gameData.map);
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
                    >
                        <DropDown
                            open={dropDown.open}
                            showAttack={dropDown.showAttack}
                            y={dropDown.y}
                            x={dropDown.x}
                            onClickWait={onClickWait}
                            onClickCancel={onClickCancel}
                            onClickAttack={onClickAttack}
                            target={dropDown.target}
                        />
                    </Map>

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