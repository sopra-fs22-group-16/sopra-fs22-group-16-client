import React from "react";
import PropTypes from "prop-types";
import {Backdrop, Stack} from "@mui/material";
import "styles/ui/CustomPopUp.scss";
import HoldToConfirmPopUp from "./HoldToConfirmPopUp";

const CustomPopUp = props => {

    return (
        <Backdrop
            sx={{
                ...props.style,
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            open={props.open}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onClick={props.onClick}
            onTouchStart={props.onTouchStart}
            onTouchEnd={props.onTouchEnd}
            onTouchCancel={props.onTouchCancel}
        >
            <div className={"popUpContainer"}>
                <Stack
                    spacing={2}
                    justifyContent="space-evenly"
                    alignItems="center"
                >
                    <div>{props.information}</div>
                    {props.children}
                </Stack>
            </div>

        </Backdrop>
    );

}

HoldToConfirmPopUp.defaultProps = {
    open: false,
    style: {},
};

CustomPopUp.propTypes = {
    open: PropTypes.bool,
    information: PropTypes.any.isRequired,
    children: PropTypes.node,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchCancel: PropTypes.func,
    style: PropTypes.object
}

export default CustomPopUp;
