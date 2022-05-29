import React, {useState, useEffect, useRef} from 'react';
import {useHistory, Link, useLocation} from 'react-router-dom';
import {ThemeProvider} from "@emotion/react";

import {api} from 'helpers/api';
import CustomPopUp from "components/ui/CustomPopUp";
import Socket from "components/socket/Socket";
import BaseContainer from "components/ui/BaseContainer";
import {Button} from 'components/ui/Button';
import Countdown from 'components/ui/Countdown';
import LobbyMessageModel from "../../../models/LobbyMessageModel";
import {defaultTheme} from "styles/themes/defaulTheme";

import 'styles/views/lobby/Lobby.scss';
import Alert from "../../ui/Alert";

// form for changing name
const FormName = props => {
    return (
        <div className="buttonIn">
            <input
                className="buttonIn name"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                maxLength={props.maxLength}
            />
            <button
                className="buttonIn button"
                onClick={e => props.onClick(e.target.value)}>
            </button>
        </div>
    );
};

const Lobby = ({id}) => {


    const history = useHistory();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    //we get the information from the creation page
    const [gameType, setGameType] = useState(null);
    const [visibility, setVisibility] = useState(null);
    const [presentPlayers, setPresentPlayers] = useState(null);
    const [readyPlayers, setReadyPlayers] = useState(null);
    const [totalPlayers, setTotalPlayers] = useState(null);
    const [name, setName] = useState(null);
    const [players, setPlayers] = useState(null);
    const [invitationCode, setInvitationCode] = useState(null);
    const [isHost, setIsHost] = useState(null);
    const [playerName, setPlayerName] = useState(null);

    // PopUp
    const [error, setError] = useState({open: false, message: <div/>});
    const [getDataFailed, setGetDataFailed] = useState(false);
    const [playerRemoved, setPlayerRemoved] = useState(false);

    const [alert, setAlert] = useState({redraw: false, open: false, message: <div/>})

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
        unblockRef.current = history.block((loc) => {
                // Check if new path is in allowed paths
                if (allowedFilterList.includes(loc.pathname)) {
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

        // On component unmount unblock history, and remove event listeners
        return () => {
            unblockRef?.current();
            window.removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
        };
    }, []);

    useEffect(() => {
        obtainAndLoadLobbyInfo().catch(() => setGetDataFailed(true));
    }, [id, token]);

    const returnLobbies = () => {
        history.push('/lobby/join');
    }

    const returnHome = () => {
        history.push('/home');
    }

    // change the status of the player when clicking the checkbox
    const changeStatus = async (user) => {
        try {
            if (parseInt(localStorage.getItem("playerId")) === user.id) {
                const requestBody = {
                    "ready": !user.ready
                };
                await api.put(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), {headers: {'token': token || ''}});
            }
        } catch (error) {
            setError({
                open: true,
                message: <div>Ups! Something happened. <br/> Try again and if the error persists, contact the
                    administrator. </div>
            });
        }
    }

    const setNewPlayerName = (newName) => {

        if(newName.length < 11) {
            setPlayerName(newName);
        }

        else {
            setError({open: true, message: <div>The name you are entering is too long! <br /> Please limit yourself to 10 characters. </div>});
        }
    }


    // set new name, let the user know if it's already taken (409)
    const changeName = async (user) => {
        if (!user.ready) {
            if (parseInt(localStorage.getItem("playerId")) === user.id) {
                try {
                    const requestBody = {
                        "name": playerName
                    };
                    await api.put(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), {headers: {'token': token || ''}});
                    setAlert((prev) => {
                        return {redraw: !prev.redraw, open: true, message: <div>Username updated</div>}
                    });
                } catch (error) {
                    if (error.response.status === 409) {
                        setError({open: true, message: <div> This name is already taken! </div>});
                    } else if (error.response.status === 400) {
                        setError({open: true, message: <div> The name should not be empty! </div>});
                    } else {
                        setError({
                            open: true,
                            message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact
                                the administrator. </div>
                        });
                    }
                }
            }
        } else setError({
            open: true,
            message: <div> Changing information after setting ready status is not possible! </div>
        });
    }

    // setting new Name - moving here to determine if the row is a form or not
    const setClassName = (user) => {
        if (user.id === parseInt(localStorage.getItem("playerId")) && !isRegistered) {
            return (
                <td>
                    <FormName
                        value={playerName === null ? user.name : playerName}
                        onChange={newName => setNewPlayerName(newName)}
                        onClick={() => changeName(user)}
                    >
                    </FormName>
                </td>
            )
        } else {
            return (
                <td>{user.name}</td>
            )
        }
    }

    // refresh view when receiving a message from the socket
    const onMessage = (msg) => {
        let message = new LobbyMessageModel(msg);
        if (message.redirectToGame) {
            // Unblock history
            unblockRef?.current();
            history.push(`/game/${id}`);
        } else {
            if (message.removedPlayerIdList?.includes(parseInt(localStorage.getItem("playerId")))) {
                setPlayerRemoved(true);
            }
            if (message.nameChangedOfPlayerWithId === parseInt(localStorage.getItem("playerId"))) {
                setError({
                    open: true,
                    message: <div>A registered user with the same name as you has joined the lobby. <br/> We have thus
                        changed to your name!</div>
                });

            }
            obtainAndLoadLobbyInfo().catch(() => setGetDataFailed(true));
        }

    }


    //action after the countdown ends
    const createGame = async () => {
        if (isHost) {
            try {
                await api.post(`/v1/game/match/${id}`, JSON.stringify({}), {headers: {'token': token || ''}});
            } catch (error) {
                setError({
                    open: true,
                    message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact
                        the administrator. </div>
                });
                notReady().catch(() => notReady().catch(
                    () => setError({
                        open: true,
                        message: <div> Ups! Something happened. <br/> Try again and if the error persists,
                            contact
                            the administrator. </div>
                    })));
            }
        }
    }

    //action to stop the counter
    const notReady = async () => {
        const requestBody = {
            "ready": false
        };
        await api.put(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), {headers: {'token': token || ''}});
    }

    const obtainAndLoadLobbyInfo = async () => {
        const apiResponse = await api.get(`/v1/game/lobby/${id}`,
            {
                headers: {'token': token}
            }
        );

        const apiResponsePlayers = apiResponse.data.players;

        //set different values obtained from the API
        setVisibility(apiResponse.data.visibility);
        setPresentPlayers(apiResponsePlayers.length);
        setIsHost(apiResponse.data.hostId === parseInt(localStorage.getItem("playerId")));
        setReadyPlayers(apiResponsePlayers.filter(p => p.ready === true).length);
        setTotalPlayers(apiResponse.data.gameMode === 'ONE_VS_ONE' ? 2 : 4);
        setGameType(apiResponse.data.gameType);
        setName(apiResponse.data.name);
        setPlayers(apiResponse.data.players);
        setInvitationCode(apiResponse.data.invitationCode);
        setPlayerName(apiResponse.data.players.find((player) => player.id === parseInt(localStorage.getItem("playerId"))).name);


        // Check if a game is already running, then redirect to the game
        if (apiResponse.data.gameRunning) {
            unblockRef?.current();
            history.push(`/game/${id}`);
        }
    }

    return (
        <BaseContainer noHeaderIcons={true}>
            <div className="lobby">
                <label className="lobby lobby-title">Lobby Information</label>
                {
                    // Only show update link to host
                    isHost ? <Link
                        className="lobby link"
                        onClick={() => notReady().catch(
                            () => setError({
                                open: true,
                                message: <div> Ups! Something happened. <br/> Try again and if the error persists,
                                    contact
                                    the administrator. </div>
                            }))}
                        to={`${id}/update`}>
                        update lobby information</Link> : null
                }
                <table className="lobby-info">
                    <tbody>
                    <tr>
                        <th>NAME</th>
                        <td nowrap={"true"} style={{overflow: 'hidden', 'maxWidth': '0'}}>{name}</td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>{visibility === "PUBLIC" ? "public" : "private"}</td>
                    </tr>
                    {/*
                    <tr>
                        <th>MODE</th>
                        <td>{gameMode === "ONE_VS_ONE" ? "1v1" : "2v2"}</td>
                    </tr>
                    */}
                    <tr>
                        <th>TYPE</th>
                        <td>{gameType === "RANKED" ? "ranked" : "casual"}</td>
                    </tr>
                    <tr>
                        <th>PLAYERS</th>
                        <td>{presentPlayers + '/' + totalPlayers}</td>
                    </tr>
                    <tr>
                        <th>READY</th>
                        <td>{readyPlayers + '/' + totalPlayers}</td>
                    </tr>
                    </tbody>
                </table>
                <label className="lobby lobby-labels">Click on your row to update your information and
                    player
                    status.</label>
                <table className="player-view">
                    <tbody>
                    <tr>
                        <th>PLAYER</th>
                        <th>TEAM</th>
                        <th>STATUS</th>
                    </tr>
                    {players ? players.map((user) => {
                        return (
                            <tr key={user.id}
                                style={user.id === parseInt(localStorage.getItem("playerId")) ? {background: '#787878'} : {}}>
                                {setClassName(user)}
                                <td>
                                    <div className={'lobby teambox team' + user.team}/>
                                </td>
                                <td>
                                    <input id={user.id} className="lobby status" type="checkbox"
                                           style={{cursor: parseInt(localStorage.getItem("playerId")) === user.id ? 'pointer' : 'default'}}
                                           checked={user.ready}
                                           onChange={() => {
                                               // This is intentional
                                               // A input field provided a `checked` prop requires an `onChange` handler.
                                           }}
                                           onClick={() => changeStatus(user)}
                                           maxLength={10}
                                    />
                                </td>
                            </tr>
                        )
                    }) : null}
                    </tbody>
                </table>
                {
                    //Only show invite users link if invitationCode is known and the player is the host.
                    invitationCode && isHost ? <Link
                        className="lobby link"
                        to={`${id}/invite-users`}>
                        invite users</Link> : null
                }
                <div className="lobby lobby-buttons">
                    <Button onClick={() => returnLobbies()}>RETURN TO LOBBIES</Button>
                </div>
                <div className="lobby lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
                <div className={"lobby spacer"}/>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={getDataFailed}
                             information={"Could not get lobby data - Please try again later!"}>
                    <Button onClick={() => {
                        unblockRef?.current();
                        history.push('/home');
                    }
                    }>
                        Return Home
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={playerRemoved}
                             information={"Sorry, you have been removed from this lobby due to a change of game size! You will be redirected back to the home page."}>
                    <Button onClick={() => {
                        if (!isRegistered) {
                            localStorage.removeItem('token');
                        }
                        localStorage.removeItem('playerId');
                        unblockRef?.current();
                        history.push('/home')
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
            </ThemeProvider>
            <Socket
                topics={location.pathname}
                onMessage={onMessage}
            />
            {
                // the timer is displayed when all players are ready
                readyPlayers === totalPlayers && totalPlayers != null ?
                    <Countdown
                        duration={5} size={120}
                        content={"Lobby complete! Game loading ..."}
                        onComplete={createGame}
                        buttonMessage={"Not ready"}
                        onClick={notReady}
                    /> : null
            }

            <Alert redraw={alert.redraw} open={alert.open}>{alert.message}</Alert>
        </BaseContainer>
    );
};

export default Lobby;