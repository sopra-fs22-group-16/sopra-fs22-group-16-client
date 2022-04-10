import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { api } from 'helpers/api';
import 'styles/views/UpdateLobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from 'components/ui/Button';
import { Popup } from 'components/ui/Popup';
import Header from "components/views/Header"


const FormField = props => {
    return (
        <div className="updatelobby lobby-name">
            <input
                className="updatelobby input-name"
                placeholder="enter a name..."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const UpdateLobby = ({ id }) => {

    const history = useHistory();

    const token = localStorage.getItem('token');

    const [name, setName] = useState(null);
    const [gameMode, setGameMode] = useState(null);
    const [gameType, setGameType] = useState(null);
    const [visibility, setVisibility] = useState(null);


    useEffect(() => {
        async function fetchData() {
            try {

                const apiResponse = await api.get(`/v1/game/lobby/${id}`,
                    {
                        headers: { 'token': token }
                    }
                );

                //set different values obtained from the API
                setGameMode(apiResponse.data.gameMode);
                setVisibility(apiResponse.data.visibility);
                setName(apiResponse.data.name);
                setGameType(apiResponse.data.gameType);

            } catch (error) {
                const popUp = document.getElementById("technicalError");
                popUp.style.display = "block";
                popUp.addEventListener("click", () => {
                    popUp.style.display = "none"
                })
            }
        }
        fetchData();
    }, []);

    //call to the update backend API
    const updateLobby = async () => {

        // here we control that the name lobby field is filled
        if (name === '') {

            const popUp = document.getElementById("noUser");
            popUp.style.display = "block";
            popUp.addEventListener("click", () => {
                popUp.style.display = "none"
            })

        }
        else {

            try {

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
                        headers: { 'token': token }
                    }
                );

                const popUp = document.getElementById("updatedLobby");
                popUp.style.display = "block";
                popUp.addEventListener("click", () => {
                    popUp.style.display = "none"
                })

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

    // return to the lobby
    const returnLobby = () => {
        history.goBack();
    }

    return (
        <BaseContainer>
            <Header />
            <div className="updatelobby">
                <label className="updatelobby lobby-title">Update Lobby</label>
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
                                <input id="ONE_VS_ONE" className="updatelobby check" checked={gameMode === "ONE_VS_ONE"} type="checkbox" onClick={() => setGameMode("ONE_VS_ONE")} />
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="TWO_VS_TWO" className="updatelobby check" checked={gameMode === "TWO_VS_TWO"} type="checkbox" onClick={() => setGameMode("TWO_VS_TWO")} />
                                2x2
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>TYPE</th>
                        <td>
                            <label>
                                <input id="UNRANKED" className="createLobby check" checked={gameType === "UNRANKED"} type="checkbox" onClick={() => setGameType("UNRANKED")} />
                                Unranked
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="RANKED" className="createLobby check" checked={gameType === "RANKED"} type="checkbox" onClick={() => setGameType("RANKED")} />
                                Ranked
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>
                            <label>
                                <input id="PUBLIC" className="updatelobby check" checked={visibility === "PUBLIC"} type="checkbox" onClick={() => setVisibility("PUBLIC")} />
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="PRIVATE" className="updatelobby check" checked={visibility === "PRIVATE"} type="checkbox" onClick={() => setVisibility("PRIVATE")} />
                                Private
                            </label>
                        </td>
                    </tr>
                </table>
                <div className="updatelobby space" />
                <div className="updatelobby lobby-buttons">
                    <Button onClick={() => updateLobby()}>UPDATE LOBBY</Button>
                </div>
                <div className="updatelobby lobby-buttons">
                    <Button className="return" onClick={() => returnLobby()}>RETURN LOBBY</Button>
                </div>
            </div>
            <Popup id="noUser">You have to enter a lobby name!</Popup>
            <Popup id="invalidUser">Lobby name assignment is not possible - name already taken!</Popup>
            <Popup id="technicalError">Ups! Something happened. Try again and if the error persists, contact the administrator.</Popup>
            <Popup id="updatedLobby">Lobby correctly updated!</Popup>
        </BaseContainer>
    );
};

export default UpdateLobby;