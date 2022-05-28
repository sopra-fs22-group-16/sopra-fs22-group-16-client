import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Map from "components/fragments/game/Map";
import { ThemeProvider } from "@emotion/react";
import { defaultTheme } from "styles/themes/defaulTheme";
import { LinearProgress } from "@mui/material";
import CustomPopUp from "components/ui/CustomPopUp";
import { Button } from "components/ui/Button";
import surrenderFlag from "styles/images/surrenderFlag.png"
import animationsOn from "styles/images/ui/animationsOn.png"
import animationsOff from "styles/images/ui/animationsOff.png"
import TileModel from "models/TileModel";
import { useHistory } from "react-router-dom";
import UnitModel from "../../../models/UnitModel";
import { api } from "../../../helpers/api";
import HoldToConfirmPopUp from "../../ui/HoldToConfirmPopUp";
import { BarChart, LineChart, Line, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import Confetti from 'react-confetti';
import "styles/views/game/Game.scss"

const Game = ({ id }) => {

    const history = useHistory();

    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    const unblockRef = useRef(null);

    const beforeUnloadListener = () => {
        api.put(`/v1/game/match/${id}/command/surrender`, JSON.stringify({}), { headers: { 'token': token || '' } });
        api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
        if (!isRegistered) {
            localStorage.removeItem('token');
        }
        localStorage.removeItem('playerId');
    };

    useEffect(() => {
        unblockRef.current = history.block(() => {
            let result = window.confirm(`If you proceed you will loose the game? Are you sure you want to leave the page?`);
            if (result) {
                //Handle leaving page
                api.put(`/v1/game/match/${id}/command/surrender`, JSON.stringify({}), { headers: { 'token': token || '' } });
                api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
                if (!isRegistered) {
                    localStorage.removeItem('token');
                }
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
    const [showStatistics, setShowStatistics] = useState(false);
    //TODO: set the values with the information received from the server (socket)
    const [gameResult, setGameResult] = useState(null);
    const [winner, setWinner] = useState(null);

    const [showAnimations, setShowAnimations] = useState(true);

    // graphing Mettrics
    const [stateGraph, setStateGraph] = useState("Units");
    const [dataGraphsUnits, setDataGraphsUnits] = useState(null);
    const [dataGraphsKills, setDataGraphsKills] = useState(null);
    const [metricSums, setMetricSums] = useState([null, null, null]);

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
                row.forEach((_tile, x) => {
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
        } else {
            setGameResult("DEFEAT");
        }
        // if the game is 1v1, we show the name of the winner
        if (gameOverInfo.winners.length === 1) {
            setWinner(gameData.players[gameOverInfo.winners[0]].name);
        }
        // if 2v2, we show the team
        else {
            setWinner("Team" + gameData.players[gameOverInfo.winners[0]].teamId);
        }
        setEndGame(true);
    }


    const confirmSurrender = async () => {
        await api.put(`/v1/game/match/${id}/command/surrender`, JSON.stringify({}), { headers: { 'token': token || '' } });
    }

    const receiveSurrender = (surrenderInfo) => {
        setEndGame(true);
        let loser = surrenderInfo.surrenderedPlayer;
        let result = loser === playerId ? "DEFEAT" : "VICTORY";
        let winner_ = loser === playerId ? Math.abs(playerId - 1) : playerId;
        setGameResult(result);
        setWinner(gameData.players[winner_].name);
    }

    const goStatistics = async () => {
        const response = await api.get(`/v1/game/match/${id}/stats`, { headers: { 'token': token || '' } });
        setShowStatistics(true);
        convertTurnData(response.data);

    }

    const playAgain = () => {
        unblockRef?.current();
        history.push(`/lobby/${id}`)
    }

    const goHome = () => {
        api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
        if (!isRegistered) {
            localStorage.removeItem('token');
        }
        localStorage.removeItem('playerId');
        unblockRef?.current();
        history.push('/home');
    }


    const convertTurnData = (statisticsData) => {

        //export averages
        setMetricSums([statisticsData.averageUnitsPerTurn, statisticsData.averageKillsPerTurn, statisticsData.totalMoves]);
        console.log(statisticsData);
        let playerUnitArray = statisticsData.unitsPerPlayer;
        console.log(playerUnitArray);
        let playerKillArray = statisticsData.killsPerPlayer;
        console.log(playerKillArray);

        const dataFinalUnits = [];
        const dataFinalKills = [];


        for (let i = 0; i < playerUnitArray[0].length; i++) {
            let unitsData = {
                turn: i + 1,
                Player0: playerUnitArray[0][i],
                Player1: playerUnitArray[1][i]
            };


            let killsData = {
                turn: i + 1,
                Player0: playerKillArray[0][i],
                Player1: playerKillArray[1][i]
            };

            if (gameData.gameType === "TWO_VS_TWO") {
                // add the other two players
                unitsData['Player3'] = playerUnitArray[2][i];
                unitsData['Player4'] = playerUnitArray[3][i];
                killsData['Player3'] = playerKillArray[2][i];
                killsData['Player4'] = playerKillArray[3][i];
            }


            dataFinalUnits.push(unitsData);
            dataFinalKills.push(killsData);
        }
        setDataGraphsUnits(dataFinalUnits);
        setDataGraphsKills(dataFinalKills);
    };

    const BarChartKills = () => {

        return (

            <BarChart
                width={270}
                height={220}
                data={stateGraph === "Units" ? dataGraphsUnits : dataGraphsKills}
                margin={{ top: 20, right: 25, bottom: 0, left: -20 }}
            >

                <YAxis tick={{ fontSize: 5 }} ticks={[1, 2, 3]} />
                <XAxis name="Turn" dataKey="turn" tick={{ fontSize: 8 }}
                    interval={metricSums[2] < 20 ? 0 : (metricSums[2] < 40 ? 2 : 5)} />
                <Tooltip />
                <Bar
                    dataKey="Player0"
                    fill="#873535"
                    name={gameData.players[0].name}
                />

                <Bar
                    dataKey="Player1"
                    fill="#516899"
                    name={gameData.players[1].name}
                />
                {gameData.gameType === "TWO_VS_TWO" ?

                    <div>
                        <Bar
                            dataKey="Player2"
                            fill="green"
                            name={gameData.players[2].name}
                        />

                        <Bar
                            dataKey="Player3"
                            fill="yellow"
                            name={gameData.players[3].name}
                        />
                    </div>
                    :
                    null
                }

            </BarChart>
        );
    }

    const StatisticsChart = () => {

        return (
            <div>
                <label className={stateGraph === "Units" ? "statisticsHeadingFaded" : "statisticsHeading"}
                    onClick={() => setStateGraph("Units")} style={{ fontSize: 25 + 'px' }}>  &#x2190; </label>
                <label
                    className="statisticsHeading"> {stateGraph === "Units" ? "Units per Turn" : "Kills per Turn"} </label>
                <label className={stateGraph === "Units" ? "statisticsHeading" : "statisticsHeadingFaded"}
                    onClick={() => setStateGraph("Kills")} style={{ fontSize: 25 + 'px' }}>  &#x2192;  </label>
                {stateGraph === "Units" ?

                    <LineChart
                        width={270}
                        height={220}
                        data={dataGraphsUnits}
                        margin={{ top: 20, right: 25, bottom: 0, left: -20 }}
                    >
                        <Tooltip />
                        <Line name={gameData.players[0] ? gameData.players[0].name : null} type="monotone"
                            dataKey="Player0" stroke="#873535" dot={false} />
                        <Line name={gameData.players[1] ? gameData.players[1].name : null} type="monotone"
                            dataKey="Player1" stroke="#516899" dot={false} />
                        {gameData.gameType === "TWO_VS_TWO" ?
                            <div>
                                <Line name={gameData.players[2].name} type="monotone" dataKey="Player2"
                                    stroke="green" dot={false} />
                                <Line name={gameData.players[3].name} type="monotone" dataKey="Player3"
                                    stroke="yellow" dot={false} />
                            </div> : null}
                        <XAxis name="Turn" dataKey="turn" tick={{ fontSize: 8 }}
                            interval={metricSums[2] < 20 ? 0 : (metricSums[2] < 40 ? 2 : 5)} />
                        <YAxis tick={{ fontSize: 8 }} ticks={[1, 2, 3]} />
                    </LineChart>
                    :
                    <BarChartKills />
                }
            </div>
        );
    };

    const StatisticsTable = () => {
        return (
            <div>
                <table className="statistics">
                    <thead>
                        <tr>
                            <th> METRIC</th>
                            <th> FINAL VALUES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>UNITS/TURN</th>
                            <td> {metricSums[0] ? metricSums[0].toFixed(2) : 0}</td>
                        </tr>
                        <tr>
                            <th>KILLS/TURN</th>
                            <td> {metricSums[1] ? metricSums[1].toFixed(2) : 0.00}</td>
                        </tr>
                        <tr>
                            <th>TOTAL MOVES</th>
                            <td> {metricSums[2]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };


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
                        onSurrender={receiveSurrender}
                        performAnimation={showAnimations}
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
            <div
                className={"settingsContainer"}
                onClick={() => setShowAnimations(prevState => !prevState)}>
                {
                    showAnimations ?
                        <img
                            className={"pixelated"}
                            src={animationsOn}
                            alt={"Show animations"} />
                        :
                        <img
                            className={"pixelated"}
                            src={animationsOff}
                            alt={"Skip animations"} />
                }
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
                        gameResult === "VICTORY" ?
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
                <CustomPopUp style={{ 'width': '600' }}
                    open={showStatistics} information="">
                    <label className={"winnerWindow"}> STATISTICS </label>
                    <StatisticsChart />
                    <StatisticsTable />
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
