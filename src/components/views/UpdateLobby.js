import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { Popup } from 'components/ui/Popup';
import 'styles/views/UpdateLobby.scss';
import BaseContainer from "components/ui/BaseContainer";


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

const UpdateLobby = props => {

    const history = useHistory();

    //we get the information from the lobby
    const location = useLocation();
    const lobbyData = location.state;

    const [name, setName] = useState(lobbyData.name);
    const [gameMode, setGameMode] = useState(lobbyData.gameMode);
    const [visibility, setVisibility] = useState(lobbyData.visibility);

    //default values for checkboxes
    const gameModeDef1 = gameMode === "ONE_VS_ONE" ? true : false;
    const gameModeDef2 = gameMode === "TWO_VS_TWO" ? true : false;
    const modeVis1 = visibility === "PUBLIC" ? true : false;
    const modeVis2 = visibility === "PRIVATE" ? true : false;


    //control to avoid both gameMode checkboxes to be clicked at the same time
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

    //control to avoid both visibility checkboxes to be clicked at the same time
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

    //call to the update backend API
    const updateLobby = () => {

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
                    "visibility": visibility
                };

                //call to the backend to update a lobby
                alert(JSON.stringify(requestBody));

            } catch (error) {
                alert("Something went wrong! ");
            }
        }
    }

    // return to the lobby
    const returnLobby = () => {
        history.goBack();
    }

    return (
        <BaseContainer>
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
                                <input id="ONE_VS_ONE" className="updatelobby check" defaultChecked={gameModeDef1} type="checkbox" onClick={() => changeGameMode("ONE_VS_ONE")}/>
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="TWO_VS_TWO" className="updatelobby check" defaultChecked={gameModeDef2} type="checkbox" onClick={() => changeGameMode("TWO_VS_TWO")}/>
                                2x2
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>
                            <label>
                                <input id="PUBLIC" className="updatelobby check" defaultChecked={modeVis1} type="checkbox" onClick={() => changeVisibility("PUBLIC")}/>
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="PRIVATE" className="updatelobby check" defaultChecked={modeVis2} type="checkbox" onClick={() => changeVisibility("PRIVATE")}/>
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
        </BaseContainer>
    );
};

export default UpdateLobby;
