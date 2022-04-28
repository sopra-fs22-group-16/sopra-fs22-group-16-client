import PropTypes from "prop-types";
import React from "react";
import { DropDownType} from "./dropDownType";
import {DropDownData} from "./dropDownData";

const DropDownIndicator = props => {

    let indicatorData = DropDownData[props.indicatorType];
    if (!indicatorData) {
        if (props.indicatorType !== DropDownType.none)
            console.log("Don't know " + props.indicatorType + " indicator!");
        return null;
    }

    let indicatorStyle = {
        backgroundImage: 'url(' + indicatorData.path + ')',
        backgroundSize: "contain"
    }

    return (
        <div style={indicatorStyle} className="tile pixelated"/>
    );
}

DropDownIndicator.propTypes = {
    indicatorType: PropTypes.oneOf(Object.keys(DropDownType)),
}

export default DropDownIndicator;