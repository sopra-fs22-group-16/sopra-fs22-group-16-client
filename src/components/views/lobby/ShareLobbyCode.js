import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { api } from 'helpers/api';
import 'styles/views/lobby/ShareLobbyCode.scss';
import BaseContainer from "components/ui/BaseContainer";
import { defaultTheme } from "styles/themes/defaulTheme";
import { ThemeProvider } from "@emotion/react";
import CustomPopUp from "components/ui/CustomPopUp";

const ShareLobbyCode = ({ id }) => {

    const history = useHistory();

    const token = localStorage.getItem('token');
    const [code, setCode] = useState(null);

    // PopUp
    const [getDataFailed, setGetDataFailed] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {
                //TODO I would introduce a separate on the backend for the request of the invitation code
                const apiResponse = await api.get(`/v1/game/lobby/${id}`,
                    {
                        headers: { 'token': token }
                    }
                );

                setCode(apiResponse.data.invitationCode);

            } catch (error) {
                setGetDataFailed(true);
            }
        }
        fetchData();
    }, []);

    const goLobby = () => {
        history.push(`/lobby/${id}`);
    }

    const returnHome = () => {
        history.push('/home');
    }

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(code).then(() => { },
            (err) => {
                console.error('Async: Could not copy text: ', err);
            });
    }

    return (
        <BaseContainer>
            <div className="sharecode">
                <label className="sharecode message">Invite other users to your lobby by sharing the following code:</label>
                <div className="sharecode codecontainer">
                    <div className="sharecode code" onClick={() => copyToClipBoard()}>{code}</div>
                </div>
                <Link
                    className="lobby link"
                    to={`/lobby/${id}/share/qr`}>
                    Generate QR code
                </Link>
                <div className="sharecode space" />
                <div className="sharecode lobby-button">
                    <Button onClick={goLobby}>RETURN TO LOBBY</Button>
                </div>
                <div className="sharecode lobby-button">
                    <Button className="return" onClick={returnHome}>RETURN HOME</Button>
                </div>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={getDataFailed} information={"Could not get the code - Please try again later!"}>
                    <Button onClick={goLobby}>
                        Return Lobby
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};

export default ShareLobbyCode;
