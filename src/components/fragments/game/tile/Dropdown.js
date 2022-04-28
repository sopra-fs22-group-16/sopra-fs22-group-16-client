import PropTypes from "prop-types";
import React from "react";
import { dropdownData } from "./data/dropdownData.js";
import { DropdownType } from "./types/DropdownType";

const Dropdown = props => {

    let dropdownBoxData = dropdownData["container"][props.size];

    if (props.size != 'none') {
        let dropdownStyle = {
            backgroundImage: 'url(' + dropdownBoxData.path + ')'
        }

        return (
            <div style={dropdownStyle} className="unitImage pixelated" />
        );
    }

    return null;
}

export default Dropdown;