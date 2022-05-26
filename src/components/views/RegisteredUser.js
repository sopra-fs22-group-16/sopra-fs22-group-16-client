import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeProvider } from "@emotion/react";
import { api } from 'helpers/api';
import RegisteredUserModel from 'models/RegisteredUserModel'

import CustomPopUp from "components/ui/CustomPopUp";
import { Button } from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField"

import { defaultTheme } from "styles/themes/defaulTheme";
import 'styles/views/LoginRegisterUser.scss';

const RegisteredUser = ({ id }) => {

    const history = useHistory();
    const [userData, setUserData] = useState({
        id: null,
        username: null,
        rankedScore: null,
        wins: null,
        losses: null
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem("userId");
    const isRegistered = localStorage.getItem('isRegistered') === 'true' ? true : false;

    useEffect(() => {
        loadUserData();
    }, []);

    const returnHome = () => {
        history.push('/home');
    };

    const loadUserData = async () => {
        try {
            const response = await api.get(`/v1/users/${id}`);
            const userInfo = new RegisteredUserModel(response.data);
            setUserData(userInfo);
        }
        catch (error) {
            setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.");
        }
    }

    const updateData = async () => {
        try {
            const requestBody = JSON.stringify({ username, password });
            await api.put(
                `/v1/users/${id}`,
                requestBody,
                { headers: { 'token': token || '' } });
            loadUserData();
            setIsEditing(false);
        }
        catch (error) {
            setErrorMessage("Ups! Something happened. Try again and if the error persists, contact the administrator.");
        }
    }

    return (
        <BaseContainer>
            <div className="LoginRegisterUser">
                <h1 className="LoginRegisterUser h1">User information</h1>
                <table className="user">
                    <tr>
                        <th>
                            username
                        </th>
                        <td>
                            {userData.username}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            ranked score
                        </th>
                        <td>
                            {userData.rankedScore}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            wins
                        </th>
                        <td>
                            {userData.wins}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            losses
                        </th>
                        <td>
                            {userData.losses}
                        </td>
                    </tr>
                </table>
                <div className="LoginRegisterUser space" />
                {
                    isRegistered && parseInt(userId) === id ?
                        <div className="LoginRegisterUser buttons">
                            <Button onClick={() => setIsEditing(true)}>EDIT</Button>
                        </div>
                        : null
                }
                <div className="LoginRegisterUser buttons">
                    <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
                </div>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                    <Button onClick={() =>
                        setErrorMessage("")
                    }>
                        Close
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={isEditing} information={"Enter the fields to update."}>
                    <div className="LoginRegisterUser formtitle">Username</div>
                    <FormField
                        className="LoginRegisterUser formfield"
                        value={username}
                        type="text"
                        onChange={e => setUsername(e)}
                    />
                    <div className="LoginRegisterUser formtitle">Password</div>
                    <FormField
                        className="LoginRegisterUser formfield"
                        value={password}
                        type="password"
                        onChange={e => setPassword(e)}
                    />
                    <Button onClick={() => updateData()}>UPDATE</Button>
                    <Button onClick={() => setIsEditing(false)}>CANCEL</Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    )

}

export default RegisteredUser;