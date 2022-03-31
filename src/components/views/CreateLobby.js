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
const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const CreateLobby= props => {
  const history = useHistory();
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, name});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const goJoinLobby = () => {
    // change status from ONLINE to OFFLINE
    history.push('/game/dashboard');
  }

  const goCreateLobby = () => {


    // change status from ONLINE to OFFLINE
    history.push('/game/dashboard');
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
              onClick={() => doLogin()}
            >
              JOIN LOBBY
            </Button>
            </div>
            <div className="HomePage button-container">
            <Button className = "secondary-button"
              
              width="100%"
              onClick={() => doLogin()}
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
export default CreateLobby;
