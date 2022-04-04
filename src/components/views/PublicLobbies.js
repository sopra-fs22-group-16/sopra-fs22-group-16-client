import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import 'styles/views/PublicLobbies.scss';
import BaseContainer from "components/ui/BaseContainer";
import jsonDataLobbies from "./jsonDataLobbies";
import {useEffect} from "react";
import Header from './Header';

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */


const PublicLobbies = () => {
  const history = useHistory();
  //const RESTDataLobbies = api.get(URL = '/v1/game/lobbies/');
  const [lobbyData, setLobbyData] = useState(null);

  const returnHome = () => {
    history.push('/home-page');
  }


  // TODO - UPDATE WITH JOINBYCODE PAGE
  const joinLobbybyCode = () => {
    history.push('/join-code');
  }

  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get('/v1/game/lobby/1');

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)

        // Get the returned users and update the state.
        //setLobbyData(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        //alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, []);

  let content = null;

  if (jsonDataLobbies) {
    content = (
      <div>
          {jsonDataLobbies.map((data, key) => (
          <div key={key}>
          <LobbyInfo
            id = {data.id}
            key={key}
            name={data.name}
            mode={data.mode}
            players={data.players}
            visibility = {data.visibility}
          />
        </div>
          ))}
        
      </div>
    );
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
        {content}
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

  const LobbyInfo = ({id, name, mode, players, visibility}) => {

  const history = useHistory();
  const displayedMode = mode === "ONE_VS_ONE" ? "1v1" : "2v2";
  const presentPlayers = players.length;
  const totalPlayers = mode === "ONE_VS_ONE" ? 2 : 4;

  var userlink = `/lobby/${id}`

        if (visibility == "PRIVATE") return <div />;
        return (
              <tr onClick={() =>  history.push(userlink)}>
                <td>
                  {name}
                </td>
                <td>
                  {displayedMode}
                </td>
                <td>
                  {presentPlayers}
                </td>
                <td>
                  {totalPlayers}
                </td>
              </tr>
        );
      };

export default PublicLobbies;

