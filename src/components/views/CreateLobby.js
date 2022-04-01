import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
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

    const [name, setName] = useState(null);
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
        alert("Mode: " + mode + "; Visibility: " + access + "; Visibility: " + name);
    }

    const returnHome = () => {
        history.push('/home-page');
    }

    useEffect(() => {
        async function fetchData() {
            try {

            } catch (error) {
                alert("Something went wrong! ");
            }
        }
        fetchData();
    }, []);

    return (
        <BaseContainer>
            <div className="createlobby">
                <label className="createlobby lobby-title">Create Lobby</label>
                <table className="lobby-info">
                    <tr>
                        <th>LOBBY NAME</th>
                        <td>
                            <FormField
                                value={name}
                                onChange={un => setName(un)}>
                            </FormField>
                        </td>
                    </tr>
                    <tr>
                        <th>GAME MODE</th>
                        <td>
                            <label>
                                <input id="1V1" defaultChecked={true} type="checkbox" onClick={() => changeMode("1V1")}/>
                                1x1
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="2V2" type="checkbox" onClick={() => changeMode("2V2")}/>
                                2x2
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>
                            <label>
                                <input id="public" defaultChecked={true} type="checkbox" onClick={() => changeAccess("public")}/>
                                Public
                            </label>
                        </td>
                        <td>
                            <label>
                                <input id="private" type="checkbox" onClick={() => changeAccess("private")}/>
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
