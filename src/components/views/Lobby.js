import React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";


const Lobby = props => {


    /*this is for mocking the view*/
    const data = [
        { id: 1, player: "Penguin1", team: "red"},
        { id: 2, player: "RandonUser1", team: "blue"},
        { id: 3, player: "CSSSucks93", team: "red"}
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
                        <th>PLAYER</th>
                        <th>TEAM</th>
                        <th>STATUS</th>
                    </tr>
                    {data.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val.player}</td>
                                <td>
                                    <div className={'lobby teambox ' + val.team} ></div>
                                </td>
                                <td>
                                    <input id={val.player} className="lobby status" type="checkbox" onClick={() => changeStatus(val.player)} />
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
