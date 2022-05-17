import React, { useState} from "react";
import {Link } from 'react-router-dom';
import HeaderImage from "styles/images/hannibal_header.png";
import PropTypes from "prop-types";
import "styles/ui/Header.scss";

const username = localStorage.getItem("username")? localStorage.getItem("username"): null;
//const userId = localStorage.getItem("userId");
const userId = 1;


const Header = props => (


    <div className="header headerContainer" style={{ height: props.height }}>
        <img src={HeaderImage} />
    <Link className="header userInfo"
                    to={{
                        pathname: '/user/'+userId
                    }}>
                    {username}</Link>
    </div>
    
);
Header.propTypes = {
    height: PropTypes.string

}


export default Header;