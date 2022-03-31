import React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";


const Lobby = props => {


    /*this is for mocking the view*/
    const data = [
        { id: 1, player: "Penguin1", team: "RED", status: "READY" },
        { id: 2, player: "RandonUser1", team: "BLUE", status: "NOT READY" },
        { id: 3, player: "CSSSucks93", team: "RED", status: "READY" },
        { id: 4, player: "", team: "", status: "" },
    ]
    const data2 = { name: "Vindica", access: "private", mode: "2X2", totalUsers: "3/4", readyUsers: "2/4" };
    /*we will need to modify the view to call the backend*/

    const history = useHistory();

    const returnLobbies = () => {
        history.push('/lobbies');
    }

    const returnHome = () => {
        history.push('/home-page');
    }

    const changeStatus = (player) => {
        if (player !== null) {
            const btn = document.getElementById(player);
            const status = btn.innerText
            status === 'READY' ? btn.innerText = "NOT READY" : btn.innerText = "READY";
        }
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
            <div className="lobby">
                <label className="lobby lobby-title">Lobby Information</label>
                <table className="lobby-info">
                    <tr>
                        <th>LOBBY NAME</th>
                        <td>{data2.name}</td>
                    </tr>
                    <tr>
                        <th>ACCESS</th>
                        <td>{data2.access}</td>
                    </tr>
                    <tr>
                        <th>MODE</th>
                        <td>{data2.mode}</td>
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
                        <th>#</th>
                        <th>PLAYER</th>
                        <th>TEAM</th>
                        <th>STATUS</th>
                    </tr>
                    {data.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val.id}</td>
                                <td>{val.player}</td>
                                <td>{val.team}</td>
                                <td>
                                    <button id={val.player} className="lobby status-button" onClick={() => changeStatus(val.player)}>{val.status}</button>
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
