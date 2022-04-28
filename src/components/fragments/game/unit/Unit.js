import PropTypes from "prop-types";
import React, {useState} from "react";
import UnitImage from "./UnitImage";
import UnitShadow from "./UnitShadow";
import UnitModel from "../../../../models/UnitModel";

const Unit = props => {

    let tileSize = 48;

    const [animationState, setAnimationState] = useState("idle_" + props.unit.viewDirection.name);

    let unitColor = "";
    switch (props.unit.teamId) {
        case 0:
            unitColor = "red";
            break;
        case 1:
            unitColor = "blue";
            break;
        default:
            console.log("Team id " + props.unit.teamId + " not provided or does not match!");
            break;
    }

    // TODO: Set animation dynamically when performing command

    let unitStyle = {
        top: props.unit.y * tileSize,
        left: props.unit.x * tileSize
    }

    return (
        <div className={'unitContainer'} style={unitStyle} onClick={() => props.onClick(props.unit)}>
            <UnitShadow type={props.unit.type} color={unitColor} animation={animationState}/>
            <UnitImage type={props.unit.type} color={unitColor} animation={animationState} />
        </div>
    );
}

Unit.propTypes = {
    unit: PropTypes.instanceOf(UnitModel).isRequired,
    onClick: PropTypes.func.isRequired,
}

export default Unit;
