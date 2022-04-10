import React from "react";
import HeaderImage from "styles/images/hannibal_header.png";
import PropTypes from "prop-types";
import "styles/views/Header.scss";


const Header = props => (
    <div className="header headerContainer" style={{ height: props.height }}>
        <img src={HeaderImage} />
    </div>
);

Header.propTypes = {
    height: PropTypes.string
};


export default Header;