import PropTypes from "prop-types";
import React from "react";
import { ArrowPartType } from "./types/ArrowPartType";
import { pathArrowData } from "./data/pathArrowData";
import { Direction } from "../unit/Direction";

const PathIndicator = props => {

    let indicatorData = pathArrowData[props.pathPartType];
    if (!indicatorData) {
        if (props.pathPartType !== ArrowPartType.none)
            console.log("Don't know " + props.pathPartType + " arrow part!");
        return null;
    }

    let indicatorStyle = {
        WebkitTransform: 'rotate(' + props.pathPartDirection.angle + 'deg)',
        MozTransform: 'rotate(' + props.pathPartDirection.angle + 'deg)',
        msTransform: 'rotate(' + props.pathPartDirection.angle + 'deg)',
        transform: 'rotate(' + props.pathPartDirection.angle + 'deg)',
        backgroundImage: 'url(' + indicatorData.path + ')',
    }

    return (
        <div style={indicatorStyle} className="tile pixelated" />
    );
}

PathIndicator.propTypes = {
    pathPartType: PropTypes.oneOf(Object.keys(ArrowPartType)).isRequired,
    pathPartDirection: PropTypes.oneOf(Object.values(Direction)).isRequired,
}

export default PathIndicator;
