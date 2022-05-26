import React from 'react';
import {useHistory} from 'react-router-dom';

import {Button} from 'components/ui/Button';
import Header from "components/ui/Header";
import hannibal_background from 'styles/images/wargroove_bw_light.png'
import info_icon from 'styles/images/info/info_icon.png'

import 'styles/views/HomePage.scss';

const HomePage = () => {
    const history = useHistory();

    const goJoinLobby = () => {
        history.push('/lobby/join');
    }

    const goCreateLobby = () => {
        history.push('/lobby/create');
    }

    const loginUser = () => {
        history.push('/user/login');
    }

    const goLeaderboard = () => {
        history.push('/leaderboard');
    }

    const goInfoPage = () => {
        history.push('/info');
    }

    return (
        <div className={"HomePage baseContainer"}>
            <img src={hannibal_background} className={"HomePage backgroundImage"} alt={""}/>
            <div className="HomePage container">
                <Header className={"HomePage image"}/>
                <div className={"HomePage button-container-container"}>
                    <div className="HomePage button-container">
                        <Button
                            width="100%"
                            onClick={() => goJoinLobby()}
                        >
                            JOIN LOBBY
                        </Button>
                    </div>
                    <div className="HomePage button-container">
                        <Button
                            width="100%"
                            onClick={() => goCreateLobby()}
                        >
                            CREATE LOBBY
                        </Button>
                    </div>
                    <div className={"HomePage userButton-container"}>
                        <div className="HomePage button-container">
                            <Button
                                width="100%"
                                onClick={() => goLeaderboard()}
                            >
                                LEADERBOARD
                            </Button>
                        </div>
                        <div className="HomePage button-container">
                            <Button className="primary-button register"
                                    width="100%"
                                    onClick={() => loginUser()}
                            >
                                SIGN IN/CREATE USER
                            </Button>
                        </div>
                    </div>
                </div>
                <img src={info_icon} onClick={() => goInfoPage()}  className={"HomePage infoIcon"} alt={""} />
            </div>
        </div>
    );
};

export default HomePage;
