import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/views/LobbyByCode.scss';
import BaseContainer from "components/ui/BaseContainer";
import { useHistory, Link } from 'react-router-dom';
import {defaultTheme} from "../../styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import CustomPopUp from "../ui/CustomPopUp";

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
  const lengthCode = 10;;
  const[isJoining, setJoining] = useState(false);
  const[errorMessage, setErrorMessage] = useState("");
  const token = null;


const checkLength = (un) => {
setCodeInput(un);
const lobbySeparator = un.indexOf("-");
if(un.length -(lobbySeparator+1) == 10 && lobbySeparator > 0) {
    const id = un.substring(0, lobbySeparator);
    ValidateCode(id);
}
setCodeInput(null);
}

const ValidateCode = async(id) => {

        try {

            //request body sent to the backend to create a new lobby
            const requestBody = {
                "invitationCode": codeInput,
            };


            //call to the backend to post the player with the attempted password
            const response = await api.post(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), {headers: {'token': token || ''}});

            // Get the returned user and update a new object.
            //const user = new UserModel(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', response.data.token);

            setJoining(isJoining);
            new Promise(resolve => setTimeout(resolve, 500));
            history.push({pathname: '/lobby/' + id});
        } catch (error) {
            if (error.response != null) {
                // conflict in lobby name
                if (error.response.status == 404) {
                    setErrorMessage("This lobby does not seem to be live!");
                } 
                
                else if (error.response.status == 409) {
                   setErrorMessage("This lobby is already full!");
                }

                else {
                    setErrorMessage("The password does not match the lobby!")
                }

            } else {
                setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.");
                
            }
      }


    }


  return (
        <BaseContainer>
            <div className="LobbyByCode container">
                <h2 className=' LobbyByCode h2'> To join a private lobby, enter  the provided code in the field below:</h2>
            
                <FormField 
                    value={codeInput}
                    onChange={un => checkLength(un)}
                    >
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
