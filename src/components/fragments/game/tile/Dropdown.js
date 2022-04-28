import PropTypes from "prop-types";
import React from "react";
import { dropdownData } from "./data/dropdownData.js";

const Dropdown = props => {

    let dropdownBoxData = dropdownData["container"][props.size];

    if (props.size != 'none') {
        let dropdownStyle = {
            backgroundImage: 'url(' + dropdownBoxData.path + ')'
        }
        let attackStyle = {
            backgroundImage: 'url(' + dropdownData["action"]["attack"].path + ')'
        }
        let waitStyle = {
            backgroundImage: 'url(' + dropdownData["action"]["wait"].path + ')'
        }
        let cancelStyle = {
            backgroundImage: 'url(' + dropdownData["action"]["cancel"].path + ')'
        }

        return (
            <div style={dropdownStyle} className={'tile dropdown ' + props.size}>
                <div onClick={() => props.onClick('wait', props.tile)} style={waitStyle} className={'tile dropdown ' + props.size + ' buttons wait'}></div>
                <div onClick={() => props.onClick('cancel', props.tile)} style={cancelStyle} className={'tile dropdown ' + props.size + ' buttons cancel'}></div>
                {
                    props.size === 'large' ? <div onClick={() => props.onClick('attack')} style={attackStyle} className={'tile dropdown ' + props.size + ' buttons attack'}></div> : null
                }
            </div>
        );
    }

    return null;
}

export default Dropdown;