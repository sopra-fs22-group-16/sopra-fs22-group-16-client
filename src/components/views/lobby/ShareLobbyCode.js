import React, {useState, useEffect, useRef} from 'react';
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
    const isRegistered = localStorage.getItem('isRegistered') === 'true' ? true : false;

    // PopUp
    const [getDataFailed, setGetDataFailed] = useState(false);

    const unblockRef = useRef(null);
    const allowedFilterList = [
        `/lobby/${id}/update`,
        `/lobby/${id}/invite-users`,
        `/lobby/${id}/share/qr`,
        `/lobby/${id}`
    ];

    const beforeUnloadListener = (event) => {
        api.delete(`/v1/game/lobby/${id}/player`, {headers: {'token': token || ''}});
        if (!isRegistered) {
            localStorage.removeItem('token');
        }
        localStorage.removeItem('playerId');
    };

    useEffect(() => {
        unblockRef.current = history.block((location) => {
                // Check if new path is in allowed paths
                if (allowedFilterList.includes(location.pathname)) {
                    return true;
                }

                let result = window.confirm(`If you proceed you will leave the lobby? Are you sure you want to leave the page?`);
                if (result) {
                    //Handle leaving page
                    api.delete(`/v1/game/lobby/${id}/player`, {headers: {'token': token || ''}});
                    if (!isRegistered) {
                        localStorage.removeItem('token');
                    }
                    localStorage.removeItem('playerId');
                }
                return result;
            }
        );
        window.addEventListener("beforeunload", beforeUnloadListener, {capture: true});
    }, []);

    // On component unmount unblock history, and remove event listeners
    useEffect(() => () => {
        unblockRef?.current();
        window.removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
    }, []);


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
        <BaseContainer lobbyBool = {false}>
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
