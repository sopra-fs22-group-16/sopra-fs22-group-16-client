import React, { useState} from 'react';
import { useHistory, Link,  } from 'react-router-dom';
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

const RegisterUser = () => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [creating, setCreating] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({ username, password });
            const response = await api.post('/v1/users', requestBody);

            // retrieves user data
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("isRegistered", true);
            console.log(response.data);
            setCreating(true);
            await timeout(4000);

            // TODO: take to the user page
            history.push(`/user/${response.data.id}`);
        }

        catch (error) {
            setCreating(false);
            if (error.response.status === 409) {
                setErrorMessage("This username is already taken!")
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
                <h1 className="LoginRegisterUser h1">Create a new account</h1>
                <table className="user">
                    <tr>
                        <th>
                            username
                        </th>
                        <td>
                            <FormField
                                type="text"
                                value={username}
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
                                type="password"
                                value={password}
                                onChange={un => setPassword(un)}
                            />
                        </td>
                    </tr>
                </table>
                <Link className="LoginRegisterUser link"
                    to={{
                        pathname: '/user/login'
                    }}>
                    Already have an account? Sign in</Link>
                <div className="LoginRegisterUser buttons">
                    <Button className="primary-button"
                        disabled={!username || !password}
                        onClick={() => doLogin()}
                    >
                        REGISTER
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
                <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                    <Button onClick={() =>
                        setErrorMessage("")
                    }>
                        Close
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={creating} information={"Your registration was successful. Please wait for your page..."}>
                    <div style={{ width: '100%' }}>
                        <LinearProgress color="primary" />
                    </div>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};

export default RegisterUser;