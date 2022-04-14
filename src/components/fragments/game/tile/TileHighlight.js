import PropTypes from "prop-types";
import React from "react";
import {TileIndicatorType} from "./TileIndicatorType";
import {tileIndicatorData} from "./data/tileIndicatorData";

const TileIndicator = props => {

    let indicatorData = tileIndicatorData[props.indicatorType];
    if (!indicatorData) {
        if (props.indicatorType !== TileIndicatorType.none)
            console.log("Don't know " + props.indicatorType + " indicator!");
        return null;
    }

    let indicatorStyle = {
        backgroundImage: 'url(' + indicatorData.path + ')',
    }

    return (
        <div style={indicatorStyle} className="tile pixelated"/>
    );
}

TileIndicator.propTypes = {
    indicatorType: PropTypes.oneOf(Object.keys(TileIndicatorType)),
}

export default TileIndicator;
