import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import Header from "../ui/Header";
import 'styles/views/HomePage.scss';

const HomePage = () => {
    const history = useHistory();

    const goJoinLobby = () => {
        history.push('/public-lobbies');
    }

    const goCreateLobby = () => {
        history.push('/create-lobby');
    }

    //<img className = "HomePage full-width" src = {hannibal_background}/>
    return (
        <div className="HomePage container">
            <Header className={"HomePage image"}/>
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
            <div className='HomePage page-extender'/>
        </div>

    );
};

export default HomePage;
