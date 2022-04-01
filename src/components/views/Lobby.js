import React from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import { getDomain } from 'helpers/getDomain';


const Lobby = props => {

    //we get the information from the creation page
    const location = useLocation();
    const lobbyData = location.state;

    /*this is for mocking the view*/
    const data2 = { totalUsers: "3/4", readyUsers: "2/4" };
    /*we will need to modify the view to call the backend*/

    const history = useHistory();

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
                        <td>{data2.totalUsers}</td>
                    </tr>
                    <tr>
                        <th>USERS READY</th>
                        <td>{data2.readyUsers}</td>
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
                            <tr>
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
