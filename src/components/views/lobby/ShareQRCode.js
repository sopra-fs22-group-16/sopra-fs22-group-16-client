import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/lobby/ShareQRCode.scss';
import BaseContainer from "components/ui/BaseContainer";


const ShareQRCode = ({ id }) => {

    const history = useHistory();

    const [QR, setQR] = useState('');

    useEffect(() => {
        async function fetchData() {

            // TODO: integrate view with java API and get the QR code
            setQR('https://api.qrserver.com/v1/create-qr-code/?data=http://www.google.com');

        }
        fetchData();
    }, []);

    const goBack = () => {
        history.goBack();
    }

    const returnHome = () => {
        history.push('/home');
    }

    return (
        <BaseContainer>
            <div className="shareqr">
                <label className="shareqr message">Show this QR code to other players to join your lobbby:</label>
                <div className="shareqr qrcontainer">
                    <img className="shareqr code" src={QR} alt="" />
                </div>
                <div className="shareqr lobby-buttons">
                    <Button onClick={() => goBack()}>GO BACK</Button>
                </div>
                <div className="shareqr lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
            </div>
        </BaseContainer>
    );
};

export default ShareQRCode;