import PropTypes from "prop-types";
import React from "react";
import UnitImage from "./UnitImage";
import UnitShadow from "./UnitShadow";
import UnitModel from "../../../../models/UnitModel";
import healthSource from "styles/images/ui/healthbar/health_bar.png";
import markerSource from "styles/images/ui/marker.png";
import Keyframes from "../../../../helpers/Keyframes";

const Unit = props => {

    let tileSize = 48;

    let animationState = props.unit.animation + "_" + props.unit.viewDirection.name;

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

    let unitStyle = {
        top: props.unit.y * tileSize,
        left: props.unit.x * tileSize,
    }

    unitStyle.animation =
        "run" + props.unit.y + '' + props.unit.x + ' '
        + (props.unit.movementSpeed * (Math.abs(props.unit.oldX - props.unit.x) + Math.abs(props.unit.oldY - props.unit.y))) + 'ms '
        + 'linear '
        + '1';



    let healthBoxStyle = {
        position: 'relative',
        top: -70,
        pointerEvents: 'none'
    }

    let healthBarStyle = {
        position: 'relative',
        top: -90,
        right: -9,
        height: '5px',
        width: 30 * props.unit.health / props.unit.maxHealth + 'px',
        background: unitColor === "red" ? '#873535' : '#516899',
        pointerEvents: 'none'
    }

    let markerContainerStyle = {
        top: -135,
        right: -14,
    }

    let markerStyle = {
        animation: "unitMarkerMovement 1.5s infinite ease-in-out",
    }

    return (
        <div className={'unitContainer'} style={unitStyle} onClick={() => props.onClick(props.unit)}>
            <Keyframes name={"run" + props.unit.y + '' + props.unit.x}
                from={{
                    left: props.unit.oldX * tileSize + 'px',
                    top: props.unit.oldY * tileSize + 'px'
                }}
                to={{
                    left: (props.unit.x) * tileSize + 'px',
                    top: (props.unit.y) * tileSize + 'px',
                }} />
            <UnitShadow type={props.unit.type} color={unitColor} animation={animationState} />
            <UnitImage type={props.unit.type} color={unitColor} animation={animationState} />
            <img src={healthSource} style={healthBoxStyle} alt={''} />
            <div style={healthBarStyle} />
            {props.showMarker ?
                <div className={"unitMarkerContainer"} style={markerContainerStyle}>
                    <img className={"unitMaker"} style={markerStyle} src={markerSource} alt={''} />
                </div>
                : null
            }
        </div>
    );
}

Unit.propTypes = {
    unit: PropTypes.instanceOf(UnitModel).isRequired,
    onClick: PropTypes.func.isRequired,
    showMarker: PropTypes.bool,
}

export default Unit;
