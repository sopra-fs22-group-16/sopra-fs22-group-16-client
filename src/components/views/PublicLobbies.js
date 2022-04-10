import React, {useState, useEffect} from 'react';
import {api} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import jsonDataLobbies from "./lobby/jsonDataLobbies";
import {BlockPopup, Popup} from "../ui/Popup";
import {defaultTheme} from "../../styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import Header from "components/ui/Header"

import 'styles/views/PublicLobbies.scss';
import CustomPopUp from "../ui/CustomPopUp";
import UserModel from "../../models/UserModel";

const PublicLobbies = () => {
    const history = useHistory();
    const [lobbyData, setLobbyData] = useState(null);

    // PopUps
    const [isJoining, setJoining] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);

    const returnHome = () => {
        history.push('/home');
    }

    // TODO - UPDATE WITH JOIN BY CODE PAGE
    const joinLobbyByCode = () => {
        history.push('/join-lobby');
    }

    useEffect(() => {
        async function fetchData() {
            try {
                // TODO: Switch as soon as implemented
                //const response = await api.get('/v1/game/lobby/1');
                const response = jsonDataLobbies;

                setLobbyData(response);

            } catch (error) {
                setGetDataFailed(true);
            }
        }

        fetchData();
    }, []);

    async function joinLobbyWithId(id) {
        try {
            setJoining(true);

            //**TODO** here we need to call to the backend to join the lobby and set the token (unregistered User)
            // Remove when implementing actual call implemented
            // Simulate joining lobby
            await new Promise(resolve => setTimeout(resolve, 500));

            // here we mocked the answer of the API join lobby
            const response = {
                "lobby": {
                    "id": id,
                    "name": "name",
                    "ownerId": 0,
                    "players": [
                        {
                            "id": 0,
                            "name": "Player-0",
                            "ready": false,
                            "team": 0
                        },
                        {
                            "id": 1,
                            "name": "Player-2",
                            "ready": false,
                            "team": 0
                        },

                    ],
                    "visibility": "PUBLIC",
                    "gameMode": "TWO_VS_TWO",
                    "gameType": "UNRANKED",
                    "invitationCode": "ABCDEFGH"
                },
                "token": "THIS IS MY TOKEN"
            };

            // Get the returned user and update a new object.
            const user = new UserModel(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', user.token);

            history.push({pathname: '/lobby/' + user.lobby.id})
        } catch (error) {
            setJoining(false);
            if (error.response != null) {
                // TODO: Update with correct error codes and messages
                if (error.response.status === 999) {
                    setErrorMessage("THIS IS A SAMPLE ERROR MESSAGE!");
                } else {
                    setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.")
                }
            } else {
                setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.")
            }
        }
    }

    let content = null;

    if (lobbyData) {
        content = lobbyData.map((data, key) => (
                <LobbyInfo
                    id={data.id}
                    key={key}
                    name={data.name}
                    mode={data.mode}
                    players={data.players}
                    visibility={data.visibility}
                    joinLobby={joinLobbyWithId}
                />
            )
        );
    }

    // TODO - jsonDataLobbies import from REST or whatever
    return (
        <BaseContainer>
            <Header/>
            <BlockPopup id="joinLobbyPopUp">Joining lobby<br/><br/><ThemeProvider theme={defaultTheme}><LinearProgress
                color="secondary"/></ThemeProvider></BlockPopup>
            <Popup id="failedLobbyPopUp">Failed to join lobby</Popup>
            <div className="PublicLobbies container">
                <label className="PublicLobbies h1"> Public Lobbies </label>
                <h2> Click on one of the lobbies to join</h2>
                <table className="PublicLobbies table">
                    <thead>
                    <tr className="top">

                        <th>Lobby name</th>
                        <th>game mode</th>
                        <th>players</th>
                        <th>capacity</th>
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
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={isJoining} information={"Joining Lobby"}>
                    <div style={{width: '100%'}}>
                        <LinearProgress color="primary"/>
                    </div>
                </CustomPopUp>
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
        </BaseContainer>
    );
};

const LobbyInfo = ({id, name, mode, players, visibility, joinLobby}) => {

    const displayedMode = mode === "ONE_VS_ONE" ? "1v1" : "2v2";
    const presentPlayers = players.length;
    const totalPlayers = mode === "ONE_VS_ONE" ? 2 : 4;

    if (visibility === "PRIVATE" || players >= totalPlayers) return null;
    return (
        <tr onClick={() => joinLobby(id)}>
            <td>
                {name}
            </td>
            <td>
                {displayedMode}
            </td>
            <td>
                {presentPlayers}
            </td>
            <td>
                {totalPlayers}
            </td>
        </tr>
    );
};

export default PublicLobbies;