import PropTypes from "prop-types";
import CustomPopUp from "./CustomPopUp";
import {defaultTheme} from "../../styles/themes/defaulTheme";
import {LinearProgress} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import React, {useEffect, useRef, useState} from "react";

const HoldToConfirmPopUp = props => {

    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => stopCounter(); // when App is unmounted we should stop counter
    }, []);

    const startCounter = () => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => {
            let prev;
            setProgress((prevProgress) => {
                prev = prevProgress;
                if (prevProgress >= 100) {
                    return prevProgress;
                } else {
                    return (prevProgress + 1);
                }
            });
            if (prev >= 100) {
                stopCounter();
                props.onComplete();
            }

        }, props.timeToCompleteInMs / 100);
    };

    const stopCounter = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setProgress(0);
        }
    };

    return (
        <CustomPopUp
            information={props.children} open={props.open}
            onMouseDown={startCounter}
            onMouseUp={stopCounter}
            onTouchStart={startCounter}
            onTouchEnd={stopCounter}
            onTouchCancel={stopCounter}
            style={{cursor: 'pointer'}}
        >
            <ThemeProvider theme={defaultTheme}>
                <div style={{width: '100%'}}>
                    <LinearProgress color="primary" variant={"determinate"} value={progress}/>
                </div>
            </ThemeProvider>
        </CustomPopUp>
    );
}

HoldToConfirmPopUp.propTypes = {
    open: PropTypes.bool,
    onComplete: PropTypes.func
}

HoldToConfirmPopUp.defaultProps = {
    open: false,
};

export default HoldToConfirmPopUp;