import React, {useState} from "react";
import HeaderImage from "styles/images/hannibal_header.png";
import PropTypes from "prop-types";
import "styles/ui/Header.scss";
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import {defaultTheme} from "../../styles/themes/defaulTheme";
import {ThemeProvider} from "@emotion/react";
import CustomPopUp from "components/ui/CustomPopUp";
import {LinearProgress} from "@mui/material";
import {Button} from 'components/ui/Button';
import info_icon from "../../styles/images/info/info_icon.png";
import github_icon from "../../styles/images/info/github_icon.png";
import {useHistory} from "react-router-dom";


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Header = props => {

    const history = useHistory();

    const isRegistered = localStorage.getItem('isRegistered') === 'true';
    const [errorMessage, setErrorMessage] = useState("");
    const [loggingOut, setLoggingOut] = useState(false);
    const showLogOut = isRegistered && !props.noHeaderIcons;

    const logOut = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isRegistered');
        setLoggingOut(true);
        await timeout(2000);
        window.location.reload(false);
    }

    const LogoutIconHeader = () => {
        return (
            showLogOut ? <LogoutIcon className="header userInfo" style={{ cursor: "pointer" }} onClick={() => logOut()}/> : null
        );
    }

    const InfoIconHeader = () => {
        return (
            !props.noHeaderIcons ? <img src={info_icon} onClick={() => goInfoPage()} className={"HomePage infoIcon"} alt={""}
                              style={{cursor: "pointer"}}/> : null
        );
    }

    const GithubIconHeader = () => {
        return (
            !props.noHeaderIcons ? <a target="_blank" href="https://github.com/sopra-fs22-group-16">
                <img src={github_icon} className={"HomePage githubIcon"} alt={""} style={{cursor: "pointer"}}/>
            </a> : null
        );
    }

    const goInfoPage = () => {
        history.push('/info');
    }

    return (
        <div>
            <div className="header headerContainer" style={{height: props.height}}>
                <img src={HeaderImage} alt={""}/>
                <LogoutIconHeader/>
                <InfoIconHeader/>
                <GithubIconHeader/>

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
                    <div style={{width: '100%'}}>
                        <LinearProgress color="primary"/>
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