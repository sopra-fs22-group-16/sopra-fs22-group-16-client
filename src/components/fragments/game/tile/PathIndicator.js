import PropTypes from "prop-types";
import React from "react";
import {ArrowPartType} from "./types/ArrowPartType";
import {pathArrowData} from "./data/pathArrowData";
import TileModel from "../../../../models/TileModel";
import PathPart from "../../../../models/PathPart";

const PathIndicator = props => {

    let indicatorData = pathArrowData[props.pathPart.type];
    if (!indicatorData) {
        if (props.pathPart.type !== ArrowPartType.none)
            console.log("Don't know " + props.pathPart.type + " arrow part!");
        return null;
    }

    let indicatorStyle = {
        // Do correct rotation
        backgroundImage: 'url(' + indicatorData.path + ')',
    }

    return (
        <div style={indicatorStyle} className="tile pixelated"/>
    );
}

PathIndicator.propTypes = {
    pathPart: PropTypes.instanceOf(PathPart).isRequired,
}

export default PathIndicator;
