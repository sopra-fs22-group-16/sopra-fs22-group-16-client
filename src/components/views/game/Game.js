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
import Socket from "../../socket/Socket";
import HoldToConfirmPopUp from "../../ui/HoldToConfirmPopUp";
import TurnData from "../../../models/TurnData";
import PositionData from "models/PositionData";
import HealthData from "models/HealthData";

import "styles/views/game/Game.scss"

const Game = ({id}) => {

    const history = useHistory();
    const location = useLocation();

    const token = localStorage.getItem("token");

    const playerId = parseInt(localStorage.getItem("playerId"));
    const teamId = playerId; // TODO: Get Team Id

    const [gameData, setGameData] = useState({gameMode: '', gameType: '', turn: 0, playerIdCurrentTurn: 0, players: {}, map: [[]], units: []});

    const [showTurnPopUp, setShowTurnPopUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);

    const [surrender, setSurrender] = useState(false);
    const [endGame, setEndGame] = useState(false);
    //TODO: set the values with the information received from the server (socket)
    const [gameResult, setGameResult] = useState(null);
    const [winner, setWinner] = useState(null);

    // variables that are null that are populated by socket
    const[socketMove, setSocketMove] = useState(null);
    const[socketHealth, setSocketHealth] = useState(null);

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

            setGameData({
                gameType: response.data.gameType,
                gameMode: response.data.gameMode,
                turn: 0,
                playerIdCurrentTurn: 0,
                players: {
                    0: {
                        name: "player-0",
                        team: 0,
                    },
                    1: {
                        name: "player-1",
                        team: 1,
                    }
                },
                map: mapArray,
                units: unitArray
            });

            setShowTurnPopUp(true);

        } catch (error) {
            console.log(error);
            setGetDataFailed(true);
        }
    }

    // refresh view when receiving a message from the socket
    const onMessage = (msg) => {
        setSocketMove(msg.move);
        setSocketHealth(msg.health);
        
        /*
        Object.keys(msg).forEach((key) => {
            switch (key) {
                case 'turnInfo':
                    let data = new TurnData(msg[key]);
                    setShowTurnPopUp(true);
                    setGameData({
                        ...gameData,
                        turn: data.turn,
                        playerIdCurrentTurn: data.playerId
                    })
                    break;
                          
                default:
                   */ 
                    console.log(msg.health);
                    if(msg.health) {
                        console.log(msg.health[0]);
                        let healthDataDefend = new HealthData(msg.health[0]);
                        console.log(healthDataDefend);
                        //let healthDataAttack = new HealthData(msg.health[1]);
                        updateHealth(healthDataDefend);
                        //updateHealth(healthDataAttack);
                        }
                    
                    
                    // TODO: move to map so that it turns the elephant through map
                    else if(msg.health === null && gameData.turn !== playerId) {
                        let unitStart = new PositionData(msg.move.start);
                        let unitEnd = new PositionData(msg.move.end);
                        gameData.map[unitStart.y][unitStart.x].unit.move(unitEnd.y, unitEnd.x);
                        }

                    // I think turn change should go after the movement if posi
                        
                    //setErrorMessage("Unknown Message received from Server!");
            }
            


    const updateHealth = (healthData) => {
        
        let unitHealth =  gameData.map[healthData.unitPosition.y][healthData.unitPosition.x].unit;

        // remove the unit
        if(healthData.health <= 0) {
            unitHealth.move(null, null);
        } else {
        // decrease
        unitHealth.health = healthData.health;
        }
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

                    <Map
                        id = {id}
                        mapData={gameData.map}
                        unitData={gameData.units}
                        playerIdCurrentTurn={gameData.playerIdCurrentTurn}
                        socketUpdateHealth = {socketHealth}
                        socketUpdateMove = {socketMove}
                    />

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
                            <h2 style={{color: gameData.players[gameData.playerIdCurrentTurn].team === 0 ? '#873535' : '#516899'}} className={"turnIndicatorContainer player"}>{gameData.players[gameData.playerIdCurrentTurn].name}</h2>
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