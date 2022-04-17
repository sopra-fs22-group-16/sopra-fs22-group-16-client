import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/views/LobbyByCode.scss';
import BaseContainer from "components/ui/BaseContainer";
import { useHistory, useLocation, Link } from 'react-router-dom';
import jsonDataLobbies from './lobby/jsonDataLobbies';
import {BlockPopup, Popup} from "../ui/Popup";
import {defaultTheme} from "../../styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import CustomPopUp from "../ui/CustomPopUp";
import UserModel from "../../models/UserModel";

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
  const lengthCode = 10;
  const [validCodes, setValidCodes] = useState(null);
  const [lobbiesData, setLobbyData] = useState(null);
  const[lobbyId, setLobbyId] = useState(null);
  const[isJoining, setJoining] = useState(false);
  const[errorMessage, setErrorMessage] = useState("");
  const[getDataFailed, setGetDataFailed] = useState(false);


  useEffect(() => {
    async function fetchData() {
        try {
            // TODO: Switch as soon as implemented
            //const response = await api.get('/v1/game/lobby');
            const response = jsonDataLobbies;

            setLobbyData(response);
            const Codes = [];
            const Ids = [];
            response.map(lobby =>(
            Codes.push(lobby.invitationCode)

    ))

    setValidCodes(Codes);

        } catch (error) {
          setGetDataFailed(true);
        }
    }

    fetchData();
}, []);
  

/*
  //maybe TODO - find lobby of the ID
  const findLobbyID = (un) => {
    const lobbyNumber = validCodes.index(un);
    setLobbyId(lobbiesData[lobbyNumber].id);
  }
  */

  const ValidateCode = (un) => {

    setCodeInput(un);

    // automatically enters the code if it is the right number of digits
    if(un.length === lengthCode) {
       
      if(validCodes.includes(un)) {
        // TODO - select correct id of the lobby + add player to the lobby
        // right now just finds the ID of the lobby and pushes that page
        setJoining(isJoining);
        new Promise(resolve => setTimeout(resolve, 500));
        history.replace('lobby/1');
      }

      else {
        setErrorMessage("The Code does not seem to corresponnd to an existing lobby. Please check with the lobby owner");
      }
    }

  }



  return (
        <BaseContainer>
            <div className="LobbyByCode container">
                <h2 className=' LobbyByCode h2'> To join a private lobby, enter  the provided 10-digit code in the field below:</h2>
                <FormField
                    value={codeInput}
                    onChange={un => ValidateCode(un)}>
                </FormField>
                <Link className="LobbyByCode link"
                    to={{
                        pathname: '/lobby/scan/QR'}}>
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
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={isJoining} information={"Joining Lobby"}>
                    <div style={{width: '100%'}}>
                        <LinearProgress color="primary"/>
                    </div>
                </CustomPopUp>
                <CustomPopUp open={getDataFailed} information={"Could not get lobby data - Please try again later!"}>
                    <Button onClick={() =>
                        history.push('/home')
                    }>
                        Return Home
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                    <Button onClick={() =>
                        setErrorMessage("")
                    }>
                        Close
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
  );
};

export default LobbyByCode;
