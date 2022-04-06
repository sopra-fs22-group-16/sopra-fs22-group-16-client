import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import 'styles/views/PublicLobbies.scss';
import BaseContainer from "components/ui/BaseContainer";
import jsonDataLobbies from "./jsonDataLobbies";
import {BlockPopup, Popup} from "../ui/Popup";
import {createTheme, LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const theme = createTheme({
    palette: {
        primary: {
            main: '#FBC12E',
        },
        secondary: {
            main: '#292420',
        }
    },
});

const PublicLobbies = () => {
    const history = useHistory();

    const returnHome = () => {
        history.push('/home-page');
    }

    // TODO - UPDATE WITH JOINBYCODE PAGE
    const joinLobbybyCode = () => {
        history.push('/home-page');
    }

    // TODO - jsonDataLobbies import from REST or whatever
    return (
        <BaseContainer>
            <BlockPopup id="joinLobbyPopUp">Joining lobby<br/><br/><ThemeProvider theme={theme}><LinearProgress color="secondary" /></ThemeProvider></BlockPopup>
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
                    {jsonDataLobbies.map((data, key) => {
                        return (
                                <LobbyInfo
                                    key={key}
                                    id={data.id}
                                    name={data.name}
                                    mode={data.mode}
                                    players={data.players}
                                    capacity={data.capacity}
                                />

                        );
                    })}
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
                    <Button className="secondary-button"

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

const LobbyInfo = ({id, name, mode, players, capacity}) => {

    const history = useHistory();

    // TODO - update with to lobby/id instead
    async function gotoLobbyPage() {

        try {

            const popUp = document.getElementById("joinLobbyPopUp");
            popUp.style.display = "block";

            //**TODO** here we need to call to the backend to join the lobby and set the token (unregistered User)
            // Remove when implementing actual call implemented
            // Simulate joining lobby
            await new Promise(resolve => setTimeout(resolve, 2000));

            // here we mocked the answer of the API create lobby
            const responseBody = {
                "invitationCode": "37-Xfdws3s34",
                "name": name,
                "lobbyId": id,
                "members": [
                    {
                        "id": 1,
                        "name": "Happy Einstein",
                        "ready": false,
                        "team": "1"
                    },
                    {
                        "id": 2,
                        "name": "MR. M",
                        "ready": false,
                        "team": "2"
                    }
                ],
                "owner": 1,
                "visibility": "PUBLIC",
                "mode": "ONE_VS_ONE",
                "ranked": false
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
    if (!name) return <div/>;
    return (

        <tr onClick={() => gotoLobbyPage()}>
            <td>
                {name}
            </td>
            <td>
                {mode}
            </td>
            <td>
                {players}
            </td>
            <td>
                {capacity}
            </td>
        </tr>
    );
};

export default PublicLobbies;

