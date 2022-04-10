import React, {useState, useEffect} from 'react';
import {api} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import 'styles/views/PublicLobbies.scss';
import BaseContainer from "components/ui/BaseContainer";
import jsonDataLobbies from "./jsonDataLobbies";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import defaultTheme from "../../styles/themes/defaulTheme";
import DynamicPopUp from "../ui/DynamicPopUp";


const PublicLobbies = () => {
    const history = useHistory();
    const [lobbyData, setLobbyData] = useState(null);
    const [isJoining, setJoining] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const returnHome = () => {
        history.push('/home');
    }

    // TODO - UPDATE WITH JOINBYCODE PAGE
    const joinLobbyByCode = () => {
        history.push('/join-lobby');
    }

    useEffect(() => {
        async function fetchData() {
            try {

                // TODO - jsonDataLobbies import from REST or whatever
                //const response = await api.get('/v1/game/lobby/1');
                const response = jsonDataLobbies;


                // Get the returned users and update the state.
                setLobbyData(response);

            } catch (error) {
                setErrorMessage("Something went wrong while fetching the lobbies")
            }
        }

        fetchData().then();
    }, []);

    async function joinLobby(id) {
        try {
            setJoining(true);

            //**TODO** here we need to call to the backend to join the lobby and set the token (unregistered User)
            // Remove when implementing actual call implemented
            // Simulate joining lobby
            await new Promise(resolve => setTimeout(resolve, 1000));

            // here we mocked the answer of the API join lobby
            const responseBody = {
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

            history.push({
                pathname: '/lobby/' + id,
                state: responseBody
            })

        } catch (error) {
            setJoining(false);
            // TODO: Update with correct error codes and messages
            if (error.response.status === 999) {
                setErrorMessage("THIS IS A SAMPLE ERROR MESSAGE!");
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
                    joinLobby={joinLobby}
                />
            )
        );
    }

    return (
        <BaseContainer>
            <ThemeProvider theme={defaultTheme}>
                <DynamicPopUp open={isJoining} information={"Joining Lobby"}>
                    <div style={{width: '100%'}}>
                        <LinearProgress color="primary"/>
                    </div>
                </DynamicPopUp>
                <DynamicPopUp open={errorMessage !== ''} information={errorMessage}>
                    <Button onClick={() =>
                        setErrorMessage("")
                    }>
                        Close
                    </Button>
                </DynamicPopUp>
            </ThemeProvider>
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
        </BaseContainer>

    );
};

const LobbyInfo = ({id, name, mode, players, visibility, joinLobby}) => {

    const displayedMode = mode === "ONE_VS_ONE" ? "1v1" : "2v2";
    const presentPlayers = players.length;
    const totalPlayers = mode === "ONE_VS_ONE" ? 2 : 4;

    if (visibility === "PRIVATE") return null;
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