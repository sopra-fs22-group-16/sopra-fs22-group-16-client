import React, { useState, useEffect } from 'react';
import { useHistory, Link, useLocation} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {Button} from 'components/ui/Button';
import {api} from 'helpers/api';
import {defaultTheme} from "styles/themes/defaulTheme";
import CustomPopUp from "components/ui/CustomPopUp";
import { ThemeProvider } from "@emotion/react";
import Socket from "components/socket/Socket";


import 'styles/views/lobby/Lobby.scss';

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

    // PopUp
    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);

    const returnLobbies = () => {
        api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
        localStorage.removeItem('token');
        history.push('/public-lobbies');
    }

    const returnHome = () => {
        api.delete(`/v1/game/lobby/${id}/player`, { headers: { 'token': token || '' } });
        localStorage.removeItem('token');
        history.push('/home');
    }

    const changeStatus = (player) => {
        //implement function (in the corresponding story)
    }

    // refresh view when receiving a message from the socket
    const onMessage = () => {
        window.location = window.location.href;
    }

    useEffect(() => {
        async function fetchData() {
            try {

                const apiResponse = await api.get(`/v1/game/lobby/${id}`,
                    {
                        headers: {'token': token}
                    }
                );

                //set different values obtained from the API
                setGameMode(apiResponse.data.gameMode);
                setVisibility(apiResponse.data.visibility);
                setPresentPlayers(apiResponse.data.players.length);
                setIsHost(apiResponse.data.hostId == localStorage.getItem("playerId"));
                console.log(apiResponse.data.hostId);
                console.log(localStorage.getItem("playerId"));
                setReadyPlayers(0);
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
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>
                                    <div className={'lobby teambox team' + user.team}/>
                                </td>
                                <td>
                                    <input id={user.id} className="lobby status" type="checkbox"
                                           onClick={() => changeStatus(user.ready)}/>
                                </td>
                            </tr>
                        )
                    }) : null}
                    </tbody>
                </table>
                {
                  //Only show invite users link if invitationCode is known.
                  invitationCode ? <Link
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
        </BaseContainer>
    );
};

export default Lobby;