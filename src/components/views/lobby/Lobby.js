import React, { useState, useEffect } from 'react';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@emotion/react";

import { api } from 'helpers/api';
import CustomPopUp from "components/ui/CustomPopUp";
import Socket from "components/socket/Socket";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from 'components/ui/Button';
import Countdown from 'components/ui/Countdown';

import { defaultTheme } from "styles/themes/defaulTheme";
import 'styles/views/lobby/Lobby.scss';

// form for changing name
const FormName = props => {
    return (
        <div className="buttonIn">
            <input
                className="buttonIn name"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
            <button
                className="buttonIn button"
                onClick={e => props.onClick(e.target.value)}>
            </button>
        </div>
    );
  };

const Lobby = ({id}) => {

    const history = useHistory();
    const location = useLocation();

    //we get the information from the creation page
    const token = localStorage.getItem("token");
    const [gameMode, setGameMode] = useState(null);
    const [visibility, setVisibility] = useState(null);
    const [presentPlayers, setPresentPlayers] = useState(null);
    const [readyPlayers, setReadyPlayers] = useState(null);
    const [totalPlayers, setTotalPlayers] = useState(null);
    const [name, setName] = useState(null);
    const [players, setPlayers] = useState(null);
    const [invitationCode, setInvitationCode] = useState(null);
    const [isHost, setIsHost] = useState(null);
    const [playerName, setPlayerName] = useState(null);

    // PopUp
    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);

    const returnLobbies = () => {
        api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
        localStorage.removeItem('token');
        localStorage.removeItem('playerId');
        history.push('/public-lobbies');
    }

    const returnHome = () => {
        api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
        localStorage.removeItem('token');
        localStorage.removeItem('playerId');
        history.push('/home');
    }

    // change the status of the player when clicking the checkbox
    const changeStatus = async (user) => {
        try {
            if (parseInt(localStorage.getItem("playerId")) === user.id) {
                const requestBody = {
                    "ready": !user.ready
                };
                await api.put(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), { headers: { 'token': token || '' } });
            }
        } catch (error) {
            setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.");
        }
    }

 

    // set new name, let the user know if it's already taken (409)
    const changeName = async(user) => {
        if(!user.ready) {
            if (parseInt(localStorage.getItem("playerId")) === user.id) {
        try {
                const requestBody = {
                    "name": playerName
                };
                await api.put(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), { headers: { 'token': token || '' } });                
            }
         catch (error) {
            if(error.response.status === 409) {
                setErrorMessage("This name is already taken!");
            }

            else if(error.response.status === 400) {
                setErrorMessage("The name should not be empty!");
            }
            else {
            setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.");
            }
        }
    }
    } else setErrorMessage("Changing information after setting ready status is not possible!");
    }

// setting new Name - moving here to determine if the row is a form or not
const setClassName = (user) => {
    if(user.id === parseInt(localStorage.getItem("playerId"))) {
        return(
                <td>
                <FormName
                    value={playerName === null ? user.name : playerName}
                    onChange={newName => setPlayerName(newName)}
                    onClick={() => changeName(user)}
                    >
                    </FormName>
                </td>
    )}
    else {
        return (
            <td>{user.name}</td>
    )}
}

    // refresh view when receiving a message from the socket
    const onMessage = (msg) => {
        if (msg === "GameCreated") {
            history.push(`/game/${id}`);
        }
        else {
            window.location = window.location.href;
        }
    }

    //action after the countdown ends
    const createGame = async () => {
        if (isHost) {
            try {
                await api.post(`/v1/game/match/${id}`, JSON.stringify({}), { headers: { 'token': token || '' } });
            } catch (error) {
                setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.");
                notReady();
            }
        }
    }

    //action to stop the counter
    const notReady = async () => {
        try {
            const requestBody = {
                "ready": false
            };
            await api.put(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), { headers: { 'token': token || '' } });
        } catch (error) {
            setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.");
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {

                const apiResponse = await api.get(`/v1/game/lobby/${id}`,
                    {
                        headers: {'token': token}
                    }
                );

                const apiResponsePlayers = apiResponse.data.players;

                //set different values obtained from the API
                setGameMode(apiResponse.data.gameMode);
                setVisibility(apiResponse.data.visibility);
                setPresentPlayers(apiResponsePlayers.length);
                setIsHost(apiResponse.data.hostId === parseInt(localStorage.getItem("playerId")));
                setReadyPlayers(apiResponsePlayers.filter(p => p.ready === true).length);
                setTotalPlayers(apiResponse.data.gameMode === 'ONE_VS_ONE' ? 2 : 4);
                setName(apiResponse.data.name);
                setPlayers(apiResponse.data.players);
                setInvitationCode(apiResponse.data.invitationCode);

            } catch (error) {
                setGetDataFailed(true);
            }
        }

        fetchData();
    }, []);

    return (
        <BaseContainer>
            <div className="lobby">
                <label className="lobby lobby-title">Lobby Information</label>
                {
                  // Only show update link to host
                  isHost ? <Link
                            className="lobby link"
                            to={`${id}/update`}>
                            update lobby information</Link>:null
                }
                <table className="lobby-info">
                    <tbody>
                    <tr>
                        <th>NAME</th>
                        <td nowrap={"true"} style={{overflow: 'hidden', 'maxWidth': '0'}}>{name}</td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>{visibility === "PUBLIC" ? "public" : "private"}</td>
                    </tr>
                    <tr>
                        <th>MODE</th>
                        <td>{gameMode === "ONE_VS_ONE" ? "1v1" : "2v2"}</td>
                    </tr>
                    <tr>
                        <th>PLAYERS</th>
                        <td>{presentPlayers + '/' + totalPlayers}</td>
                    </tr>
                    <tr>
                        <th>READY</th>
                        <td>{readyPlayers + '/' + totalPlayers}</td>
                    </tr>
                    </tbody>
                </table>
                <label className="lobby lobby-labels">Click on your row to update your information and player
                    status.</label>
                <table className="player-view">
                    <tbody>
                    <tr>
                        <th>PLAYER</th>
                        <th>TEAM</th>
                        <th>STATUS</th>
                    </tr>
                    {players ? players.map((user) => {
                        return (
                            <tr key={user.id} style={user.id === parseInt(localStorage.getItem("playerId")) ? { background: '#787878'} : {}}>
                                {setClassName(user)}                         
                                <td>
                                    <div className={'lobby teambox team' + user.team}/>
                                </td>
                                <td>
                                    <input id={user.id} className="lobby status" type="checkbox"
                                        checked={user.ready}
                                        onClick={() => changeStatus(user)}/>
                                </td>
                            </tr>
                        )
                    }) : null}
                    </tbody>
                </table>
                {
                  //Only show invite users link if invitationCode is known and the player is the host.
                  invitationCode && isHost ? <Link
                                                className="lobby link"
                                                to={`${id}/invite-users`}>
                                                invite users</Link>:null
                }
                <div className="lobby lobby-buttons">
                    <Button onClick={() => returnLobbies()}>RETURN TO LOBBIES</Button>
                </div>
                <div className="lobby lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={getDataFailed} information={"Could not get lobby data - Please try again later!"}>
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
            <Socket
                topics={location.pathname}
                onMessage={onMessage}
            />
            {
                // the timer is displayed when all players are ready
                readyPlayers === totalPlayers && totalPlayers != null ?
                    <Countdown
                        duration={5} size={120}
                        content={"Lobby complete! Game loading ..."}
                        onComplete={createGame}
                        buttonMessage={"Not ready"}
                        onClick={notReady}
                    /> : null
            }
        </BaseContainer>
    );
};

export default Lobby;