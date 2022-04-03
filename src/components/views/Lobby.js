import React, { useState }  from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation, Link  } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";

import { api, handleError } from 'helpers/api';


const Lobby = props => {

    const history = useHistory();

    //we get the information from the creation page
    const location = useLocation();
    const [token, setToken] = useState(location.state.token);
    const [lobbyData, setLobbyData] = useState(location.state.lobby);

    //displayed labels
    const displayedMode = lobbyData.gameMode === "ONE_VS_ONE" ? "1v1" : "2v2";
    const displayedVisibility = lobbyData.visibility === "PUBLIC" ? "public" : "private";
    const presentPlayers = lobbyData.players.length;
    const readyPlayers = 0;
    const totalPlayers = lobbyData.gameMode === "ONE_VS_ONE" ? 2 : 4;

    const returnLobbies = () => {
        history.push('/lobbies');
    }

    const returnHome = () => {
        history.push('/home-page');
    }

    const changeStatus = (player) => {
    }

    useEffect(() => {
        async function fetchData() {
            try {

                const apiResponse = await api.get(URL = '/v1/game/lobby/' + lobbyData.id,
                    {
                        headers: { 'token': token }
                    }
                );
                setLobbyData(apiResponse.data);

            } catch (error) {
                alert("Something went wrong! ");
            }
        }
        fetchData();
    }, []);

    return (
        <BaseContainer>
            <div className="lobby">
                <label className="lobby lobby-title">Lobby Information</label>
                <Link
                    className="lobby link"
                    to={{
                        pathname: '/update-lobby/' + lobbyData.id,
                        state: { name: lobbyData.name, visibility: lobbyData.visibility, gameMode: lobbyData.gameMode }
                    }} >
                    update lobby information</Link>
                <table className="lobby-info">
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
                </table>
                <label className="lobby lobby-labels">Click on your row to update your information and player status.</label>
                <table className="player-view">
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
                                    <div className={'lobby teambox team' + user.team} ></div>
                                </td>
                                <td>
                                    <input id={user.id} className="lobby status" type="checkbox" onClick={() => changeStatus(user.ready)} />
                                </td>
                            </tr>
                        )
                    })}
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
