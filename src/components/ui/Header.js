import React, { useState } from "react";
import HeaderImage from "styles/images/hannibal_header.png";
import PropTypes from "prop-types";
import "styles/ui/Header.scss";
import LogoutIcon from '@mui/icons-material/Logout';
import { defaultTheme } from "../../styles/themes/defaulTheme";
import { ThemeProvider } from "@emotion/react";
import CustomPopUp from "components/ui/CustomPopUp";
import { LinearProgress } from "@mui/material";
import { Button } from 'components/ui/Button';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Header = props => {

    const isRegistered = localStorage.getItem('isRegistered') === 'true' ? true : false;
    const [errorMessage, setErrorMessage] = useState("");
    const showLogOut = (isRegistered && !(props.noLogOutBool == true)) ? true : false;
    const [loggingOut, setLoggingOut] = useState(false);

    const logOut = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isRegistered');
        setLoggingOut(true);
        await timeout(2000);
        window.location.reload(false);
    }

    const LogoutIconHeader = () => {
        if (showLogOut) {
            return (
                <LogoutIcon className="header userInfo"
                    onClick={() => logOut()}
                />
            )
        }
        else {
            return (null)
        }
    }

    return (
        <div>
            <div className="header headerContainer" style={{ height: props.height }}>
                <img src={HeaderImage} />
                <LogoutIconHeader />
            </div>
            <ThemeProvider theme={defaultTheme}>
                <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                    <Button onClick={() =>
                        setErrorMessage("")
                    }>
                        Close
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={loggingOut} information={"Logging out..."}>
                    <div style={{ width: '100%' }}>
                        <LinearProgress color="primary" />
                    </div>
                </CustomPopUp>
            </ThemeProvider>
        </div>)

};

Header.propTypes = {
    height: PropTypes.string,
    logOutBool: PropTypes.bool,
    isRegistered: PropTypes.bool,

}

export default Header;