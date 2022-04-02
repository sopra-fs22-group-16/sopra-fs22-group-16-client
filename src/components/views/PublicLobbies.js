import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import 'styles/views/PublicLobbies.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */


const PublicLobbies = props => {
  const history = useHistory();

  const returnHome = () => {
    history.push('/home-page');
  }


  // TO UPDATE - WITH LOBBY PAGE
  const joinLobby = () => {
    // change status from ONLINE to OFFLINE
    history.push('/home-page');
  }

  

  return (
    <BaseContainer>
      <div className="HomePage container">
      <h1> Public Lobbies </h1> 
      <h2> Click on one of the lobbies to join</h2>
      <table className = "PublicLobbies table">
      <tr className = "top">
    <th>Lobby name</th>
    <th>game mode</th>
    <th>players</th>
    <th>capacity</th>
  </tr>
  <tr>
    <td>Peter</td>
    <td>Griffin</td>
    <td>Lois</td>
    <td>Griffin</td>
  </tr>
  <tr><td>Peter</td>
    <td>Griffin</td>
    <td>Lois</td>
    <td>Griffin</td></tr>
  <tr><td>Peter</td>
    <td>Griffin</td>
    <td>Lois</td>
    <td>Griffin</td></tr>
  <tr><td>Peter</td>
    <td>Griffin</td>
    <td>Lois</td>
    <td>Griffin</td></tr>
  <tr><td>Peter</td>
    <td>Griffin</td>
    <td>Lois</td>
    <td>Griffin</td></tr>
  <tr><td>Peter</td>
    <td>Griffin</td>
    <td>Lois</td>
    <td>Griffin</td></tr>
      </table>
          <div className="HomePage button-container">
            <Button
              width="100%"
              onClick={() => joinLobby()}
            >
              JOIN LOBBY
            </Button>
            </div>
            <div className="HomePage button-container">
            <Button className = "secondary-button"
              
              width="100%"
              onClick={() => returnHome()}
            >
              RETURN HOME
            </Button>
        
          </div>
        </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default PublicLobbies;
