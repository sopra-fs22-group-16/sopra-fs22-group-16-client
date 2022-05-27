import React, {useState} from 'react';
import {api} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/views/LobbyByCode.scss';
import BaseContainer from "components/ui/BaseContainer";
import {useHistory, Link} from 'react-router-dom';
import {defaultTheme} from "../../styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import CustomPopUp from "../ui/CustomPopUp";
import UserModel from 'models/UserModel';

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

    const token = localStorage.getItem('token');
    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    const history = useHistory();
    const [codeInput, setCodeInput] = useState("");
    const lengthCode = 10;
    const [isJoining, setJoining] = useState(false);
    const [error, setError] = useState({open: false, message: <div/>});


    const checkCode = async () => {
        const lobbySeparator = codeInput.indexOf("-");
        if (codeInput.length - (lobbySeparator + 1) === lengthCode && lobbySeparator > 0) {
            const id = codeInput.substring(0, lobbySeparator);
            validateCode(id).catch(handleErrorMessage);
        } else {
            setError({open: true, message: <div>The provided lobby code is not valid!</div>})
        }
    }

    const handleErrorMessage = (e) => {
        if (e.response !== null) {
            // conflict in lobby name
            if (e.response.status === 404) {
                setError({open: true, message: <div> This lobby does not seem to be live! </div>});
            } else if (e.response.status === 403) {
                setError({open: true, message: <div> This lobby is only available for registered users!</div>});
            } else if (e.response.status === 409) {
                setError({open: true, message: <div> This lobby is already full!</div>});
            } else {
                setError({open: true, message: <div> The code does not match the lobby!</div>})
            }
        } else {
            setError({
                open: true,
                message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact the
                    administrator.</div>
            });
        }
    }

    const validateCode = async (id) => {
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


    return (
        <BaseContainer>
            <div className="LobbyByCode container">
                <h2 className=' LobbyByCode h2'> To join a private lobby, enter the provided code in the field
                    below:</h2>

                <FormField
                    value={codeInput}
                    onChange={e => setCodeInput(e)}
                >
                </FormField>
                <Link className="LobbyByCode link"
                      to={{
                          pathname: '/lobby/join/qr'
                      }}>
                    Join using a QR code instead</Link>
                <div className="LobbyByCode button-container">
                    <Button
                        disabled={codeInput.length === 0}
                        width="100%"
                        onClick={() => checkCode()}
                    >
                        VALIDATE CODE
                    </Button>
                </div>
                <div className="LobbyByCode button-container">
                    <Button
                        width="100%"
                        onClick={() => history.push('/lobby/join')}
                    >
                        RETURN TO PUBLIC LOBBIES
                    </Button>
                </div>
                <div className="LobbyByCode button-container">
                    <Button className="secondary-button return"
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
                <CustomPopUp open={error.open} information={error.message}>
                    <Button onClick={() =>
                        setError({open: false, message: <div/>})
                    }>
                        Close
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};

export default LobbyByCode;

