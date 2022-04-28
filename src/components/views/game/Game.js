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
import SmallDropDown from "../../ui/SmallDropDown";

const Game = ({id}) => {

    const history = useHistory();

    const token = localStorage.getItem("token");

    const [gameData, setGameData] = useState({gameMode: '', gameType: '', map: [[]], units: []});

    const [smallDropDown, setSmallDropDown] = useState({open: false, y: 0, x: 0, target: null});

    const [selectedUnit, setSelectedUnit] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {

                let response;

                //response = api.get(`/v1/game/match/${id}`, { headers: { 'token': token || '' } });

                // Set Mock map data
                response = jsonTileMockData;

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
        if(selectedUnit && selectedUnit.traversableTiles.includes(tile)){
            // Show path to traversable tile
            selectedUnit.showPathIndicator(false);
            selectedUnit.calculatePathToTile(tile.y, tile.x, gameData.map);
            selectedUnit.showPathIndicator(true);
            setGameData({...gameData});
            setSmallDropDown({open: true, y: tile.y * 48, x: (tile.x+1) * 48, target: tile})
        }else if(selectedUnit && (!tile.traversableTiles?.includes(tile) && !tile.tilesInAttackRange?.includes(tile))){
            // Deselect unit
            selectedUnit.showRangeIndicator(false);
            selectedUnit.showPathIndicator(false);
            setSelectedUnit(null);
            setSmallDropDown({...smallDropDown, open: false})
            setGameData({...gameData});
        }
    }

    const onClickWait = (tile) => {
        console.log("move to " + tile.y + " , " + tile.x);
    }

    const onClickCancel = (tile) => {
        selectedUnit.showPathIndicator(false);
        setGameData({...gameData});
        setSmallDropDown({...smallDropDown, open: false})
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
                        >
                            <SmallDropDown open={smallDropDown.open} y={smallDropDown.y} x={smallDropDown.x} onClickWait={onClickWait} onClickCancel={onClickCancel} target={smallDropDown.target} />
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
