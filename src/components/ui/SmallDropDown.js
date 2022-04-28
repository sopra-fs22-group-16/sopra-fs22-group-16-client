import PropTypes from "prop-types";
import dropDownSmall from "styles/images/ui/dropdown/dropdown_small.png";
import dropDownArrow from "styles/images/ui/dropdown/dropdown_arrow.png"

import waitLight from "styles/images/ui/dropdown/wait_light.png";
import waitDark from "styles/images/ui/dropdown/wait_dark.png";

import cancelLight from "styles/images/ui/dropdown/cancel_light.png"
import cancelDark from "styles/images/ui/dropdown/cancel_dark.png"

import "styles/ui/SmallDropDown.scss";
import TileModel from "../../models/TileModel";

const SmallDropDown = props => {

    let dropDownPosition = {
        top: props.y,
        left: props.x

    }

    const onClickCancel = () => {
        if (props.onClickCancel) {
            props.onClickCancel(props.target);
        }
    }

    const onClickWait = () => {
        if (props.onClickWait) {
            props.onClickWait(props.target);
        }
    }

    return (
        props.open ?
            <div style={dropDownPosition} className={'smallDropDown'}>
                <img className={'dropDownImage'} src={dropDownSmall} alt={''}/>
                <div className={'selection first'} onClick={onClickWait}>
                    <img className={'light'} src={waitLight} alt={"wait"}/>
                    <img className={'dark'} src={waitDark} alt={''}/>
                </div>
                <div className={'selection second'} onClick={onClickCancel}>
                    <img className={'light'} src={cancelLight} alt={"cancel"}/>
                    <img className={'dark'} src={cancelDark} alt={''}/>
                </div>
                <img className={'dropDownArrow'} src={dropDownArrow} alt={''}/>
            </div>
            :
            null
    );

}

SmallDropDown.propTypes = {
    open: PropTypes.bool,
    y: PropTypes.number,
    x: PropTypes.number,
    onClickWait: PropTypes.func,
    onClickCancel: PropTypes.func,
    target: PropTypes.instanceOf(TileModel),
}

SmallDropDown.defaultProps = {
    open: false,
    y: 0,
    x: 0
};

export default SmallDropDown;
