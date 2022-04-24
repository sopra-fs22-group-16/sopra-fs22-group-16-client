import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/ScanQRCode.scss';
import BaseContainer from "components/ui/BaseContainer";
import QrReader from 'react-qr-reader'
import {api, handleError} from 'helpers/api';
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import CustomPopUp from "../ui/CustomPopUp";
import {defaultTheme} from "../../styles/themes/defaulTheme";

const ScanQRCode = props => {

    const history = useHistory();
    const [result, setResult] = useState(null);
    const token = null;
    const[isJoining, setJoining] = useState(false);
    const[errorMessage, setErrorMessage] = useState("");

    const ValidateCode = async(codeInput) => {
    
        // un.length-(lobbySeparator+1) == lengthCode && lobbySeparator > 0
        // here, needs to extract code ID and check for 10 digits after -
        // /Long id = Long.parseLong(invitationCode.substring(0, invitationCode.length()-(10+1)));
        const lobbySeparator = codeInput.indexOf("-");
        
    
            // extract ID
            const id = codeInput.substring(0, lobbySeparator);
    
         
            try {
    
                //request body sent to the backend to create a new lobby
                const requestBody = {
                    "invitationCode": codeInput,
                };
    
    
                //call to the backend to post the player with the attempted password
                const response = await api.post(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), {headers: {'token': token || ''}});
    
    
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

    const goLobbies = () => {
        history.goBack();
    }

    const returnHome = () => {
        history.push('/home');
    }

    // QR scanner configuration

    const QRDelay = 100;

    const QRStyle = {
        height: 240,
        width: 320
    }

    const handleQRError = () => {
        setErrorMessage("Error in the scanning of the QR code!");
    }

    const handleQRScan = (data) => {

        if (result == null) {
            setResult(data);
        }

        ValidateCode(result);
    }

    return (
        <BaseContainer>
            <div className="scanqr">
                <label className="scanqr message">Please allow access to the camera first to be able to scan the QR code:</label>
                <div className="scanqr container">
                    <QrReader
                        className="scanqr scanner"
                        delay={QRDelay}
                        style={QRStyle}
                        onError={handleQRError}
                        onScan={handleQRScan}
                    />                    
                </div>                
                <div className="scanqr url">{result}</div>
                <div className="scanqr lobby-buttons">
                    <Button onClick={() => goLobbies()}>RETURN TO LOBBIES</Button>
                </div>
                <div className="scanqr lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
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

export default ScanQRCode;