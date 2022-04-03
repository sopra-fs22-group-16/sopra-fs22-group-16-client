import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import 'styles/views/PublicLobbies.scss';
import BaseContainer from "components/ui/BaseContainer";
import jsonDataLobbies from "./jsonDataLobbies";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const PublicLobbies = () => {
  const history = useHistory();

  const returnHome = () => {
    history.push('/home-page');
  }

  // TODO - UPDATE WITH JOINBYCODE PAGE
  const joinLobbybyCode = () => {
    history.push('/home-page');
  }

  // TODO - jsonDataLobbies import from REST or whatever
  return (
    <BaseContainer>
      <div className="PublicLobbies container">
      <label className = "PublicLobbies h1"> Public Lobbies </label> 
      <h2> Click on one of the lobbies to join</h2>
      <table className= "PublicLobbies table">
      <tr className = "top">

<th>Lobby name</th>
<th>game mode</th>
<th>players</th>
<th>capacity</th>
</tr>
</table>
<table className= "PublicLobbies table">
        {jsonDataLobbies.map((data, key) => {
          return (
            <div key={key}>
              <LobbyInfo
                key={key}
                name={data.name}
                mode={data.mode}
                players={data.players}
                capacity={data.capacity}
              />
            </div>
          );
        })}
        </table>
        <div className="PublicLobbies button-container">
            <Button
              width="100%"
              onClick={() => joinLobbybyCode()}
            >
              JOIN A LOBBY BY CODE
            </Button>
            </div>
            <div className="PublicLobbies button-container">
            <Button className = "secondary-button return"
              
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

  const LobbyInfo = ({ name, mode, players, capacity }) => {

  const history = useHistory();

  // TODO - update with to lobby/id instead
  const gotoLobbyPage = () => {
    history.push('/home-page');
  }
        if (!name) return <div />;
        return (
              <tr onClick={() => gotoLobbyPage()}>
                <td>
                  {name}
                </td>
                <td>
                  {mode}
                </td>
                <td>
                  {players}
                </td>
                <td>
                  {capacity}
                </td>
              </tr>
        );
      };

export default PublicLobbies;

