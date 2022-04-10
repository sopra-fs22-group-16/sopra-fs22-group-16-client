import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import {api} from 'helpers/api';
import BaseContainer from "components/ui/BaseContainer";
import UserModel from 'models/UserModel';
import Header from "components/views/Header"
import CustomPopUp from "../ui/CustomPopUp";

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

    const [name, setName] = useState('');
    const [gameMode, setGameMode] = useState("ONE_VS_ONE");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [gameType, setGameType] = useState("UNRANKED");
    const [errorMessage, setErrorMessage] = useState("");
    const token = null;

    const postLobby = async () => {

        if (name === '') {
            setErrorMessage("You have to enter a lobby name!");
        } else {
            try {

                //request body sent to the backend to create a new lobby
                const requestBody = {
                    "name": name,
                    "visibility": visibility,
                    "gameMode": gameMode,
                    "gameType": gameType
                };

                //call to the backend to create a new lobby
                const response = await api.post('/v1/game/lobby', JSON.stringify(requestBody), {headers: {'token': token || ''}});

                // Get the returned user and update a new object.
                const user = new UserModel(response.data);
                // Store the token into the local storage.
                localStorage.setItem('token', user.token);

                history.push({pathname: '/lobby/' + user.lobby.id})
            } catch (error) {
                if (error.response != null) {
                    // conflict in lobby name
                    if (error.response.status === 409) {
                        setErrorMessage("Lobby name assignment is not possible - name already taken!");
                    } else {
                       setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.")
                    }
                } else {
                    setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.")
                }
            }
        }
    }

    const returnHome = () => {
        history.push('/home');
    }

    return (
        <BaseContainer>
            <Header/>
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
            <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                <Button onClick={() =>
                    setErrorMessage("")
                }>
                    Close
                </Button>
            </CustomPopUp>
        </BaseContainer>
    );
};

export default CreateLobby;