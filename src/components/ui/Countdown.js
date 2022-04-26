import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button } from 'components/ui/Button';
import { Backdrop } from "@mui/material";
import "styles/ui/Countdown.scss";

const Countdown = props => {

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            open={true}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onClick={props.onClick}
        >
            <div className="countdown-container">
                <label className="countdown-label">{props.content}</label>
                <div className="countdown-timer">
                    <CountdownCircleTimer
                        isPlaying
                        duration={props.duration}
                        //with the list of colors it is possible to define a gradient
                        //which is defined for the intervals colorsTime (min: 2 values)
                        colors={['#FBC12E', '#A30000']}
                        colorsTime={[props.duration, 0]}
                        size={props.size}
                        onComplete={() => props.onComplete()}
                    >
                        {({ remainingTime }) => remainingTime}
                    </CountdownCircleTimer>
                </div>
                <div className="countdown-button">
                    <Button
                        className="countdown-button"
                        onClick={() => props.onClick()}
                    >
                        {props.buttonMessage}
                    </Button>
                </div>
            </div>
        </Backdrop>
    );
}

export default Countdown;