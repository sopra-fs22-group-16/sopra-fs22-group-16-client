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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState({open: false, message: <div/>});

    const doLogin = async () => {
        try {

            setCreating(true);

            const requestBody = JSON.stringify({ username, password });
            const response = await api.post('/v1/users', requestBody);

            // retrieves user data
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("isRegistered", "true");
            await timeout(2000);

            history.push('/home');
        }

        catch (e) {
            setCreating(false);
            if (e.response != null) {
                if (e.response.status === 409) {
                    setError({open: true, message: <div> This username is already taken! </div>})
                } else {
                    setError({open: true, message:<div> Ups! Something happened. <br/> Try again and if the error persists, contact the administrator. </div>});
                }
            } else {
                setError({open: true, message:<div> Ups! Something happened. <br/> Try again and if the error persists, contact the administrator. </div>});
            }
        }
    };

    const returnHome = () => {
        history.push('/home');
    };

    // lobby name limit to 8 characters
    const setNewUsername = (un) => {

        if(un.length < 11) {
            setUsername(un);
        }

        else {
            setError({open: true, message: <div>This username is too long! <br /> Please limit yourself to 10 characters. </div>});
        }
    }

    return (
        <BaseContainer>
            <div className="LoginRegisterUser">
                <h1 className="LoginRegisterUser h1">Create a new account</h1>
                <table className="user">
                    <thead>
                    <tr>
                        <th>
                            username
                        </th>
                        <td>
                            <FormField
                                type="text"
                                value={username}
                                onChange={un => setNewUsername(un)}
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
                                type="password"
                                value={password}
                                onChange={un => setPassword(un)}
                            />
                        </td>
                    </tr>
                    </tbody>
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
                <CustomPopUp open={error.open} information={error.message}>
                    <Button onClick={() =>
                        setError({open: false, message: <div/>})
                    }>
                        Close
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={creating}
                             information={<div>Registering...</div>}>
                    <div style={{width: '100%'}}>
                        <LinearProgress color="primary"/>
                    </div>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};

export default RegisterUser;