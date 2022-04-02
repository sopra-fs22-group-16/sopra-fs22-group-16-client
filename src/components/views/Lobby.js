import React from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation, Link  } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";


const Lobby = props => {

    const history = useHistory();

    //we get the information from the creation page
    const location = useLocation();
    const lobbyData = location.state;

    // TODO: change this with data obtained from the API
    const totalUsers = lobbyData.mode === '1V1' ? 2 : 4;
    const readyUsers = lobbyData.members.length;

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
                //let socket = new WebSocket(getDomain());
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
                        pathname: '/update-lobby/' + lobbyData.lobbyId,
                        state: { name: lobbyData.name, mode: lobbyData.mode, visibility: lobbyData.visibility }
                    }} >
                    update lobby information</Link>
                <table className="lobby-info">
                    <tr>
                        <th>NAME</th>
                        <td>{lobbyData.name}</td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>{lobbyData.visibility}</td>
                    </tr>
                    <tr>
                        <th>MODE</th>
                        <td>{lobbyData.mode}</td>
                    </tr>
                    <tr>
                        <th>USERS PRESENT</th>
                        <td>{readyUsers + '/' + totalUsers}</td>
                    </tr>
                    <tr>
                        <th>USERS READY</th>
                        <td>{readyUsers + '/' + totalUsers}</td>
                    </tr>
                </table>
                <label className="lobby lobby-labels">Click on your row to update your information and player status.</label>
                <table className="player-view">
                    <tr>
                        <th>PLAYER</th>
                        <th>TEAM</th>
                        <th>STATUS</th>
                    </tr>
                    {lobbyData.members.map((user) => {
                        return (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>
                                    <div className={'lobby teambox team' + user.team} ></div>
                                </td>
                                <td>
                                    <input id={user.id} className="lobby status" type="checkbox" onClick={() => changeStatus(user.status)} />
                                </td>
                            </tr>
                        )
                    })}
                </table>
                <Link
                    className="lobby link"
                    to={'/lobby/invite-users/' + lobbyData.lobbyId}>
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
