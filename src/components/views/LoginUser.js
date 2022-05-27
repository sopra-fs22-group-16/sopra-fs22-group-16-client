import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { LinearProgress } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

import { api } from 'helpers/api';
import CustomPopUp from "components/ui/CustomPopUp";
import { Button } from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField"

import { defaultTheme } from "styles/themes/defaulTheme";
import 'styles/views/LoginRegisterUser.scss';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const LoginUser = () => {
    const history = useHistory();
    const [loggingIn, setLoggingIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({open: false, message: <div/>});

    const doLogin = async () => {
        try {
            setLoggingIn(true);

            const requestBody = JSON.stringify({ username, password });
            const response = await api.post('/v1/login', requestBody);

            const loggedInUser = response.data;
            localStorage.setItem("userId", loggedInUser.id);
            localStorage.setItem("isRegistered", "true");
            localStorage.setItem("token", loggedInUser.token);
            await timeout(2000);

            history.push('/home');
        } catch (error) {
            setLoggingIn(false);
            if (error.response.status === 404 || error.response.status === 401) {
                setError({open: true, message: <div> The given credentials are wrong </div>})
            } else {
                setError({open: true, message: <div> Ups! Something wrong happened. <br /> Try again and if the error persists, contact the administrator. </div>});
            }
        }
    };

    const returnHome = () => {
        history.push('/home');
    };

    return (
        <BaseContainer>
            <div className="LoginRegisterUser">
                <h1 className="LoginRegisterUser h1">Sign in to an existing account</h1>
                <table className="user">
                    <thead>
                    <tr>
                        <th>
                            username
                        </th>
                        <td>
                            <FormField
                                value={username}
                                type="text"
                                onChange={un => setUsername(un)}
                            />
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>
                                password
                            </th>
                            <td>
                                <FormField
                                    value={password}
                                    type="password"
                                    onChange={un => setPassword(un)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Link className="LoginRegisterUser link"
                      to={{
                          pathname: '/user/register'
                      }}>
                    Don't have an account yet? Create an account here</Link>
                <div className="LoginRegisterUser buttons">
                    <Button className="primary-button"
                            disabled={!username || !password}
                            onClick={() => doLogin()}
                    >
                        LOGIN
                    </Button>
                </div>
                <div className="LoginRegisterUser buttons">
                    <Button className="secondary-button return"
                        onClick={() => returnHome()}
                    >
                        RETURN HOME
                    </Button>
                </div>
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={loggingIn} information={<div> Logging in... </div>}>
                    <div style={{ width: '100%' }}>
                        <LinearProgress color="primary" />
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

export default LoginUser;
