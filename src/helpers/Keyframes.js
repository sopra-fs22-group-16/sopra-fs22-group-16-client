import * as React from "react";
import PropTypes from "prop-types";

const Keyframes = (props) => {
    const toCss = ({ cssObject }) =>
        typeof cssObject === "string" ? cssObject :
            Object.keys(cssObject).reduce((accumulator, key) => {
                const cssKey = key.replace(/[A-Z]/g, v => `-${v.toLowerCase()}`);
                const cssValue = (cssObject)[key].toString().replace("'", "");
                return `${accumulator}${cssKey}:${cssValue};`;
            }, "");

    return (
        <style>
            {`@keyframes ${props.name} {
                ${Object.keys(props).map(key => {
                if (["from", "to"].includes(key)) {
                    return `${key} { ${toCss({ cssObject: props[key] })} }`;
                }
                else if (/^_\\d+$/.test(key)) {
                    return `${key.replace("_", "")}% { ${toCss({ cssObject: props[key] })} }`
                }
                return "";
            })
                    .join(" ")}
      }`}
        </style>
    );
};

Keyframes.propTypes = {
    name: PropTypes.string,
}

export default Keyframes;