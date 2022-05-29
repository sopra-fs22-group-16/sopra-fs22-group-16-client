import React, {Component} from "react";

import "styles/ui/Alert.scss";

export default class Alert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restartAnimation: false
        }
    }

    shouldComponentUpdate(nextProps, nextState, _nextContext) {
        return (nextProps.redraw !== this.props.redraw || nextState.restartAnimation !== this.state.restartAnimation);
    }

    componentDidUpdate(_prevProps, prevState, _snapshot) {
        if(!this.state.restartAnimation && !prevState.restartAnimation){
            this.updateDuration()
        }
    }

    updateDuration() {
        //before updating duration set resetAnimation to true to remove the svg from dom, then in the callback function set it to false and update duration
        this.setState({
            restartAnimation: true
        }, () => {
            requestAnimationFrame(() => {
                this.setState({
                    restartAnimation: false
                })
            })
        })
    }

    render() {
        const animationStyle = `slideOut 4s linear 1 forwards`;

        //check if resetAnimation is true don't render the svg ( now we removed the svg from dom)
        if (this.state.restartAnimation || !this.props.open) {
            return (<div></div>);
        }
        //else if resetAnimation is false render the svg but now the new duration and animation will start from the beginning
        else {
            return (
                <div style={{animation: (this.state.restartAnimation ? "" : animationStyle)}}
                     className={"Alert container"}>
                    {this.props.children}
                </div>
            );
        }
    }

}
