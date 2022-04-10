import React, {useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import {api} from 'helpers/api';
import BaseContainer from "components/ui/BaseContainer";
import DynamicPopUp from "../ui/DynamicPopUp";
import defaultTheme from "../../styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";

import 'styles/views/UpdateLobby.scss';

const FormField = props => {
    return (
        <div className="updateLobby lobby-name">
            <input
                className="updateLobby input-name"
                placeholder="enter a name..."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const UpdateLobby = () => {

    const history = useHistory();

    //we get the information from the lobby
    const location = useLocation();
    const lobbyData = location.state.lobby;
    const token = location.state.token;

    const [name, setName] = useState(lobbyData.name);
    const [gameMode, setGameMode] = useState(lobbyData.gameMode);
    const [gameType, setGameType] = useState(lobbyData.gameType);
    const [visibility, setVisibility] = useState(lobbyData.visibility);
    const [id] = useState(lobbyData.id);
    const [errorMessage, setErrorMessage] = useState("");
    const [updating, setUpdating] = useState(false);

    //call to the update backend API
    const updateLobby = async () => {
        // here we control that the name lobby field is filled
        if (name === '') {

            setErrorMessage("You have to enter a lobby name!");

        } else {

            try {

                setUpdating(true);

                //request body sent to the backend to update a lobby
                const requestBody = {
                    "name": name,
                    "gameMode": gameMode,
                    "gameType": gameType,
                    "visibility": visibility
                };

                //call to the backend to update a lobby
                await api.put(`/v1/game/lobby/${id}`, JSON.stringify(requestBody),
                    {
                        headers: {'token': token}
                    }
                );

                // Fake a longer call to give the user feedback
                await new Promise(resolve => setTimeout(resolve, 500));

                setUpdating(false);
            } catch (error) {
                setUpdating(false);
                if (error.response.status === 409) {
                    setErrorMessage("Lobby name assignment is not possible - name already taken!");
                } else if (error.response.status === 418) {
                    setErrorMessage("Can not set game type to ranked as there are unregistered users in your lobby.")
                } else {
                    setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.")
                }
            }
        }
    }

    // return to the lobby
    const returnLobby = () => {
        history.goBack();
    }

    return (
        <BaseContainer>
            <div className="updateLobby">
                <label className="updateLobby lobby-title">Update Lobby</label>
                <table className="lobby-info">
                    <tbody>
                    <tr>
                        <th>NAME</th>
                        <td colSpan="2">
                            <FormField
                                value={name}
                                onChange={un => setName(un)}>
                            </FormField>
                        </td>
                    </tr>
                    <tr>
                        <th>MODE</th>
                        <td>
                            <label>
                                <input id="ONE_VS_ONE" className="updateLobby check" checked={gameMode === "ONE_VS_ONE"}
                                       type="checkbox" onChange={() => setGameMode("ONE_VS_ONE")}/>
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="TWO_VS_TWO" className="updateLobby check" checked={gameMode === "TWO_VS_TWO"}
                                       type="checkbox" onChange={() => setGameMode("TWO_VS_TWO")}/>
                                2x2
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>TYPE</th>
                        <td>
                            <label>
                                <input id="UNRANKED" className="createLobby check" checked={gameType === "UNRANKED"}
                                       type="checkbox" onChange={() => setGameType("UNRANKED")}/>
                                Unranked
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="RANKED" className="createLobby check" checked={gameType === "RANKED"}
                                       type="checkbox" onChange={() => setGameType("RANKED")}/>
                                Ranked
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>
                            <label>
                                <input id="PUBLIC" className="updateLobby check" checked={visibility === "PUBLIC"}
                                       type="checkbox" onChange={() => setVisibility("PUBLIC")}/>
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="PRIVATE" className="updateLobby check" checked={visibility === "PRIVATE"}
                                       type="checkbox" onChange={() => setVisibility("PRIVATE")}/>
                                Private
                            </label>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="updateLobby space"/>
                <div className="updateLobby lobby-buttons">
                    <Button onClick={() => updateLobby()}>UPDATE LOBBY</Button>
                </div>
                <div className="updateLobby lobby-buttons">
                    <Button className="return" onClick={() => returnLobby()}>RETURN LOBBY</Button>
                </div>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <DynamicPopUp open={updating} information={"Updating Lobby"}>
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
        </BaseContainer>
    );
};

export default UpdateLobby;
