import React, { useState} from "react";
import {Link, useHistory} from 'react-router-dom';
import HeaderImage from "styles/images/hannibal_header.png";
import PropTypes from "prop-types";
import "styles/ui/Header.scss";
import LogoutIcon from '@mui/icons-material/Logout';

const isRegistered = localStorage.getItem('isRegistered') === 'true' ? true : false;
const userId = localStorage.getItem("userId");
const notLobby = window.location.pathname == "/lobby" ? true : false;


const logOut = () => {

    // I know we don't use userId anywhere right now but I feel like we need it to do the logout? 
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isRegistered');
    console.log("logging out");
}

/*
<Link className="header userInfo"
                    to={{
                        pathname: '/user/'+userId
                    }}>
                    {username}</Link>*/

const Header = props => (

    <div className="header headerContainer" style={{ height: props.height }}>
        <img src={HeaderImage} />
    {
        (isRegistered)? 

        <LogoutIcon className = "header userInfo"
        onClick={() => logOut()}
        />
                    :
        null

    }
    </div>
    
    );

Header.propTypes = {
    height: PropTypes.string

}



export default Header;