import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/ScanQRCode.scss';
import BaseContainer from "components/ui/BaseContainer";
import QrReader from 'react-qr-reader'

const ScanQRCode = props => {

    const history = useHistory();

    const [result, setResult] = useState(null);

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
        alert("Error while scanning QR code");
    }

    const handleQRScan = (data) => {
        if (result == null) {
            setResult(data);
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
                <div className="scanqr url">{result}</div>
                <div className="scanqr lobby-buttons">
                    <Button onClick={() => goLobbies()}>RETURN TO LOBBIES</Button>
                </div>
                <div className="scanqr lobby-buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
            </div>
        </BaseContainer>
    );
};

export default ScanQRCode;