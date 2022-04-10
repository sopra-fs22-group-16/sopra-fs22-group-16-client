import React, {useState, useEffect} from 'react';
import {useHistory, useLocation, Link} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import {api} from 'helpers/api';
import DynamicPopUp from "../ui/DynamicPopUp";

import 'styles/views/Lobby.scss';

const Lobby = () => {

    const history = useHistory();

    //we get the information from the creation page
    const location = useLocation();
    const [token] = useState(location.state.token);
    const [lobbyData, setLobbyData] = useState(location.state.lobby);
    const [errorMessage, setErrorMessage] = useState("");

    //displayed labels
    const displayedMode = lobbyData.gameMode === "ONE_VS_ONE" ? "1v1" : "2v2";
    const displayedVisibility = lobbyData.visibility === "PUBLIC" ? "public" : "private";
    const presentPlayers = lobbyData.players.length;
    const readyPlayers = 0;
    const totalPlayers = lobbyData.gameMode === "ONE_VS_ONE" ? 2 : 4;

    const returnLobbies = () => {
        history.push('/public-lobbies');
    }

    const returnHome = () => {
        history.push('/home');
    }

    const changeStatus = (player) => {

    }

    useEffect(() => {
        async function fetchData() {
            try {
                let url = '/v1/game/lobby/' + lobbyData.id;
                const apiResponse = await api.get(url,
                    {
                        headers: {'token': token}
                    }
                );
                setLobbyData(apiResponse.data);

            } catch (error) {
                if (error.response.status === 403) {
                    setErrorMessage("You have to join the lobby first before accessing it");
                } else if (error.response.status === 404) {
                    setErrorMessage("The lobby you are looking for was not found");
                } else {
                    setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.")
                }
            }
        }

        fetchData().then();
    }, []);

    if (errorMessage !== '')
        return (
            <DynamicPopUp open={errorMessage !== ''} information={errorMessage}>
                <Button onClick={() =>
                    history.push('/home')
                }>
                    Return Home
                </Button>
            </DynamicPopUp>
        );
    else
        return (
            <BaseContainer>
                <div className="lobby">
                    <label className="lobby lobby-title">Lobby Information</label>
                    <Link
                        className="lobby link"
                        to={{
                            pathname: '/update-lobby/' + lobbyData.id,
                            state: {
                                lobby: {
                                    name: lobbyData.name,
                                    visibility: lobbyData.visibility,
                                    gameMode: lobbyData.gameMode,
                                    gameType: lobbyData.gameType,
                                    id: lobbyData.id
                                },
                                token: token
                            }
                        }}>
                        update lobby information</Link>
                    <table className="lobby-info">
                        <tbody>
                        <tr>
                            <th>NAME</th>
                            <td>{lobbyData.name}</td>
                        </tr>
                        <tr>
                            <th>ACCESS</th>
                            <td>{displayedVisibility}</td>
                        </tr>
                        <tr>
                            <th>MODE</th>
                            <td>{displayedMode}</td>
                        </tr>
                        <tr>
                            <th>USERS PRESENT</th>
                            <td>{presentPlayers + '/' + totalPlayers}</td>
                        </tr>
                        <tr>
                            <th>USERS READY</th>
                            <td>{readyPlayers + '/' + totalPlayers}</td>
                        </tr>
                        </tbody>
                    </table>
                    <label className="lobby lobby-labels">Click on your row to update your information and player
                        status.</label>
                    <table className="player-view">
                        <tbody>
                        <tr>
                            <th>PLAYER</th>
                            <th>TEAM</th>
                            <th>STATUS</th>
                        </tr>
                        {lobbyData.players.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>
                                        <div className={'lobby teambox team' + user.team}/>
                                    </td>
                                    <td>
                                        <input id={user.id} className="lobby status" type="checkbox"
                                               onClick={() => changeStatus(user.ready)}/>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <Link
                        className="lobby link"
                        to={'/lobby/invite-users/' + lobbyData.id}>
                        invite users</Link>
                    <div className="lobby lobby-buttons">
                        <Button onClick={() => returnLobbies()}>RETURN TO LOBBIES</Button>
                    </div>
                    <div className="lobby lobby-buttons">
                        <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                    </div>
                </div>
            </BaseContainer>
        );
};

export default Lobby;