import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { api } from 'helpers/api';
import 'styles/views/lobby/ShareQRCode.scss';
import BaseContainer from "components/ui/BaseContainer";
import { defaultTheme } from "styles/themes/defaulTheme";
import { ThemeProvider } from "@emotion/react";
import CustomPopUp from "components/ui/CustomPopUp";


const ShareQRCode = ({ id }) => {

    const history = useHistory();

    const [QR, setQR] = useState(null);
    const token = localStorage.getItem("token");

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
        localStorage.removeItem('token');
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
                    localStorage.removeItem('token');
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
                const apiResponse = await api.get(`/v1/game/lobby/${id}/qrcode`,
                    {
                        headers: { 'token': token }
                    }
                );
                setQR(apiResponse.data);

            } catch (error) {
                setGetDataFailed(true);
            }
        }

        fetchData();
    }, [id, token]);

    const goLobby = () => {
        history.push(`/lobby/${id}`);
    }

    const returnHome = () => {
        history.push('/home');
    }

    return (
        <BaseContainer>
            <div className="shareQR">
                <label className="shareQR message">Show this QR code to other players to join your lobbby:</label>
                <img className="shareQR code" src={`data:image/png;base64,${QR}`} alt="" />
                <div className="shareQR buttons">
                    <Button onClick={() => goLobby()}>RETURN TO LOBBY</Button>
                </div>
                <div className="shareQR buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={getDataFailed} information={"Could not get the QR code - Please try again later!"}>
                    <Button onClick={() =>
                        history.push(`/lobby/${id}`)
                    }>
                        Return Lobby
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};

export default ShareQRCode;