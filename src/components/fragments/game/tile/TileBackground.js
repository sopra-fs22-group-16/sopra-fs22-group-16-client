import PropTypes from "prop-types";
import React from "react";
import {backgroundData} from "./data/backgroundData";

const TileBackground = props => {


    let tileData = backgroundData[props.type][props.variant];
    if (!tileData) {
        console.log("Don't know " + props.type + ":" + props.variant + " tile!");
        return null;
    }

    let tileStyle = {
        backgroundImage: 'url(' + tileData.path + ')',
    }

    let animationData = tileData.animation;
    if (animationData) {
        tileStyle.animation =
            'animation' + animationData.frames + 'Frames '
            + animationData.time + 's '
            + 'steps(' + animationData.frames + ') '
            + 'infinite';
    }

    return (
        <div style={tileStyle} className="tile pixelated"/>
    );
}

TileBackground.propTypes = {
    type: PropTypes.string,
    variant: PropTypes.string,
}

export default TileBackground;
