import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import {api} from 'helpers/api';
import BaseContainer from "components/ui/BaseContainer";
import {defaultTheme} from "styles/themes/defaulTheme";
import CustomPopUp from "components/ui/CustomPopUp";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import LobbyModel from "../../models/LobbyModel";

import 'styles/views/CreateLobby.scss';


const FormField = props => {
    return (
        <div className="createLobby lobby-name">
            <input
                className="createLobby input-name"
                placeholder="enter a name..."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const CreateLobby = () => {

    const history = useHistory();


    const token = localStorage.getItem('token');
    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    const [name, setName] = useState('');
    const [gameMode, setGameMode] = useState("ONE_VS_ONE");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [gameType, setGameType] = useState("UNRANKED");
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState({open: false, message: <div/>});

    const postLobby = async () => {

        if (name === '') {
            setError({open: true, message: <div> You have to enter a lobby name! </div>});
        } else {
            try {

                setCreating(true);

                //request body sent to the backend to create a new lobby
                const requestBody = {
                    "name": name,
                    "visibility": visibility,
                    "gameMode": gameMode,
                    "gameType": gameType
                };

                //call to the backend to create a new lobby
                const response = await api.post('/v1/game/lobby', JSON.stringify(requestBody), {headers: {'token': token || ''}});

                let lobby = new LobbyModel(response.data.lobby);

                // Store the token and playerId into the local storage,
                // if the player is registered, we maintain their token.
                if (!isRegistered) {
                    localStorage.setItem('token', response.data.token);
                }
                localStorage.setItem('playerId', response.data.playerId);

                history.push({pathname: '/lobby/' + lobby.id})
            } catch (error) {

                setCreating(false);

                if (error.response != null) {
                    // conflict in lobby name
                    if (error.response.status === 409) {
                        setError({
                            open: true,
                            message: <div> Lobby name assignment is not possible <br/> This name already taken! </div>
                        });
                    } else if (error.response.status === 401) {
                        setError({
                            open: true,
                            message: <div> It is necessary to be register in order to play a ranked game. </div>
                        });
                        setGameType("UNRANKED");
                    } else if (error.response.status === 403) {
                        setError({
                            open: true,
                            message: <div> It looks like your authentication is wrong <br /> We will log you out automatically. </div>
                        });
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        localStorage.removeItem('isRegistered');
                        setGameType("UNRANKED");
                    } else {
                        setError({
                            open: true,
                            message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact
                                the administrator. </div>
                        });
                    }
                } else {
                    setError({
                        open: true,
                        message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact the
                            administrator. </div>
                    });
                }
            }
        }
    }

    const returnHome = () => {
        history.push('/home');
    }

    return (
        <BaseContainer>
            <div className="createLobby">
                <label className="createLobby lobby-title">Create Lobby</label>
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
                    {/*
                    <tr>
                        <th>MODE</th>
                        <td>
                            <label>
                                <input id="ONE_VS_ONE" className="createLobby check"
                                       checked={gameMode === "ONE_VS_ONE"} type="checkbox"
                                       onChange={() => setGameMode("ONE_VS_ONE")}/>
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="TWO_VS_TWO" className="createLobby check"
                                       checked={gameMode === "TWO_VS_TWO"} type="checkbox"
                                       onChange={() => setGameMode("TWO_VS_TWO")}/>
                                2x2
                            </label>
                        </td>
                    </tr>
                    */}
                    <tr>
                        <th>TYPE</th>
                        <td>
                            <label>
                                <input id="UNRANKED" className="createLobby check" checked={gameType === "UNRANKED"}
                                       type="checkbox" onChange={() => setGameType("UNRANKED")}/>
                                Casual
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
                                <input id="PUBLIC" className="createLobby check" checked={visibility === "PUBLIC"}
                                       type="checkbox" onChange={() => setVisibility("PUBLIC")}/>
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="PRIVATE" className="createLobby check" checked={visibility === "PRIVATE"}
                                       type="checkbox" onChange={() => setVisibility("PRIVATE")}/>
                                Private
                            </label>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="createLobby space"/>
                <div className="createLobby lobby-buttons">
                    <Button onClick={() => postLobby()}>POST LOBBY</Button>
                </div>
                <div className="createLobby lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={creating} information={"Creating Lobby"}>
                    <div style={{width: '100%'}}>
                        <LinearProgress color="primary"/>
                    </div>
                </CustomPopUp>
                <CustomPopUp open={error.open} information={error.message}>
                    <Button onClick={() => setError({open: false, message: <div/>})}>
                        Close
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};

export default CreateLobby;