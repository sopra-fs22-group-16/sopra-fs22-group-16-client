import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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

            //request body sent to the backend to update a lobby
            const requestBody = {
                "name": name,
                "mode": mode,
                "visibility": access
            };

            //call to the backend to update a lobby
            alert(JSON.stringify(requestBody));

        }
    }

    const returnHome = () => {
        history.push('/home-page');
    }

    return (
        <BaseContainer>
            <div className="updatelobby">
                <label className="updatelobby lobby-title">Update Lobby</label>
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
                                <input id="1V1" className="updatelobby check" defaultChecked={true} type="checkbox" onClick={() => changeMode("1V1")}/>
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="2V2" className="updatelobby check" type="checkbox" onClick={() => changeMode("2V2")}/>
                                2x2
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>
                            <label>
                                <input id="public" className="updatelobby check" defaultChecked={true} type="checkbox" onClick={() => changeAccess("public")}/>
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="private" className="updatelobby check" type="checkbox" onClick={() => changeAccess("private")}/>
                                Private
                            </label>
                        </td>
                    </tr>
                </table>
                <div className="updatelobby space" />
                <div className="updatelobby lobby-buttons">
                    <Button onClick={() => postLobby()}>UPDATE LOBBY</Button>
                </div>
                <div className="updatelobby lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN LOBBY</Button>
                </div>
            </div>
        </BaseContainer>
    );
};

export default UpdateLobby;
