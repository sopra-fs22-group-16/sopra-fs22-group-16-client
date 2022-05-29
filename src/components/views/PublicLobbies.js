import React, {useState, useEffect} from 'react';
import {api} from 'helpers/api';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import {defaultTheme} from "styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import emptyState from "styles/images/empty_state.png";
import CustomPopUp from "components/ui/CustomPopUp";
import Socket from "components/socket/Socket";
import UserModel from "models/UserModel";

import 'styles/views/PublicLobbies.scss';

const PublicLobbies = () => {

    const token = localStorage.getItem('token');
    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    const history = useHistory();
    const location = useLocation();

    const [lobbyData, setLobbyData] = useState(null);
    const [isJoining, setJoining] = useState(false);
    const [error, setError] = useState({open: false, message: <div/>});
    const [getDataFailed, setGetDataFailed] = useState(false);

    const returnHome = () => {
        history.push('/home');
    }

    const joinLobbyByCode = () => {
        history.push('/lobby/join/code');
    }

    useEffect(() => {
        obtainAndLoadLobbyInfo().catch(() => setGetDataFailed(true));
    }, []);

    const onMessage = () => {
        obtainAndLoadLobbyInfo().catch(() => setGetDataFailed(true));
    }

    const obtainAndLoadLobbyInfo = async () => {
        const response = await api.get('/v1/game/lobby');
        setLobbyData(response.data);
    }

    async function joinLobbyWithId(id) {
        try {

            setJoining(true);
            const response = await api.post(`/v1/game/lobby/${id}/player`, JSON.stringify({}), {headers: {'token': token || ''}});

            // Get the returned user and update a new object.
            const user = new UserModel(response.data);
            if (!isRegistered) {
                localStorage.setItem('token', user.token);
            }
            localStorage.setItem('playerId', user.id);

            history.push({pathname: '/lobby/' + id})
        } catch (e) {
            setJoining(false);
            if (e.response !== null) {
                // conflict in lobby name
                if (e.response.status === 404) {
                    setError({open: true, message: <div> This lobby does not seem to be live! </div>});
                } else if (e.response.status === 401) {
                    setError({
                        open: true,
                        message: <div> It is necessary to be register in order to play a ranked game. </div>
                    });
                } else if (e.response.status === 403) {
                    setError({
                        open: true,
                        message: <div> It looks like your authentication is wrong <br /> We will log you out automatically. </div>
                    });
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('isRegistered');
                } else if (e.response.status === 409) {
                    setError({open: true, message: <div> This lobby is already full!</div>});
                } else if (e.response.status === 400) {
                    setError({open: true, message: <div> The code does not match the lobby!</div>});
                } else {
                    setError({
                        open: true,
                        message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact the
                            administrator.</div>
                    });
                }
            } else {
                setError({
                    open: true,
                    message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact the
                        administrator.</div>
                });
            }
        }
    }

    let content;

    if (lobbyData?.length > 0) {
        content = lobbyData.map((lobby, key) => (
                <LobbyInfo
                    key={key}
                    id={lobby.id}
                    name={lobby.name}
                    mode={lobby.gameMode}
                    players={lobby.players}
                    visibility={lobby.visibility}
                    type={lobby.gameType}
                    joinLobby={joinLobbyWithId}
                    popUpFullLobby={() => setError({open: true, message: <div> This lobby is already full!</div>})}
                />
            )
        );
    } else {
        content = <tr>
            <td colSpan="5" className={"PublicLobbies table-spacer"}>
                <Link to={{
                    pathname: '/lobby/create'
                }}
                      style={{textDecoration: 'none'}}>
                    <div className={"PublicLobbies table-spacer spacer-container"}>
                        <h1>There are no more raging battles!</h1>
                        <img src={emptyState} alt={"An image of a deserted battlefield."}/>
                        <h2>Do you want to create your own?</h2>
                    </div>
                </Link>
            </td>
        </tr>
    }

    return (
        <BaseContainer>
            <div className="PublicLobbies container">
                <label className="PublicLobbies h1"> Public Lobbies </label>
                <h2> Click on one of the lobbies to join</h2>
                <table className="PublicLobbies table">
                    <thead>
                    <tr className="top">

                        <th>NAME</th>
                        <th>MODE</th>
                        <th>PLAYERS</th>
                        <th>RANKED</th>
                    </tr>
                    </thead>
                </table>
                <table className="PublicLobbies table">
                    <tbody>
                    {content}
                    </tbody>
                </table>
                <div className="PublicLobbies button-container">
                    <Button
                        width="100%"
                        onClick={() => joinLobbyByCode()}
                    >
                        JOIN A LOBBY BY CODE
                    </Button>
                </div>
                <div className="PublicLobbies button-container">
                    <Button className="secondary-button return"

                            width="100%"
                            onClick={() => returnHome()}
                    >
                        RETURN HOME
                    </Button>
                </div>
                <div className={"PublicLobbies spacer"}/>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={isJoining} information={"Joining Lobby"}>
                    <div style={{width: '100%'}}>
                        <LinearProgress color="primary"/>
                    </div>
                </CustomPopUp>
                <CustomPopUp open={getDataFailed}
                             information={<div> Could not get lobby data <br/> Please try again later!</div>}>
                    <Button onClick={() => history.push('/home')}>
                        Return Home
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={error.open} information={error.message}>
                    <Button onClick={() => setError({open: false, message: <div/>})}>
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

const LobbyInfo = ({id, name, mode, players, type, joinLobby, popUpFullLobby}) => {
    const displayedMode = mode === "ONE_VS_ONE" ? "1v1" : "2v2";
    const presentPlayers = players.length;
    const totalPlayers = mode === "ONE_VS_ONE" ? 2 : 4;
    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    if (players > totalPlayers) return null;
    const enabled = presentPlayers < totalPlayers && (isRegistered || (!isRegistered && type === "UNRANKED"));
    if (enabled) {
        return (
            <tr onClick={() => joinLobby(id)} className="non-full">
                <td>
                    {name}
                </td>
                <td>
                    {displayedMode}
                </td>
                <td>
                    {presentPlayers + '/' + totalPlayers}
                </td>
                <td>
                    {
                        type === "RANKED" ?
                            <span>
                                &#x2714;
                            </span> :
                            <span>
                                &#x2718;
                            </span>
                    }
                </td>
            </tr>
        );
    }
    return (
        <tr onClick={popUpFullLobby} className="full">
            <td>
                {name}
            </td>
            <td>
                {displayedMode}
            </td>
            <td>
                {presentPlayers + '/' + totalPlayers}
            </td>
            <td>
                {
                    type === "RANKED" ?
                        <span>
                            &#x2714;
                        </span> :
                        <span>
                            &#x2718;
                        </span>
                }
            </td>
        </tr>
    );
};

export default PublicLobbies;