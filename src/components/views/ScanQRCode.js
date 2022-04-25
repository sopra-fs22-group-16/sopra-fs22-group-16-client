import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader'
import { LinearProgress } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

import { api } from 'helpers/api';
import UserModel from 'models/UserModel';
import CustomPopUp from "components/ui/CustomPopUp";
import { Button } from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";

import { defaultTheme } from "styles/themes/defaulTheme";
import 'styles/views/ScanQRCode.scss';

const ScanQRCode = props => {

    const history = useHistory();
    const [result, setResult] = useState(null);
    const [isJoining, setJoining] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isValidated, setIsValidated] = useState(false);

    const ValidateCode = async () => {

        const codeInput = result.substring(result.indexOf('?data=') + 6);
        // extract id
        const lobbySeparator = codeInput.indexOf("-");
        const id = codeInput.substring(0, lobbySeparator);

        try {

            //request body sent to the backend to create a new lobby
            const requestBody = {
                "invitationCode": codeInput,
            };

            //call to the backend to post the player with the attempted password
            const response = await api.post(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), { headers: { 'token': '' } });

            // Get the returned user and update a new object.
            const user = new UserModel(response.data);
            localStorage.setItem('token', user.token);
            localStorage.setItem('playerId', user.id);

            setJoining(true);
            //just to make more interesting the joining
            await new Promise(r => setTimeout(r, 2000));
            history.push({ pathname: '/lobby/' + id });

        } catch (error) {
            if (error.response != null) {
                if (error.response.status === 404) {
                    setErrorMessage("This lobby does not seem to be live!");
                }
                else if (error.response.status === 409) {
                    setErrorMessage("This lobby is already full!");
                }
                else {
                    setErrorMessage("The password does not match the lobby!")
                }
            } else {
                setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.");
            }

            // if there's an error, we reset the values to scan again the qr code
            setIsValidated(false);
            setResult(null);
        }
    }

    const goLobbies = () => {
        history.push('/public-lobbies');
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
        else {
            //once the code is validated, we dont call again to the validation function
            if (!isValidated) {
                ValidateCode();
                setIsValidated(true);
            }
        }
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
                <div className="scanqr lobby-buttons">
                    <Button onClick={() => goLobbies()}>RETURN TO LOBBIES</Button>
                </div>
                <div className="scanqr lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={isJoining} information={"Joining Lobby"}>
                    <div style={{ width: '100%' }}>
                        <LinearProgress color="primary" />
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