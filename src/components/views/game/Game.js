import CanvasJSReact from "helpers/canvasjs.react";
import React, {useEffect, useState, Link} from "react";
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
import { LineChart, Label, Line, XAxis, YAxis, Tooltip} from 'recharts';

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
    const [showStatistics, setShowStatistics] = useState(false);
    //TODO: set the values with the information received from the server (socket)
    const [gameResult, setGameResult] = useState(null);
    const [winner, setWinner] = useState(null);

    // graphing Mettrics
    const [stateGraph, setStateGraph] = useState("Units");
    const [dataGraphsUnits, setDataGraphsUnits] = useState(null);
    const [dataGraphsKills, setDataGraphsKills] = useState(null);
    const [graphLabel, setGraphLabel] = useState(null);
    const [dataGraphs, setDataGraphs] = useState(null);
    const [metricSums, setMetricSums] = useState([null, null, null]);

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

    const goStatistics = async() => {
        //TODO: go to the statistics view
        const response = await api.get(`/v1/game/match/${id}/stats`, {headers: {'token': token || ''}}); 
        console.log(response.data)
        //const response = statisticsMockData;
        setShowStatistics(true);
        convertTurnData(response.data);
        
    }

    const playAgain = () => {
        //TODO: play another game
    }

    const goHome = () => {
        api.delete(`/v1/game/lobby/${id}/player`, {headers: {'token': token || ''}});
        localStorage.removeItem('token');
        localStorage.removeItem('playerId');
        history.push('/home');
    }

    /*
    const convertTurnData_old = (statisticsData) => {
        const data = statisticsData.players;
        console.log(data);
        let playerArray = [];
        let players = ["Player-0", "Player-1"]
    
        Object.keys(data).forEach(key => {
            console.log(key+ "key");
            let player = data[key];
            console.log(player.unitsperTurn);
            // player name
            let playerName = players[key];
            let turnArray = [];
            player.unitsperTurn.forEach((turn) => {
                let turnRow = { y: turn.units, label: turn.turn};
                turnArray.push(turnRow);
            });
    
            console.log(turnArray);
            const playerObject = new StatsData(playerName, turnArray);
            delete playerObject.x;
            playerArray.push(playerObject);
        })
    
        console.log(playerArray);
        setDataGraphs(playerArray);
    
    };
    */

    const convertTurnData = (statisticsData) => {

        //export averages
        setMetricSums([statisticsData.averageUnitsPerTurn, statisticsData.averageKillsPerTurn, statisticsData.totalMoves]);
        console.log(statisticsData);
        let playerUnitArray = statisticsData.unitsPerPlayer;
        console.log(playerUnitArray);
        let playerKillArray = statisticsData.killsPerPlayer;
        console.log(playerKillArray);
        /*
        Object.keys(data).forEach(key => {
            console.log(key+ "key");
            let player = data[key];
            console.log(player.unitsPerPlayer);
            console.log(player.killsPerPlayer);
            // player name
            /*
            let turnArray = [];
            let killArray = [];
            player.unitsPerPlayer.forEach((turn) => {
                let turnRow = turn.units;
                turnArray.push(turnRow);
            });

            player.killsPerPlayer.forEach((turn) => {
                let turnRow = turn.kills;
                killArray.push(turnRow);
            });
            
            let turnArray = player.unitsPerPlayer;
            let killArray = player.killsPerPlayer;
            console.log(turnArray);
            playerArray.push(turnArray);
            playerKillArray.push(killArray);
          });
          */
    
        const dataFinalUnits = [];
        const dataFinalKills = [];

    
        for (let i = 0; i < playerUnitArray[0].length; i++) {
        let unitsData = {
        turn: i+1,
        Player0: playerUnitArray[0][i],
        Player1: playerUnitArray[1][i]
        };


        let killsData = {
            turn: i+1,
            Player0: playerKillArray[0][i],
            Player1: playerKillArray[1][i]
            };
    
       if (gameData.gameType == "TWO_VS_TWO") 
            {
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


const StatisticsChart = () => {

    let xTickTurns = Array.from(Array(15).keys());

    
      return(
<div>
    <label class = {stateGraph == "Units"? "statisticsHeadingFaded": "statisticsHeading"} onClick={() =>  setStateGraph("Units")}>  {"<  "}  </label>
    <label class = "statisticsHeading"> {stateGraph == "Units"? "Units per Turn" :"Kills per Turn"} </label>
    <label class = {stateGraph == "Units" ? "statisticsHeading": "statisticsHeadingFaded"} onClick={() => setStateGraph("Kills")}>  {"  >"}  </label> 
    <LineChart
          width={270}
          height={220}
          data={stateGraph == "Units"? dataGraphsUnits: dataGraphsKills}
          margin={{ top: 20, right: 25, bottom: 0, left: -20 }}
        >
      <Tooltip />
      <Line name = "Player-0" type="monotone" dataKey="Player0" stroke="#873535" dot={false} />
      <Line name = "Player-1" type="monotone" dataKey="Player1" stroke="#516899" dot={false} />
      {
      gameData.gameType == "TWO_VS_TWO"?
      <div>
        <Line name = "Player-2" type="monotone" dataKey="Player2" stroke="green" dot={false} />
        <Line name = "Player-3" type="monotone" dataKey="Player3" stroke="yellow" dot={false} />
        </div>
        :
        null   
     }
      <XAxis name = "Turn" dataKey="turn" tick={{fontSize: 4}}/>
      <YAxis tick={{fontSize: 5}} ticks={[1, 2, 3]}/>
          </LineChart> 
            </div>
      );
      };

      const StatisticsTable =() => {
          return(
              <div>
        <table className="statistics">
        <thead>
            <tr>
                <th> METRIC</th>
                <th> YOUR VALUES</th>
            </tr>
        </thead>
                    <tbody>
                        <tr>
                            <th>UNITS/TURN</th>
                            <td > {metricSums[0]? metricSums[0].toFixed(2) : null}</td>
                        </tr>
                        <tr>
                            <th>KILLS/TURN</th>
                            <td> {metricSums[1]? metricSums[1].toFixed(2) : null}</td>
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
                <CustomPopUp style = {{'width':'600'}}
                open={showStatistics} information="">
            <label className={"winnerWindow"}> STATISTICS </label>
                    <StatisticsChart/>
                    <StatisticsTable/>
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