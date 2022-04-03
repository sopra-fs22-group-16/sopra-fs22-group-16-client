import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { Popup } from 'components/ui/Popup';
import { api, handleError } from 'helpers/api';
import 'styles/views/CreateLobby.scss';
import BaseContainer from "components/ui/BaseContainer";


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

    const changeGameMode = (gameMode) => {
        var otherGameMode = null;
        if (gameMode === "ONE_VS_ONE") {
            otherGameMode = document.getElementById("TWO_VS_TWO");

        }
        else{
            otherGameMode = document.getElementById("ONE_VS_ONE");
        }

        if (otherGameMode.checked = true) {
            otherGameMode.checked = false;
        }

        setGameMode(gameMode);
    }

    const changeVisibility = (visibility) => {
        var otherVisibility= null;
        if (visibility === "PUBLIC") {
            otherVisibility = document.getElementById("PRIVATE");

        }
        else {
            otherVisibility = document.getElementById("PUBLIC");
        }

        if (otherVisibility.checked = true) {
            otherVisibility.checked = false;
        }

        setVisibility(visibility);
    }

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
                const response = await api.post('/v1/game/lobby', JSON.stringify(requestBody),
                    {
                        headers: { 'token': '' }
                    }
                );

                var resStatus = response.status;
                const idLobby = response.data.lobby.id;

                history.push({
                    pathname: '/lobby/' + idLobby,
                    state: response.data
                })
            } catch (error) {
                if (resStatus == 409) {
                    const popUp = document.getElementById("invalidUser");
                    popUp.style.display = "block";
                    popUp.addEventListener("click", () => {
                        popUp.style.display = "none"
                    })
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
        history.push('/home-page');
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
                                <input id="ONE_VS_ONE" className="createlobby check" defaultChecked={true} type="checkbox" onClick={() => changeGameMode("ONE_VS_ONE")}/>
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="TWO_VS_TWO" className="createlobby check" type="checkbox" onClick={() => changeGameMode("TWO_VS_TWO")}/>
                                2x2
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>
                            <label>
                                <input id="PUBLIC" className="createlobby check" defaultChecked={true} type="checkbox" onClick={() => changeVisibility("PUBLIC")}/>
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="PRIVATE" className="createlobby check" type="checkbox" onClick={() => changeVisibility("PRIVATE")}/>
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