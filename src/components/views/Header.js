import React from "react";
import HeaderImage from "styles/images/hannibal_header.png";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import Hannibal_Logo from 'styles/ui/Hannibal_Logo.jpg';


const Header = props => (
  <div className="header container" style={{height: props.height}}>
<<<<<<< HEAD
    <img className = "header image" src={Hannibal_Logo} width="200" height="50"/>
=======
    <img src={HeaderImage}/>
>>>>>>> 7f84358a26229f456dc0fc368b35154c46e8da98
  </div>
);

Header.propTypes = {
  height: PropTypes.string
};


export default Header;
