import PropTypes from "prop-types";
import React from "react";
import {unitImageData} from "./data/unitImageData";

const UnitImage = props => {

    let unitData = unitImageData[props.type];
    if (!unitData) {
        console.log("Don't know unit of type " + props.type + "!");
        return null;
    }

    let colorUnitPath = unitData[props.color].path;
    if(!colorUnitPath){
        console.log("For unit of type " + props.type + ", don't know the color: " + props.color);
        return null;
    }

    let unitStyle = {
        backgroundImage: 'url(' + colorUnitPath + ')',
        top: '-24px',
    }


    if (props.animation) {
        let animationData = unitData.animations[props.animation];
        if(!animationData) {
            console.log("For unit of type " + props.type + "-" + props.color + ", don't know the animation: " + props.animation);
        }else{
            unitStyle.backgroundPositionY = '-'+(animationData.y);
            unitStyle.animation =
                'animation' + animationData.frames + 'Frames '
                + animationData.time + 's '
                + 'steps(' + animationData.frames + ') '
                + 'infinite';
        }
    }

    return (
        <div style={unitStyle} className="tile pixelated"/>
    );
}

UnitImage.propTypes = {
    color: PropTypes.oneOf(["red", "blue"]).isRequired,
    type: PropTypes.oneOf(["archer", "knight", "war_elephant"]).isRequired,
    animation: PropTypes.string.isRequired,

}

export default UnitImage;
