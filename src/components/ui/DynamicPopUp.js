import PropTypes from "prop-types";
import {Backdrop, Button, Stack} from "@mui/material";
import "styles/ui/DynamicPopUp.scss"
import React from "react";


const DynamicPopUp = props => {

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            open={props.open}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
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

DynamicPopUp.propTypes = {
    open: PropTypes.bool,
    information: PropTypes.any.isRequired,
    children: PropTypes.node,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
}

export default DynamicPopUp;