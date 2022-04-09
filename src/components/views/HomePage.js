import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import BaseContainer from "components/ui/BaseContainer";
import hannibal_header from "styles/images/hannibal_header.png"
import hannibal_background from "styles/images/wargroove_bw_light.png"
/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

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

    //<img className = "HomePage full-width" src = {hannibal_background}/>
    return (
        <div className="HomePage container">
            <img className = "HomePage image" src={hannibal_header} width="400" height="100"/>
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
            <div className='HomePage page-extender'></div>
        </div>

    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default HomePage;
