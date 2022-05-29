import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import QrReader from 'react-qr-reader'
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";

import {api} from 'helpers/api';
import UserModel from 'models/UserModel';
import CustomPopUp from "components/ui/CustomPopUp";
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";

import {defaultTheme} from "styles/themes/defaulTheme";
import 'styles/views/ScanQRCode.scss';

const ScanQRCode = () => {

    const token = localStorage.getItem('token');
    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    const history = useHistory();
    const [result, setResult] = useState(null);
    const [isJoining, setJoining] = useState(false);
    const [error, setError] = useState({open: false, message: <div/>});
    const [isValidated, setIsValidated] = useState(false);

    const ValidateCode = async () => {

        const codeInput = result.substring(result.indexOf('?data=') + 6);
        // extract id
        const lobbySeparator = codeInput.indexOf("-");
        const id = codeInput.substring(0, lobbySeparator);

        //request body sent to the backend to create a new lobby
        const requestBody = {
            "invitationCode": codeInput,
        };

        //call to the backend to post the player with the attempted password
        const response = await api.post(`/v1/game/lobby/${id}/player`, JSON.stringify(requestBody), {headers: {'token': token || ''}});

        // Get the returned user and update a new object.
        const user = new UserModel(response.data);
        if (!isRegistered) {
            localStorage.setItem('token', user.token);
        }
        localStorage.setItem('playerId', user.id);

        setJoining(true);
        //just to make more interesting the joining
        await new Promise(r => setTimeout(r, 2000));
        history.push({pathname: '/lobby/' + id});
    }

    const goLobbies = () => {
        history.push('/lobby/join');
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
        setError({open: true, message: <div> Error in the scanning of the QR code! </div>});
    }

    const handleQRScan = (data) => {
        if (result == null) {
            setResult(data);
        } else {
            //once the code is validated, we dont call again to the validation function
            if (!isValidated) {
                ValidateCode().catch(handleErrorMessage);
                setIsValidated(true);
            }
        }
    }

    const handleErrorMessage = (e) => {
        if (e.response !== null) {
            // conflict in lobby name
            if (e.response.status === 404) {
                setError({open: true, message: <div> This lobby does not seem to be live! </div>});
            } else if (e.response.status === 401) {
                setError({
                    open: true,
                    message: <div> It is necessary to be registered in order to play a ranked game. </div>
                });
            } else if (e.response.status === 403) {
                setError({
                    open: true,
                    message: <div> It looks like your authentication is wrong <br /> We will log you out automatically. </div>
                });
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('isRegistered');
            } else if (e.response.status === 409) {
                setError({open: true, message: <div> This lobby is already full!</div>});
            } else if (e.response.status === 400) {
                setError({open: true, message: <div> The code does not match the lobby!</div>});
            } else {
                setError({
                    open: true,
                    message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact the
                        administrator.</div>
                });
            }
        } else {
            setError({
                open: true,
                message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact the
                    administrator.</div>
            });
        }

        // if there's an error, we reset the values to scan again the qr code
        setIsValidated(false);
        setResult(null);
    }

    return (
        <BaseContainer>
            <div className="scanqr">
                <label className="scanqr message">Please allow access to the camera first to be able to scan the QR
                    code:</label>
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
                    <div style={{width: '100%'}}>
                        <LinearProgress color="primary"/>
                    </div>
                </CustomPopUp>
                <CustomPopUp open={error.open} information={error.message}>
                    <Button onClick={() => setError({open: false, message: <div/>})}>
                        Close
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};

export default ScanQRCode;