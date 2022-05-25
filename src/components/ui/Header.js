import React, { useState } from "react";
import HeaderImage from "styles/images/hannibal_header.png";
import PropTypes from "prop-types";
import "styles/ui/Header.scss";
import LogoutIcon from '@mui/icons-material/Logout';
import { defaultTheme } from "../../styles/themes/defaulTheme";
import { ThemeProvider } from "@emotion/react";
import CustomPopUp from "../ui/CustomPopUp";
import { Button } from 'components/ui/Button';

const isRegistered = true;
const userId = localStorage.getItem("userId");



const Header = props => {

    const [errorMessage, setErrorMessage] = useState("");

    const logOut = () => {

        setErrorMessage("You are now logged out!")
        // I know we don't use userId anywhere right now but I feel like we need it to do the logout
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isRegistered');
    }

     return(
    <div>
    <div className="header headerContainer" style={{ height: props.height }}>
        <img src={HeaderImage} />
    {
        (isRegistered && !(props.logOutBool))? 

        <LogoutIcon className = "header userInfo"
        onClick={() => logOut()}
        />
                    :
        null

    }
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
 </div>)
    
        };

Header.propTypes = {
    height: PropTypes.string,
    logOutBool: PropTypes.bool

}



export default Header;