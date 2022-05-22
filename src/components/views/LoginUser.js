import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import QrReader from 'react-qr-reader'
import { LinearProgress } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import PropTypes from "prop-types";

import { api } from 'helpers/api';
import UserModel from 'models/UserModel';
import CustomPopUp from "components/ui/CustomPopUp";
import { Button } from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField"

import { defaultTheme } from "styles/themes/defaulTheme";
import 'styles/views/LoginRegisterUser.scss';
  
  const LoginUser = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [status, setStatus] = useState(null);
    const [users, setUsers] = useState(null);
    const [creating, setCreating] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
  
    const doLogin = async () => {
    
    localStorage.setItem("username", username);
    setErrorMessage("server not integrated yet!");
    history.push('/lobby/join');
    };

    const returnHome = () => {
        history.push('/home');
    };
  
    return (
      <BaseContainer>
        <div className="LoginRegisterUser">
        <h1 className = "LoginRegisterUser h1">Sign in to an existing account</h1>
          <table className="user">
              <tr>
                  <th>
                      username
                  </th>
                  <td>
            <FormField
              value={username}
              type = "text"
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
              type = "password"
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
              <Button className = "primary-button"
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
                <CustomPopUp open={creating} information={"Creating Lobby"}>
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
  
  /**
   * You can get access to the history object's properties via the withRouter.
   * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
   */
  export default LoginUser;
  