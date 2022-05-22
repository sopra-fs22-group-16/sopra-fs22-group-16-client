import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Map from "components/fragments/game/Map";
import { ThemeProvider } from "@emotion/react";
import { defaultTheme } from "styles/themes/defaulTheme";
import { LinearProgress } from "@mui/material";
import CustomPopUp from "components/ui/CustomPopUp";
import { Button } from "components/ui/Button";
import surrenderFlag from "styles/images/surrenderFlag.png"
import TileModel from "models/TileModel";
import { useHistory, useLocation } from "react-router-dom";
import UnitModel from "../../../models/UnitModel";
import { api } from "../../../helpers/api";
import HoldToConfirmPopUp from "../../ui/HoldToConfirmPopUp";
import Confetti from 'react-confetti';

import "styles/views/game/Game.scss"

const Game = ({ id }) => {

    const history = useHistory();
    const location = useLocation();

    const unblockRef = useRef(null);

    const beforeUnloadListener = (event) => {
        //TODO: Add API call to surrender
        api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
        localStorage.removeItem('token');
        localStorage.removeItem('playerId');
    };

    useEffect(() => {
        unblockRef.current = history.block((location) => {
            let result = window.confirm(`If you proceed you will loose the game? Are you sure you want to leave the page?`);
            if (result) {
                //Handle leaving page
                //TODO: Add API call to surrender
                api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
                localStorage.removeItem('token');
                localStorage.removeItem('playerId');
            }
            return result;
        }
        );
        window.addEventListener("beforeunload", beforeUnloadListener, { capture: true });
    }, []);

    // On component unmount unblock history, and remove event listeners
    useEffect(() => () => {
        unblockRef?.current();
        window.removeEventListener("beforeunload", beforeUnloadListener, { capture: true });
    }, []);

    const token = localStorage.getItem("token");

    const playerId = parseInt(localStorage.getItem("playerId"));
    let teamId;

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

            const response = await api.get(`/v1/game/match/${id}`, { headers: { 'token': token || '' } });

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

            teamId = response.data.players[playerId].teamId;

            setGameData({
                gameType: response.data.gameType,
                gameMode: response.data.gameMode,
                turn: response.data.turnNumber,
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
        setGameData({
            ...gameData,
            turn: turnInfo.turn,
            playerIdCurrentTurn: turnInfo.playerId,
        });
        setShowTurnPopUp(true);
    }

    const gameOver = (gameOverInfo) => {
        if (gameOverInfo.winners.includes(parseInt(playerId))) {
            setGameResult("VICTORY");
        }
        else {
            setGameResult("DEFEAT");
        }
        // if the game is 1v1, we show the name of the winner
        if (gameOverInfo.winners.length == 1) {
            setWinner(gameData.players[gameOverInfo.winners[0]].name);
        }
        // if 2v2, we show the team
        else {
            setWinner("Team" + gameData.players[gameOverInfo.winners[0]].teamId);
        }
        setEndGame(true);
    }


    const confirmSurrender = async() => {
        await api.put(`/v1/game/match/${id}/command/surrender`, JSON.stringify({}), {headers: {'token': token || ''}});
    }

    const receiveSurrender = (surrenderInfo) => {
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
        // If this is another component, add back the whitelist to history.block
        // example in lobby
    }

    const playAgain = () => {
        //TODO: play another game
    }

    const goHome = () => {
        api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
        localStorage.removeItem('token');
        localStorage.removeItem('playerId');
        unblockRef?.current();
        history.push('/home');
    }

    return (
        <div id={"gameContainer"}>
            {/* Disable zooming, as it leads to white lines between tiles */}
            <Helmet>
                <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Helmet>

            {
                (gameData.map === [[]]) ?
                    <div className={"loadingContainer"}>
                        <ThemeProvider theme={defaultTheme}>
                            <LinearProgress color="secondary" />
                        </ThemeProvider>
                    </div>

                    :

                    <Map
                        id={id}
                        mapData={gameData.map}
                        unitData={gameData.units}
                        playerIdCurrentTurn={gameData.playerIdCurrentTurn}
                        onChangeTurn={changeTurn}
                        onGameOver={gameOver}
                        onSurrender = {receiveSurrender}
                    />

            }

            <div
                className={"surrenderFlagContainer"}
                onClick={() => setSurrender(true)}>
                <img
                    className={"pixelated"}
                    src={surrenderFlag}
                    alt={"A white flag - press to surrender"} />
            </div>
            <ThemeProvider theme={defaultTheme}>
                {
                    Object.keys(gameData.players).length !== 0 ?
                        <HoldToConfirmPopUp
                            open={showTurnPopUp}
                            onComplete={() => setShowTurnPopUp(false)}>
                            <div className={"turnIndicatorContainer"}>
                                <h1 className={"turnIndicatorContainer turn"}>Turn {gameData.turn}</h1>
                                <h2 style={{ color: gameData.players[gameData.playerIdCurrentTurn].team === 0 ? '#873535' : '#516899' }}
                                    className={"turnIndicatorContainer player"}>{gameData.players[gameData.playerIdCurrentTurn].name}</h2>
                                <p className={"turnIndicatorContainer information"}>Hold to Start</p>
                            </div>
                        </HoldToConfirmPopUp>
                        : null
                }
                <CustomPopUp open={getDataFailed} information={"Could not get game data!"}>
                    <Button onClick={() =>
                        obtainAndLoadGameData()
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
                    {
                        gameResult == "VICTORY" ?
                            <Confetti
                                drawShape={ctx => {
                                    ctx.beginPath()
                                    for (let i = 0; i < 22; i++) {
                                        const angle = 0.35 * i
                                        const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
                                        const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
                                        ctx.lineTo(x, y)
                                    }
                                    ctx.stroke()
                                    ctx.closePath()
                                }}
                            /> : null
                    }
                </CustomPopUp>
            </ThemeProvider>
        </div>
    );
}

export default Game;
