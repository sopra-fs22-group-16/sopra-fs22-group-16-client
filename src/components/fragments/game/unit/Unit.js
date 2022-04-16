import PropTypes from "prop-types";
import React, {useState} from "react";
import UnitModel from "../../../../models/UnitModel";
import UnitImage from "./UnitImage";

const Unit = props => {

    const [animationState, setAnimationState] = useState("idle");

    let unitColor = "";
    switch(props.unit.teamId){
        case 0: unitColor = "red"; break;
        case 1: unitColor = "blue"; break;
    }

    let animationName = animationState + "_" + props.unit.viewDirection;
    // FIXME: Remove just for testing
    if(props.unit.type === 'war_elephant'){
       animationName = "run_south";
    }

    return (
        <div>
            <UnitImage type={props.unit.type} color={unitColor} animation={animationName}/>
        </div>
    );
}

Unit.propTypes = {
   unit: PropTypes.object.isRequired
}

export default Unit;
