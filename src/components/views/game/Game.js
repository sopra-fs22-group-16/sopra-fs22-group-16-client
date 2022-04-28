import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import Map from "components/fragments/game/Map";
import {ThemeProvider} from "@emotion/react";
import {defaultTheme} from "styles/themes/defaulTheme";
import {alertTitleClasses, LinearProgress} from "@mui/material";
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
import { alignProperty } from "@mui/material/styles/cssUtils";
import { ArrowPartType } from "components/fragments/game/tile/types/ArrowPartType";

const Game = ({id}) => {

    const history = useHistory();

    const token = localStorage.getItem("token");
    const myTeam = 0;
    //const myTeam = localStorage.getItem("team");

    const [gameData, setGameData] = useState({gameMode: '', gameType: '', map: ([[]]), units: []});

    const [selectedUnit, setSelectedUnit] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {

                let response;

                //response = await api.get(`/v1/game/match/${id}`, { headers: { 'token': token || '' } });
                //let mapData = response.data.gameMap.tiles;
                //let unitData = response.data.units;

                response = jsonTileMockData;

                let mapData = response.map;
                let unitData = response.units;


                let mapArray = [];
                let unitArray = [];

                mapData.forEach((row, y) => {
                    mapArray.push([]);
                    row.forEach((tile, x) => {
                        //tile.type = tile.type.toLowerCase();
                        //tile.variant = tile.variant.toLowerCase();
                        mapArray[y].push(new TileModel(y, x, mapData[y][x]));
                    });
                });

                
                unitData.forEach((unit) => {
                    let y = unit.position.y;
                    let x = unit.position.x;

                    delete unit.position;
                    //unit.type = unit.type.toLowerCase();
                    let unitModel = new UnitModel(y, x, unit);
                    mapArray[y][x].unit = unitModel;
                    unitArray.push(unitModel);
                });

            
                setGameData({
                    gameType: response.gameType,
                    gameMode: response.gameMode,
                    //gameType: response.data.gameType,
                    //gameMode: response.data.gameMode,
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
        }else if(selectedUnit && (!tile.traversableTiles?.includes(tile) && !tile.tilesInAttackRange?.includes(tile))){
            // Deselect unit
            selectedUnit.showPathIndicator(false);
            setGameData({...gameData});
        }
    }

    const onClickUnit = async(unit) => {
        if(selectedUnit === null || (unit.teamId === myTeam)/* TODO: instead check that unit is mine*/){
            if(selectedUnit){
                selectedUnit.showRangeIndicator(false);
                if(selectedUnit.path){
                    selectedUnit.showPathIndicator(false);
                    setGameData({...gameData});
                    
                }
            }
            alert("selected own unit");
            selectUnit(unit);
        }else if(unit.teamId != myTeam && selectedUnit != null){
            selectedUnit.showPathIndicator(false);
            //alert("position of own unit is" + selectedUnit.x+ selectedUnit.y);
            //alert("position of other unit is" + unit.x+ unit.y);
            const opponentTile = gameData.map[unit.y][unit.x];
            selectedUnit.calculatePathToTile(unit.y, unit.x, gameData.map);
            //for some reason the path is null........
            //alert(selectedUnit.path.length);
            selectedUnit.showPathIndicator(true);
            alert("path selected");
            setGameData({...gameData});
            //attacks the foreign unit from the previously selected unit selectedUnit
            //const opponentTile = gameData.map[unit.y][unit.x];
            if(selectedUnit.tilesInAttackRange.includes(opponentTile)) {            
                const requestBody = {
                    "attacker": [selectedUnit.x, selectedUnit.y],
                    "defender": [unit.x, unit.y]
                };
    
                //await api.post(`/v1/game/match/${id}/command/attack`, JSON.stringify(requestBody), { headers: { 'token': token || '' } });
                //setGameData({...gameData});

        }
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
