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
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [creating, setCreating] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const doLogin = async () => {
        try {

            const requestBody = JSON.stringify({ username, password });
            const response = await api.post('/v1/login', requestBody);

            // logged-in data is just token
            const loggedInUser = response.data;
            console.log(response.data);
            localStorage.setItem("userId", loggedInUser.id);
            localStorage.setItem("isRegistered", true);
            localStorage.setItem("token", loggedInUser.token);
            setCreating(true);
            await timeout(4000);

            // TODO: take to the user page
            history.push('/home');
            history.push(`/user/${loggedInUser.id}`);
        }

        catch (error) {
            setCreating(false);
            if (error.response.status === 404) {
                setErrorMessage("This username does not match an account. Do you want to register instead?")
            }
            else if (error.response.status === 401) {
                setErrorMessage("Your password seems to be incorrect. Please try again!")
            }
            else {
                setErrorMessage("Something is wrong!");
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
                <CustomPopUp open={creating} information={"Your log-in was successful. Please wait for your page..."}>
                    <div style={{ width: '100%' }}>
                        <LinearProgress color="primary" />
                    </div>
                </CustomPopUp>
                <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                    <Button onClick={() =>
                        setErrorMessage("")
                    }>
                        Close
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};

export default LoginUser;
