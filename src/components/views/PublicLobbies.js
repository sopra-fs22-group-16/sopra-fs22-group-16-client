import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import jsonDataLobbies from "./jsonDataLobbies";
import {BlockPopup, Popup} from "../ui/Popup";
import defaultTheme from "../../styles/themes/defaulTheme";
import { LinearProgress} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import Header from "components/views/Header"

import 'styles/views/HomePage.scss';
import 'styles/views/PublicLobbies.scss';

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const PublicLobbies = () => {
    const history = useHistory();
    //const RESTDataLobbies = api.get(URL = '/v1/game/lobbies/');
    const [lobbyData, setLobbyData] = useState(null);

    const returnHome = () => {
        history.push('/home');
    }


    // TODO - UPDATE WITH JOINBYCODE PAGE
    const joinLobbybyCode = () => {
        history.push('/join-lobby');
    }

    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/v1/game/lobby/1');

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)

                // Get the returned users and update the state.
                //setLobbyData(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                //alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    let content = null;

    if (jsonDataLobbies) {
        content = jsonDataLobbies.map((data, key) => (
                <LobbyInfo
                    id={data.id}
                    key={key}
                    name={data.name}
                    mode={data.mode}
                    players={data.players}
                    visibility={data.visibility}
                />
            )
        );
    }

    // TODO - jsonDataLobbies import from REST or whatever
    return (
        <BaseContainer>
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
                        onClick={() => joinLobbybyCode()}
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

const LobbyInfo = ({id, name, mode, players, visibility}) => {

    const history = useHistory();
    const displayedMode = mode === "ONE_VS_ONE" ? "1v1" : "2v2";
    const presentPlayers = players.length;
    const totalPlayers = mode === "ONE_VS_ONE" ? 2 : 4;

    async function gotoLobbyPage() {
        try {
            const popUp = document.getElementById("joinLobbyPopUp");
            popUp.style.display = "block";

            //**TODO** here we need to call to the backend to join the lobby and set the token (unregistered User)
            // Remove when implementing actual call implemented
            // Simulate joining lobby
            await new Promise(resolve => setTimeout(resolve, 2000));

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
            //**TODO** control errors after call to the backend to create the lobby
            alert("Something went wrong! ");

            const blockPopUp = document.getElementById("joinLobbyPopUp");
            blockPopUp.style.display = "none"

            const popUp = document.getElementById("failedLobbyPopUp");
            popUp.style.display = "block";
            popUp.addEventListener("click", () => {
                popUp.style.display = "none"
            })
        }
    }

    if (visibility === "PRIVATE") return null;
    return (
        <tr onClick={gotoLobbyPage}>
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