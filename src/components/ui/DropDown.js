import PropTypes from "prop-types";
import dropDownSmall from "styles/images/ui/dropdown/dropdown_small.png";
import dropDownLarge from "styles/images/ui/dropdown/dropdown_large.png"
import dropDownArrow from "styles/images/ui/dropdown/dropdown_arrow.png"

import attackLight from "styles/images/ui/dropdown/attack_light.png";
import attackDark from "styles/images/ui/dropdown/attack_dark.png";

import waitLight from "styles/images/ui/dropdown/wait_light.png";
import waitDark from "styles/images/ui/dropdown/wait_dark.png";

import cancelLight from "styles/images/ui/dropdown/cancel_light.png"
import cancelDark from "styles/images/ui/dropdown/cancel_dark.png"

import TileModel from "../../models/TileModel";

import "styles/ui/DropDown.scss";

const DropDown = props => {

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

    const onClickAttack = () => {
        if(props.onClickAttack) {
            props.onClickAttack(props.target);
        }
    }

    return (
        props.open ?
            <div style={dropDownPosition} className={'dropDown'}>
                <img className={'dropDownImage'} src={props.showAttack ? dropDownLarge : dropDownSmall} alt={''}/>
                {
                    props.showAttack ?
                        <div className={'selection first'} onClick={onClickAttack}>
                            <img className={'light'} src={attackLight} alt={"attack"}/>
                            <img className={'dark'} src={attackDark} alt={''}/>
                        </div>
                        :
                        null
                }
                
                <div className={'selection '  + (props.showAttack ? 'second' : 'first')} onClick={onClickWait}>
                    <img className={'light'} src={waitLight} alt={"wait"}/>
                    <img className={'dark'} src={waitDark} alt={''}/>
                </div>
                <div className={'selection ' + (props.showAttack ? 'third' : 'second')} onClick={onClickCancel}>
                    <img className={'light'} src={cancelLight} alt={"cancel"}/>
                    <img className={'dark'} src={cancelDark} alt={''}/>
                </div>
                <img className={'dropDownArrow'} src={dropDownArrow} alt={''}/>
            </div>
            :
            null
    );

}

DropDown.propTypes = {
    open: PropTypes.bool,
    y: PropTypes.number,
    x: PropTypes.number,
    showAttack: PropTypes.bool,
    onClickAttack: PropTypes.func,
    onClickWait: PropTypes.func,
    onClickCancel: PropTypes.func,
    target: PropTypes.instanceOf(TileModel),
}

DropDown.defaultProps = {
    open: false,
    y: 0,
    x: 0
};

export default DropDown;
