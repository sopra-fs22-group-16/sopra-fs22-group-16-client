import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { Popup } from 'components/ui/Popup';
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
    const [mode, setMode] = useState("1V1");
    const [access, setAccess] = useState("public");

    const changeMode = (mode) => {
        var otherMode = null;
        if (mode === "1V1") {
            otherMode = document.getElementById("2V2");

        }
        else{
            otherMode = document.getElementById("1V1");
        }

        if (otherMode.checked = true) {
            otherMode.checked = false;
        }

        setMode(mode);
    }

    const changeAccess = (access) => {
        var otherAccess= null;
        if (access === "public") {
            otherAccess = document.getElementById("private");

        }
        else {
            otherAccess = document.getElementById("public");
        }

        if (otherAccess.checked = true) {
            otherAccess.checked = false;
        }

        setAccess(access);
    }

    const postLobby = () => {

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
                    "mode": mode,
                    "visibility": access
                };

                //**TODO** here we need to call to the backend to create the lobby

                // here we mocked the answer of the API create lobby
                const responseBody = {
                    "invitationCode": "37-Xfdws3s34",
                    "name": requestBody.name,
                    "lobbyId": 37,
                    "members": [
                        {
                            "id": 1,
                            "name": "Happy Einstein",
                            "ready": false,
                            "team": "1"
                        }
                    ],
                    "owner": 1,
                    "visibility": requestBody.visibility,
                    "mode": requestBody.mode,
                    "chatId": 11,
                    "ranked": false
                };

                history.push({
                    pathname: '/lobby/' + responseBody.lobbyId,
                    state: responseBody
                })
            } catch (error) {
                //**TODO** control errors after call to the backend to create the lobby
                alert("Something went wrong! ");
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
                <Popup id="noUser">You have to enter a lobby name!</Popup>
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
                                <input id="1V1" className="createlobby check" defaultChecked={true} type="checkbox" onClick={() => changeMode("1V1")}/>
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="2V2" className="createlobby check" type="checkbox" onClick={() => changeMode("2V2")}/>
                                2x2
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>
                            <label>
                                <input id="public" className="createlobby check" defaultChecked={true} type="checkbox" onClick={() => changeAccess("public")}/>
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="private" className="createlobby check" type="checkbox" onClick={() => changeAccess("private")}/>
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
        </BaseContainer>
    );
};

export default CreateLobby;
