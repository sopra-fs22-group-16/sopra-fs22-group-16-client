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
import {useHistory, useLocation} from "react-router-dom";
import UnitModel from "../../../models/UnitModel";
import {api} from "../../../helpers/api";
import {Direction} from "../../fragments/game/unit/Direction";
import Socket from "../../socket/Socket";
import DropDown from "../../ui/DropDown";
import DamageIndicator from "../../ui/DamageIndicator";
import HoldToConfirmPopUp from "../../ui/HoldToConfirmPopUp";
import {UnitTypes} from "../../fragments/game/unit/data/UnitTypes";
import TurnData from "../../../models/TurnData";

import "styles/views/game/Game.scss"


function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const Game = ({id}) => {

    const history = useHistory();
    const location = useLocation();

    const token = localStorage.getItem("token");

    const playerId = parseInt(localStorage.getItem("playerId"));
    const teamId = playerId; // TODO: Get Team Id
    let playerIdCurrentTurn = localStorage.getItem("playerIdCurrentTurn");

    const [gameData, setGameData] = useState({gameMode: '', gameType: '', turn: 0, players: {}, map: [[]], units: []});
    const [dropDown, setDropDown] = useState({open: false, showAttack: false, y: 0, x: 0, target: null});
    const [damageIndicator, setDamageIndicator] = useState({
        open: false,
        y: 0,
        x: 0,
        leftDamage: 0,
        rightDamage: 0,
        leftRed: true
    });


    const [selectedUnit, setSelectedUnit] = useState(null);

    const [lock, setLock] = useState(false);

    const [showTurnPopUp, setShowTurnPopUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);

    const [surrender, setSurrender] = useState(false);
    const [endGame, setEndGame] = useState(false);
    //TODO: set the values with the information received from the server (socket)
    const [gameResult, setGameResult] = useState(null);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        obtainAndLoadGameData();
    }, []);

    const obtainAndLoadGameData = async () => {
        try {

            const response = await api.get(`/v1/game/match/${id}`, {headers: {'token': token || ''}});

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

            // TODO: When api response is updated on the server
            //  set the turn, playerIdTurn, and players array based on the response

            setPlayerIdCurrentTurn(0);

            setGameData({
                gameType: response.data.gameType,
                gameMode: response.data.gameMode,
                turn: 0,
                players: {
                    "0": {
                        name: "player-0",
                        teamId: 0,
                    },
                    "1": {
                        name: "player-1",
                        teamId: 1,
                    }
                },
                map: mapArray,
                units: unitArray
            });

            setShowTurnPopUp(true);

            console.log(unitArray)
            console.log(token)

        } catch (error) {
            console.log(error);
            setGetDataFailed(true);
        }
    }


    const onClickTile = (tile) => {
        if (!lock) {
            if (selectedUnit && selectedUnit.traversableTiles && selectedUnit.traversableTiles.includes(tile)) {
                // Show path to traversable tile
                selectedUnit.showPathIndicator(false);
                setDropDown({...dropDown, open: false})
                setDamageIndicator({...damageIndicator, open: false});

                selectedUnit.calculatePathToTile(tile.y, tile.x, gameData.map);
                selectedUnit.calculateIdleDirection();
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
                setDamageIndicator({...damageIndicator, open: false});
                setGameData({...gameData});
            }
        }
    }

    const onClickAttack = async (tile) => {

        // if clicking directly on the unit, move up the path
        if (tile.unit) {

            //lock other actions while attacking
            setLock(true);

            // Set that the unit is selected
            selectedUnit.performedAction = true;

            let unit = tile.unit;

            gameData.map[selectedUnit.y][selectedUnit.x].unit = null;

            selectedUnit.showPathIndicator(false);
            selectedUnit.showRangeIndicator(false);
            setDropDown({...dropDown, open: false});
            setDamageIndicator({...damageIndicator, open: false});

            await executePathMovement();

            gameData.map[selectedUnit.y][selectedUnit.x].unit = selectedUnit;

            cleanUpUnits();

            // Do attack
            let outGoingDamage = selectedUnit.calculateOutgoingAttackDamage(unit, gameData.map);
            let inGoingDamage = unit.calculateOutgoingAttackDamage(selectedUnit, gameData.map) / 3;

            // TODO: make call to backend
            // Also possible to do things below, after receiving update from backend.
            // That would also ensure that the information stays consistent.

            // TODO: Maybe there is a batter way than splicing the array, does some weired things, as redraw is called for all units etc.
            unit.health -= outGoingDamage;
            if (unit.health <= 0) {
                gameData.map[unit.y][unit.x].unit = null;
                gameData.units.splice(gameData.units.indexOf(unit), 1);
            }

            selectedUnit.health -= inGoingDamage;
            if (selectedUnit.health <= 0) {
                gameData.map[selectedUnit.y][selectedUnit.x].unit = null;
                gameData.units.splice(gameData.units.indexOf(selectedUnit), 1);
            }


            setSelectedUnit(null);

            //unlock
            setLock(false);

        } else {
            selectedUnit.showRangeIndicator(false);
            selectedUnit.traversableTiles = null;
            selectedUnit.tilesInAttackRange = selectedUnit.tilesInAttackRangeSpecificTile[tile.y][tile.x];
            selectedUnit.showRangeIndicator(true);
            setDropDown({...dropDown, open: false});
            setDamageIndicator({...damageIndicator, open: false});
            setGameData({...gameData});

        }
    }

    const onClickWait = async (tile) => {

        // pressing wait on the tile with unit is the same as attack
        if (!tile.unit) {

            //lock other actions while moving
            setLock(true);

            // Set that the unit is selected
            selectedUnit.performedAction = true;

            //delete unit from map array
            gameData.map[selectedUnit.y][selectedUnit.x].unit = null;

            //remove current reachable tiles and arrow path indicator
            selectedUnit.showRangeIndicator(false);
            selectedUnit.showPathIndicator(false);

            //we remove the traversable tiles, so in the next movement these are recalculated (calculateTilesInRange)
            selectedUnit.traversableTiles = null;
            selectedUnit.tilesInAttackRange = null;

            setDropDown({...dropDown, open: false});

            await executePathMovement();

            cleanUpUnits();

            //insert new unit and unselect unit
            gameData.map[selectedUnit.y][selectedUnit.x].unit = selectedUnit;
            setSelectedUnit(null);

            //unlock
            setLock(false);
        }
    }

    const cleanUpUnits = () => {
        // Clear all previously calculated data
        gameData.units.forEach((unit) => {
            unit.tilesInAttackRange = null;
            unit.tilesInAttackRangeSpecificTile = null;
            unit.traversableTiles = null;
            unit.path = null;
            unit.pathGoal = null;
        })
    }

    const executePathMovement = async () => {
        //set animation
        selectedUnit.animation = "run";

        //update position
        let startViewDirection = selectedUnit.viewDirection;
        let oldX = selectedUnit.x;
        let oldY = selectedUnit.y;
        let xCounter = 0;
        let yCounter = 0;
        let goingSouth = oldY <= selectedUnit.pathGoal[0];
        let goingEast = oldX === selectedUnit.pathGoal[1] ? selectedUnit.viewDirection.name.includes("east") : oldX < selectedUnit.pathGoal[1];
        for (const tilePath of selectedUnit.path.reverse()) {
            if (oldX !== tilePath.x) {
                if (yCounter !== 0) {
                    await performMovement(oldY, oldX, yCounter, true, goingSouth, goingEast);
                    yCounter = 0;
                }
                goingEast = oldX < tilePath.x;
                ++xCounter;
                oldX = tilePath.x;
            } else if (oldY !== tilePath.y) {
                if (xCounter !== 0) {
                    await performMovement(oldY, oldX, xCounter, false, goingSouth, goingEast);
                    xCounter = 0;
                }
                goingSouth = oldY < tilePath.y;
                ++yCounter;
                oldY = tilePath.y;
            }
        }

        // Check if there is left over movement
        if (xCounter !== 0) {
            await performMovement(oldY, oldX, xCounter, false, goingSouth, goingEast);
        } else if (yCounter !== 0) {
            await performMovement(oldY, oldX, yCounter, true, goingSouth, goingEast);
        }

        //reset animation
        selectedUnit.animation = "idle";
        if ((selectedUnit.type === UnitTypes.WAR_ELEPHANT) &&
            (selectedUnit.viewDirection === Direction.north || selectedUnit.viewDirection === Direction.south)) {
            selectedUnit.viewDirection = startViewDirection;
        }
    }

    const performMovement = async (y, x, steps, verticalMovement, goingSouth, goingEast) => {
        if (verticalMovement) {
            if (goingSouth) {
                if (selectedUnit.type === UnitTypes.WAR_ELEPHANT) {
                    selectedUnit.viewDirection = Direction.south;
                } else {
                    if (goingEast) {
                        selectedUnit.viewDirection = Direction.southEast;
                    } else {
                        selectedUnit.viewDirection = Direction.southWest;
                    }
                }
            } else {
                if (selectedUnit.type === UnitTypes.WAR_ELEPHANT) {
                    selectedUnit.viewDirection = Direction.north;
                } else {
                    if (goingEast) {
                        selectedUnit.viewDirection = Direction.northEast;
                    } else {
                        selectedUnit.viewDirection = Direction.northWest;
                    }
                }
            }
        } else {
            if (goingEast) {
                if (selectedUnit.type === UnitTypes.WAR_ELEPHANT) {
                    selectedUnit.viewDirection = Direction.east;
                } else {
                    if (goingSouth) {
                        selectedUnit.viewDirection = Direction.southEast;
                    } else {
                        selectedUnit.viewDirection = Direction.northEast;
                    }
                }
            } else {
                if (selectedUnit.type === UnitTypes.WAR_ELEPHANT) {
                    selectedUnit.viewDirection = Direction.west;
                } else {
                    if (goingSouth) {
                        selectedUnit.viewDirection = Direction.southWest;
                    } else {
                        selectedUnit.viewDirection = Direction.northWest;
                    }
                }
            }
        }
        selectedUnit.move(x, y);
        setGameData({...gameData});
        let time = (selectedUnit.movementSpeed * steps);
        await timer(time);
    }


    const onClickCancel = () => {
        selectedUnit.showRangeIndicator(false);
        selectedUnit.showPathIndicator(false);
        setSelectedUnit(null);
        setGameData({...gameData});
        setDropDown({...dropDown, open: false})
        setDamageIndicator({...damageIndicator, open: false});
    }


    const onClickUnit = (unit) => {
        //if(!lock && unit.performedAction === false){
        if (!lock) {
            if (unit.userId === playerId) {
                if (selectedUnit) {
                    selectedUnit.showRangeIndicator(false);
                    setDropDown({...dropDown, open: false})
                    setDamageIndicator({...damageIndicator, open: false});

                    if (selectedUnit.path) {
                        selectedUnit.showPathIndicator(false);
                        setGameData({...gameData});
                    }
                }
                selectUnit(unit);

            } else if (selectedUnit && unit.teamId !== teamId) {

                const tile = gameData.map[unit.y][unit.x];

                if (selectedUnit.tilesInAttackRange.includes(tile)) {
                    selectedUnit.showPathIndicator(false)

                    if (selectedUnit.traversableTiles !== null) {
                        selectedUnit.calculatePathToUnit(unit.y, unit.x, gameData.map);
                        selectedUnit.calculatePathtoAttackUnit(unit.y, unit.x, gameData.map);
                        selectedUnit.calculateIdleDirection();
                    }

                    let leftRed = teamId === 0 ? (selectedUnit.x > unit.x) : (selectedUnit.x <= unit.x);

                    let outGoingDamage = selectedUnit.calculateOutgoingAttackDamage(unit, gameData.map);
                    let inGoingDamage = unit.calculateOutgoingAttackDamage(selectedUnit, gameData.map) / 3;

                    let outGoingPercentage = Math.min(100 / unit.health * outGoingDamage, 100);
                    let inGoingPercentage = Math.min(100 / selectedUnit.health * inGoingDamage, 100);

                    let leftPercentage = inGoingPercentage;
                    let rightPercentage = outGoingPercentage;

                    if ((teamId === 0 && leftRed) || (teamId === 1 && !leftRed)) {
                        leftPercentage = outGoingPercentage;
                        rightPercentage = inGoingPercentage;
                    }

                    setDamageIndicator({
                        open: true,
                        y: (tile.y - 2) * 48,
                        x: tile.x * 48,
                        leftDamage: leftPercentage,
                        rightDamage: rightPercentage,
                        leftRed: leftRed
                    })
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
        // Calculate the movement and attack range
        unit.calculateTilesInRange(gameData.map);
        // Show the attack and movement range
        unit.showRangeIndicator(true);
    }

    const setPlayerIdCurrentTurn = (id) => {
        playerIdCurrentTurn = id;
        localStorage.setItem("playerIdCurrentTurn", id);
    }

    // refresh view when receiving a message from the socket
    const onMessage = (msg) => {
        Object.keys(msg).forEach((key) => {
            switch (key) {
                case 'turnInfo':
                    let data = new TurnData(msg[key]);
                    setShowTurnPopUp(true);
                    setPlayerIdCurrentTurn(data.playerId);
                    setGameData({
                        ...gameData,
                        turn: data.turn
                    })
                    break;
                default:
                    console.log(JSON.stringify(msg));
                    setErrorMessage("Unknown Message received from Server!")
            }
        });
    }

    const confirmSurrender = () => {
        //TODO: call server to inform that the player has surrender and get information from server callback
        setGameResult("DEFEAT");
        setWinner("player1");

        setEndGame(true);
    }

    const goStatistics = () => {
        //TODO: go to the statistics view
    }

    const playAgain = () => {
        //TODO: play another game
    }

    const goHome = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('playerId');
        history.push('/home');
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
                    >
                        <DamageIndicator open={damageIndicator.open}
                                         y={damageIndicator.y}
                                         x={damageIndicator.x}
                                         leftDamage={damageIndicator.leftDamage}
                                         rightDamage={damageIndicator.rightDamage}
                                         leftRed={damageIndicator.leftRed}
                        />
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

            <div
                className={"surrenderFlagContainer"}
                onClick={() => setSurrender(true)}>
                <img
                    className={"pixelated"}
                    src={surrenderFlag}
                    alt={"A white flag - press to surrender"}/>
            </div>
            <ThemeProvider theme={defaultTheme}>
                {
                    Object.keys(gameData.players).length !== 0 ?
                    <HoldToConfirmPopUp
                        open={showTurnPopUp}
                        onComplete={() => setShowTurnPopUp(false)}>
                        <div className={"turnIndicatorContainer"}>
                            <h1 className={"turnIndicatorContainer turn"}>Turn {gameData.turn}</h1>
                            <h2 style={{color: gameData.players[playerIdCurrentTurn].teamId === 0 ? '#873535' : '#516899'}} className={"turnIndicatorContainer player"}>{gameData.players[playerIdCurrentTurn].name}</h2>
                            <p className={"turnIndicatorContainer information"}>Hold to Start</p>
                        </div>
                    </HoldToConfirmPopUp>
                        : null
                }
                <CustomPopUp open={getDataFailed} information={"Could not get game data!"}>
                    <Button onClick={() =>
                        window.location.reload()
                    }>
                        Retry
                    </Button>
                    <Button onClick={() =>
                        goHome()
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
                <CustomPopUp open={surrender} information={"Do you really want to surrender?"}>
                    <Button
                        onClick={() =>
                            setSurrender(false)
                        }>
                        CONTINUE
                    </Button>
                    <Button
                        onClick={() =>
                            confirmSurrender()
                        }>
                        SURRENDER
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={endGame} information="">
                    <label className={"winnerWindow"}>{gameResult}</label>
                    <label>{winner} won the game</label>
                    <Button
                        onClick={() =>
                            goStatistics()
                        }>
                        STATISTICS
                    </Button>
                    <Button
                        onClick={() =>
                            playAgain()
                        }>
                        PLAY AGAIN
                    </Button>
                    <Button
                        className="return"
                        onClick={() =>
                            goHome()
                        }>
                        RETURN HOME
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
            <Socket
                topics={location.pathname}
                onMessage={onMessage}
            />
        </div>
    );
}

export default Game;