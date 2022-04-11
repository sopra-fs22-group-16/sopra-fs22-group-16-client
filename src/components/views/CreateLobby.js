import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { Popup } from 'components/ui/Popup';
import { api } from 'helpers/api';
import 'styles/views/CreateLobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import UserModel from 'models/UserModel';
import Header from "components/views/Header"


const FormField = props => {
    return (
        <div className="createlobby lobby-name">
            <input
                className="createlobby input-name"
                placeholder="enter a name..."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const CreateLobby = props => {

    const history = useHistory();

    const [name, setName] = useState('');
    const [gameMode, setGameMode] = useState("ONE_VS_ONE");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [gameType, setGameType] = useState("UNRANKED");
    const token = null;

    const postLobby = async () => {

        if (name === '') {

            const popUp = document.getElementById("noUser");
            popUp.style.display = "block";
            popUp.addEventListener("click", () => {
                popUp.style.display = "none"
            })

        }
        else {
            try {

                //request body sent to the backend to create a new lobby
                const requestBody = {
                    "name": name,
                    "visibility": visibility,
                    "gameMode": gameMode,
                    "gameType": gameType
                };

                //call to the backend to create a new lobby
                const response = await api.post('/v1/game/lobby', JSON.stringify(requestBody), { headers: { 'token': token || '' } });

                // Get the returned user and update a new object.
                const user = new UserModel(response.data);
                // Store the token into the local storage.
                localStorage.setItem('token', user.token);

                history.push({ pathname: '/lobby/' + user.lobby.id })
            } catch (error) {
                if (error.response != null) {
                    // conflict in lobby name
                    if (error.response.status === 409) {
                        const popUp = document.getElementById("invalidUser");
                        popUp.style.display = "block";
                        popUp.addEventListener("click", () => {
                            popUp.style.display = "none"
                        })
                    }
                    else {
                        console.log(error);
                        const popUp = document.getElementById("technicalError");
                        popUp.style.display = "block";
                        popUp.addEventListener("click", () => {
                            popUp.style.display = "none"
                        })
                    }
                }
                else {
                    const popUp = document.getElementById("technicalError");
                    popUp.style.display = "block";
                    popUp.addEventListener("click", () => {
                        popUp.style.display = "none"
                    })
                }
            }
        }
    }

    const returnHome = () => {
        history.push('/home');
    }

    return (
        <BaseContainer>
            <div className="createlobby">
                <label className="createlobby lobby-title">Create Lobby</label>
                <table className="lobby-info">
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
                                <input id="ONE_VS_ONE" className="createlobby check" checked={gameMode === "ONE_VS_ONE"} type="checkbox" onClick={() => setGameMode("ONE_VS_ONE")} />
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="TWO_VS_TWO" className="createlobby check" checked={gameMode === "TWO_VS_TWO"} type="checkbox" onClick={() => setGameMode("TWO_VS_TWO")} />
                                2x2
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>TYPE</th>
                        <td>
                            <label>
                                <input id="UNRANKED" className="createlobby check" checked={gameType === "UNRANKED"} type="checkbox" onClick={() => setGameType("UNRANKED")} />
                                Unranked
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="RANKED" className="createlobby check" checked={gameType === "RANKED"} type="checkbox" onClick={() => setGameType("RANKED")} />
                                Ranked
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>
                            <label>
                                <input id="PUBLIC" className="createlobby check" checked={visibility === "PUBLIC"} type="checkbox" onClick={() => setVisibility("PUBLIC")} />
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="PRIVATE" className="createlobby check" checked={visibility === "PRIVATE"} type="checkbox" onClick={() => setVisibility("PRIVATE")} />
                                Private
                            </label>
                        </td>
                    </tr>
                </table>
                <div className="createlobby space" />
                <div className="createlobby lobby-buttons">
                    <Button onClick={() => postLobby()}>POST LOBBY</Button>
                </div>
                <div className="createlobby lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
            </div>
            <Popup id="noUser">You have to enter a lobby name!</Popup>
            <Popup id="invalidUser">Lobby name assignment is not possible - name already taken!</Popup>
            <Popup id="technicalError">Ups! Something happened. Try again and if the error persists, contact the administrator.</Popup>
        </BaseContainer>
    );
};

export default CreateLobby;