import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import Hannibal_Logo from 'styles/images/Hannibal_Logo.jpg';


const Header = props => (
  <div className="header container" style={{height: props.height}}>
    <img className = "header image" src={Hannibal_Logo} width="200" height="50"/>
  </div>
);

Header.propTypes = {
  height: PropTypes.string
};


export default Header;
