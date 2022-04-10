import React from "react";
import HeaderImage from "styles/images/hannibal_header.png";
import PropTypes from "prop-types";
import "styles/views/Header.scss";


const Header = props => (
    <div className={"hannibalTitleHeader hannibalTitleHeaderContainer " + props.className}
         style={{ height: props.height }}>
        <img src={HeaderImage} alt={"Hannibal"}/>
    </div>
);

Header.propTypes = {
    height: PropTypes.string,
    className: PropTypes.string
};


export default Header;