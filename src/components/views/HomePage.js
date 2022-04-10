import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import Header from "../ui/Header";

import hannibal_background from 'styles/images/wargroove_bw_light.png'

import 'styles/views/HomePage.scss';

const HomePage = () => {
    const history = useHistory();

    const goJoinLobby = () => {
        // change status from ONLINE to OFFLINE
        history.push('/public-lobbies');
    }

    const goCreateLobby = () => {
        // change status from ONLINE to OFFLINE
        history.push('/create-lobby');
    }

    return (
        <div className={"HomePage baseContainer"}>
            <img src={hannibal_background} className={"HomePage backgroundImage"}/>
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
                </div>
            </div>
        </div>
    );
};

export default HomePage;
