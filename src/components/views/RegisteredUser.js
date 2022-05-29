import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {ThemeProvider} from "@emotion/react";
import {api} from 'helpers/api';
import RegisteredUserModel from 'models/RegisteredUserModel'

import CustomPopUp from "components/ui/CustomPopUp";
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";

import {defaultTheme} from "styles/themes/defaulTheme";
import 'styles/views/LoginRegisterUser.scss';
import FormField from "../ui/FormField";

const RegisteredUser = ({id}) => {

    const history = useHistory();
    const [userData, setUserData] = useState({
        id: null,
        username: null,
        rankedScore: null,
        wins: null,
        losses: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem("userId");
    const isRegistered = localStorage.getItem('isRegistered') === 'true';

    const [error, setError] = useState({open: false, message: <div/>});
    const [getDataFailed, setGetDataFailed] = useState({open: false, message: <div/>});

    useEffect(() => {
        loadUserData().catch(handleLoadUserDataError);
    }, []);

    const returnHome = () => {
        history.push('/home');
    };

    const loadUserData = async () => {
        const response = await api.get(`/v1/users/${id}`);
        const userInfo = new RegisteredUserModel(response.data);
        setUserData(userInfo);
    }

    const handleLoadUserDataError = (e) => {
        if (e.response != null) {
            if (e.response?.status === 404) {
                setGetDataFailed({open: true, message: <div> The user with the id {id} does not exist! </div>});
            } else {
                setGetDataFailed({
                    open: true,
                    message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact the
                        administrator. </div>
                });
            }
        }
    }

    const updateData = async () => {
        try {
            const requestBody = {};
            requestBody.username = username || userData.username;
            requestBody.password = password || "";
            await api.put(
                `/v1/users/${id}`,
                requestBody,
                {headers: {'token': token || ''}});
            loadUserData().catch(handleLoadUserDataError);
            setIsEditing(false);
        } catch (e) {
            if (e.response?.status === 409) {
                setError({open: true, message: <div> This username is already taken! </div>})
            } else {
                setError({
                    open: true,
                    message: <div> Ups! Something happened. <br/> Try again and if the error persists, contact the
                        administrator.</div>
                });
            }
        }
    }

    return (
        <BaseContainer>
            <div className="LoginRegisterUser">
                <h1 className="LoginRegisterUser h1">User information</h1>
                <table className="user">
                    <tbody>
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
                    </tbody>
                </table>
                <div className="LoginRegisterUser space"/>
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
                <CustomPopUp open={getDataFailed.open} information={getDataFailed.message}>
                    <Button onClick={() => setGetDataFailed({open: false, message: <div/>})}>
                        Close
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={error.open} information={error.message}>
                    <Button onClick={() => setError({open: false, message: <div/>})}>
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