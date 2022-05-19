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
import HoldToConfirmPopUp from "../../ui/HoldToConfirmPopUp";

import "styles/views/game/Game.scss"

const Game = ({id}) => {

    const history = useHistory();
    const location = useLocation();

    const token = localStorage.getItem("token");

    const playerId = parseInt(localStorage.getItem("playerId"));
    const teamId = playerId; // TODO: Get Team Id

    const [gameData, setGameData] = useState({
        gameMode: '',
        gameType: '',
        turn: 0,
        playerIdCurrentTurn: 0,
        players: {},
        map: [[]],
        units: []
    });

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

            setGameData({
                gameType: response.data.gameType,
                gameMode: response.data.gameMode,
                turn: response.data.turn,
                playerIdCurrentTurn: response.data.playerIdCurrentTurn,
                players: response.data.players,
                map: mapArray,
                units: unitArray
            });

            setShowTurnPopUp(true);

        } catch (error) {
            console.log(error);
            setGetDataFailed(true);
        }
    }


    const changeTurn = (turnInfo) => {
        console.log(turnInfo);
        console.log("turn updating");
        setGameData({
            ...gameData,
            turn: turnInfo.turn,
            playerIdCurrentTurn: turnInfo.playerId,
        });
        console.log(gameData.playerIdCurrentTurn);
        setShowTurnPopUp(true);
    }


    const confirmSurrender = async() => {
        await api.put(`/v1/game/match/${id}/command/surrender`, JSON.stringify({}), {headers: {'token': token || ''}});
    }

    const receiveEndGame = (surrenderInfo) => {
        console.log("game finished in game");
        setEndGame(true);
        let loser = surrenderInfo.surrenderedPlayer;
        let result = loser == playerId? "DEFEAT": "WIN";
        let winner = loser == playerId? Math.abs(playerId-1): playerId;
        setGameResult(result);
        setWinner(gameData.players[winner].name);
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
                        id={id}
                        mapData={gameData.map}
                        unitData={gameData.units}
                        playerIdCurrentTurn={gameData.playerIdCurrentTurn}
                        onChangeTurn={changeTurn}
                        onEndGame = {receiveEndGame}

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
                                <h2 style={{color: gameData.players[gameData.playerIdCurrentTurn].team === 0 ? '#873535' : '#516899'}}
                                    className={"turnIndicatorContainer player"}>{gameData.players[gameData.playerIdCurrentTurn].name}</h2>
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
                            confirmSurrender()
                        }>
                        SURRENDER
                    </Button>
                    <Button
                        onClick={() =>
                            setSurrender(false)
                        }>
                        RETURN TO GAME
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
        </div>
    );
}

export default Game;