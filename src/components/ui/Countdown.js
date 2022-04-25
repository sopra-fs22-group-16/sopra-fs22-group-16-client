import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "styles/ui/Countdown.scss";

const Countdown = props => {

    return (
        <div className="countdown-container">
            <label className="countdown-label">{props.content}</label>
            <div className="countdown-timer">
                <CountdownCircleTimer
                    isPlaying
                    duration={props.duration}
                    colors={['#FBC12E', '#A30000']}
                    colorsTime={[props.duration, 0]}
                    size={120}
                    onComplete={() => props.onComplete()}
                >
                    {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
            </div>
        </div>
    );
}

export default Countdown;