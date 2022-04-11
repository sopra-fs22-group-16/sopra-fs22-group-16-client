import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/views/LobbyByCode.scss';
import BaseContainer from "components/ui/BaseContainer";
import { useHistory, useLocation, Link } from 'react-router-dom';
import jsonDataLobbies from './lobby/jsonDataLobbies';


// form of code
const FormField = props => {
  return (
      <div>
          <input
              className="LobbyByCode input-name"
              placeholder="enter code here..."
              value={props.value}
              onChange={e => props.onChange(e.target.value)}
          />
      </div>
  );
};

const LobbyByCode = () => {
  const history = useHistory();
  const [codeInput, setCodeInput] = useState(null);
  const lengthCode = 8;
  //const [validCodes, setValidCodes] = useState(null);
  const [lobbies, setLobbies] = useState(null);

  // TODO - to change this to an API call  
  //const ValidCodes = ["ABCDEFGH", "AAAAAAAA", "HANNIBAL"]
  const ValidCodes = () => {
    //const response = await api.get('/v1/game/lobbies');
    //setLobbies(response.data);
    const Codes = [];
    jsonDataLobbies.map(lobby =>(
      Codes.push(lobby.invitationCode)

    ))

    //setValidCodes(Codes);
    return Codes
  }

  var validCodes = ValidCodes();

  //TODO - find lobby of the ID
  const findLobbyID = (un) => {
    var lobbyNumber = validCodes.index(un);
    return jsonDataLobbies[lobbyNumber].id;
  }

  const ValidateCode = (un) => {

    setCodeInput(un);

    // automatically enters the code if it is 8 digits
    if(un.length === lengthCode) {
       
      if(validCodes.includes(un)) {
        //alert("MATCHED");
        // TODO - check if the lobby is still active? not complete? Will follow logic in server when completed
        // TODO - update with the ID of the lobby that matches - through GET LOBBIES, all passwords and match id?
        //var matchedID = findLobbyID(un);
        //alert("CONNECTING TO LOBBY ID "+matchedID)
        //var lobbyLink = `/lobby/${matchedID}`

        // TODO - post player
        //history.push(lobbyLink)
        alert("MATCHED");
        history.push('lobby/1');
      }

      else {
        alert("Check Code!")
      }
    }

  }



  return (
        <BaseContainer>
            <div className="LobbyByCode container">
                <h2 className=' LobbyByCode h2'> To join a private lobby, enter  the provided 8-digit code in the field below and press Join:</h2>
                <FormField
                    value={codeInput}
                    onChange={un => ValidateCode(un)}>
                </FormField>
                <Link className="LobbyByCode link"
                    to={{
                        pathname: '/join_QR'}}>
                    Join using a QR code instead</Link>
                <div className="LobbyByCode button-container">
                    <Button
                        width="100%"
                        onClick={() =>  history.push('/public-lobbies')}
                    >
                    RETURN TO PUBLIC LOBBIES
                    </Button>
                </div>
                <div className="LobbyByCode button-container">
                    <Button className = "secondary-button return"
                        width="100%"
                        onClick={() => history.push('/home')}
                        >
                        RETURN HOME
                    </Button>
                </div>
            </div>
        </BaseContainer>
  );
};

export default LobbyByCode;
