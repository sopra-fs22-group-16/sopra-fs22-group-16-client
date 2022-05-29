import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';

import {api} from 'helpers/api';
import BaseContainer from "components/ui/BaseContainer";
import {Button} from 'components/ui/Button';
import CustomPopUp from "components/ui/CustomPopUp";

import 'styles/views/lobby/UpdateLobby.scss';
import Alert from "../../ui/Alert";

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

const UpdateLobby = ({id}) => {

    const history = useHistory();
    const token = localStorage.getItem('token');
    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    const [name, setName] = useState('');
    const [gameMode, setGameMode] = useState(null);
    const [gameType, setGameType] = useState(null);
    const [visibility, setVisibility] = useState(null);

    // PopUps
    const [alert, setAlert] = useState({redraw: false, open: false, message: <div/>})
    const [error, setError] = useState({open: false, message: <div/>});
    const [getDataFailed, setGetDataFailed] = useState(false);

    const unblockRef = useRef(null);
    const allowedFilterList = [
        `/lobby/${id}/update`,
        `/lobby/${id}/invite-users`,
        `/lobby/${id}/share/qr`,
        `/lobby/${id}`
    ];

    const beforeUnloadListener = () => {
        api.delete(`/v1/game/lobby/${id}/player`, {headers: {'token': token || ''}});
        if (!isRegistered) {
            localStorage.removeItem('token');
        }
        localStorage.removeItem('playerId');
    };

    useEffect(() => {
        unblockRef.current = history.block((location) => {
                // Check if new path is in allowed paths
                if (allowedFilterList.includes(location.pathname)) {
                    return true;
                }

                let result = window.confirm(`If you proceed you will leave the lobby? Are you sure you want to leave the page?`);
                if (result) {
                    //Handle leaving page
                    api.delete(`/v1/game/lobby/${id}/player`, {headers: {'token': token || ''}});
                    if (!isRegistered) {
                        localStorage.removeItem('token');
                    }
                    localStorage.removeItem('playerId');
                }
                return result;
            }
        );
        window.addEventListener("beforeunload", beforeUnloadListener, {capture: true});
    }, []);

    // On component unmount unblock history, and remove event listeners
    useEffect(() => () => {
        unblockRef?.current();
        window.removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
    }, []);

    useEffect(() => {
        async function fetchData() {

            const apiResponse = await api.get(`/v1/game/lobby/${id}`,
                {
                    headers: {'token': token}
                }
            );

            //set different values obtained from the API
            setGameMode(apiResponse.data.gameMode);
            setVisibility(apiResponse.data.visibility);
            setName(apiResponse.data.name);
            setGameType(apiResponse.data.gameType);

        }

        fetchData().catch(() => setGetDataFailed(true));
    }, [id, token]);

    //call to the update backend API
    const updateLobby = async () => {

        // here we control that the name lobby field is filled
        if (name === '') {
            setError({open: true, message: <div>You have to enter a lobby name!</div>});
        } else {

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
                        headers: {'token': token}
                    }
                );
                setAlert((prev) => {
                    return {redraw: !prev.redraw, open: true, message: <div>Lobby updated</div>}
                });
            } catch (e) {
                if (e.response != null) {
                    // conflict in lobby name
                    if (e.response.status === 409) {
                        setError({
                            open: true,
                            message: <div> Lobby name assignment is not possible <br/> This name is already taken!
                            </div>
                        });
                    } else if (e.response.status === 400) {
                        setError({
                            open: true,
                            message: <div> All players in the lobby have to be registered in order to play a ranked
                                game! </div>
                        });
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

    // return to the lobby
    const returnLobby = () => {
        history.push(`/lobby/${id}`);
    }

    return (
        <BaseContainer noHeaderIcons={true}>
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
                    {/*
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
                    */}
                    {
                        isRegistered ?
                            <tr>
                                <th>TYPE</th>
                                <td>
                                    <label>
                                        <input id="UNRANKED" className="createLobby check"
                                               checked={gameType === "UNRANKED"}
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
                            :
                            null
                    }
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

            <CustomPopUp open={getDataFailed} information={"Could not get lobby data - Please try again later!"}>
                <Button onClick={() => {
                    unblockRef?.current();
                    history.push('/home');
                }
                }>
                    Return Home
                </Button>
            </CustomPopUp>
            <CustomPopUp open={error.open} information={error.message}>
                <Button onClick={() => setError({open: false, message: <div/>})}>
                    Close
                </Button>
            </CustomPopUp>
            <Alert redraw={alert.redraw} open={alert.open}>{alert.message}</Alert>
        </BaseContainer>
    );
};

export default UpdateLobby;