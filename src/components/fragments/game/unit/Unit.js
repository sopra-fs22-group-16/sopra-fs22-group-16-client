import PropTypes from "prop-types";
import React, { useState } from "react";
import UnitImage from "./UnitImage";
import UnitShadow from "./UnitShadow";
import UnitModel from "../../../../models/UnitModel";
import healthSource from "styles/images/ui/healthbar/health_bar.png";

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

    let maxHealth = null;
    switch (props.unit.type) {
        case "archer":
            maxHealth = 100;
            break;
        case "knight":
            maxHealth = 125;
            break;
        case "war_elephant":
            maxHealth = 150;
            break;
        default:
            console.log("Type " + props.unit.type + " not provided or does not match!");
            break;
    }

    // TODO: Set animation dynamically when performing command

    let unitStyle = {
        top: props.unit.y * tileSize,
        left: props.unit.x * tileSize
    }

    let healthBoxStyle = {
        position: 'relative',
        top: -70,
    }

    let healthBarStyle = {
        position: 'relative',
        top: -90,
        right: -9,
        height: '5px',
        width: 30 * props.unit.health / maxHealth + 'px',
        background: unitColor === "red" ? '#873535': '#516899',
    }

    return (
        <div className={'unitContainer'} style={unitStyle} onClick={() => props.onClick(props.unit)}>
            <UnitShadow type={props.unit.type} color={unitColor} animation={animationState} />
            <UnitImage type={props.unit.type} color={unitColor} animation={animationState} />
            <img src={healthSource} style={healthBoxStyle} alt={''} />
            <div style={healthBarStyle}/>
        </div>
    );
}

Unit.propTypes = {
    unit: PropTypes.instanceOf(UnitModel).isRequired,
    onClick: PropTypes.func.isRequired,
}

export default Unit;
