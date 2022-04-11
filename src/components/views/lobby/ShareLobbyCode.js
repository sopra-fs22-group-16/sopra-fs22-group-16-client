import React, { useState, useEffect } from 'react';
import { useHistory, Link, useParams, useLocation } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { Popup } from 'components/ui/Popup';
import { api, handleError } from 'helpers/api';
import 'styles/views/lobby/ShareLobbyCode.scss';
import BaseContainer from "components/ui/BaseContainer";

const ShareLobbyCode = ({ id }) => {
    const history = useHistory();

    //passing lobby id from url parameters instead of using java script state
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [code, setCode] = useState(location.code);


    useEffect(() => {
        async function fetchData() {
            try {
                const apiResponse = await api.get(URL = '/v1/game/lobby/' + id,
                    {
                        headers: { 'token': token}
                    }
                    );
                setCode(apiResponse.data.invitationCode);
            } catch (error) {
                setCode("Something went wrong! ");
                //alert("Something went wrong! ");
             }
        }
        fetchData();
    }, []);

    const goBack = () => {
        history.goBack();
    }

    const returnHome = () => {
        history.push('/home');
    }

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(code).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    return (
        <BaseContainer>
            <div className="sharecode">
                <label className="sharecode message">Invite other users to your lobby by sharing the following code with them:</label>
                <div className="sharecode codecontainer">
                    <div className="sharecode code" onClick={() => copyToClipBoard()}>{code}</div>
                </div>
                <Link
                                    className="lobby link"
                                    to={{pathname: '/lobby/' + id + '/share/qr'  , token: token}}>
                                    Generate QR code</Link>
                <div className="sharecode lobby-button">
                    <Button onClick={goBack}>GO BACK</Button>
                </div>
                <div className="sharecode lobby-button">
                    <Button className="return" onClick={returnHome}>RETURN HOME</Button>
                </div>
            </div>
        </BaseContainer>
    );
};

export default ShareLobbyCode;
