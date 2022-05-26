import React, { useState , useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { getInitColorSchemeScript, LinearProgress } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { api } from 'helpers/api';
import RegisteredUserModel from 'models/RegisteredUserModel'

import CustomPopUp from "components/ui/CustomPopUp";
import { Button } from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";

import { defaultTheme } from "styles/themes/defaulTheme";
import 'styles/views/LoginRegisterUser.scss';

const RegisteredUser = ({id}) => {

    const history = useHistory();
    const [userData, setUserData] = useState({
        id: null,
        username: null,
        rankedScore: null,
        wins: null,
        losses : null
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadUserData();  
    }, []);

    const returnHome = () => {
        history.push('/home');
    };

    const loadUserData = async() => {
        const response = await api.get(`/v1/users/${id}`);
        const userInfo = new RegisteredUserModel(response.data);
        console.log(userInfo);
        setUserData(userInfo);
    }

    return(
        <BaseContainer>
        <div className="LoginRegisterUser">
        <h1 className = "LoginRegisterUser h1">Your information</h1>
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
            <Link className="LoginRegisterUser link"
                    to={{
                        pathname: '/user/login'
                    }}>
                    Change user information</Link>
                    <div className="LoginRegisterUser buttons">
                    <Button className = "primary-button"
                     onClick={() =>
                       returnHome()
                    }>
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
            </ThemeProvider>
      </BaseContainer>
    )
    
}

export default RegisteredUser;