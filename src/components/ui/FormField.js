import React from "react";
import PropTypes from "prop-types";
import "styles/views/LoginRegisterUser.scss";


const FormField = props => {
    return (
      <div className="LoginRegisterUser lobby-name">
        <input
          className="LoginRegisterUser input-name"
          placeholder="enter here.."
          type = {props.type}
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  };
  
  FormField.propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

export default FormField;