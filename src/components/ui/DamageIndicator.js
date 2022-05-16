import PropTypes from "prop-types";
import middle_blueLeft_redRight from "styles/images/ui/damageIndicator/damageIndicator_Middle_blueLeft_redRight.png";
import middle_redLeft_blueRight from "styles/images/ui/damageIndicator/damageIndicator_Middle_redLeft_blueRight.png";

import leftSmall from "styles/images/ui/damageIndicator/damageIndicator_left_small.png"
import leftMedium from "styles/images/ui/damageIndicator/damageIndicator_left_medium.png"
import leftLarge from "styles/images/ui/damageIndicator/damageIndicator_left_large.png"

import rightSmall from "styles/images/ui/damageIndicator/damageIndicator_right_small.png"
import rightMedium from "styles/images/ui/damageIndicator/damageIndicator_right_medium.png"
import rightLarge from "styles/images/ui/damageIndicator/damageIndicator_right_large.png"

import "styles/ui/DamageIndicator.scss";

const DamageIndicator = props => {

    let dropDownPosition = {
        top: props.y,
        left: props.x

    }
    let leftColor = 'blue';
    let rightColor = 'red';
    if(props.leftRed){
        leftColor = 'red';
        rightColor = 'blue';
    }


    let leftBackgroundSource = null;
    let leftNumber100Content = null;
    let leftNumber10Content = null;
    let leftNumber1Content = null;

    let leftNumbers = props.leftDamage.toString().split('');
    if (props.leftDamage >= 100) {
        leftBackgroundSource = leftLarge;
        leftNumber100Content =
            <img src={'/ui/numbers/' + leftNumbers[0] + '_' + leftColor + '.png'} className={'number left fourth'} alt={''}/>
        leftNumber10Content =
            <img src={'/ui/numbers/' + leftNumbers[1] + '_' + leftColor + '.png'} className={'number left third'} alt={''}/>
        leftNumber1Content =
            <img src={'/ui/numbers/' + leftNumbers[2] + '_' + leftColor + '.png'} className={'number left second'} alt={''}/>
    } else if (props.leftDamage >= 10) {
        leftBackgroundSource = leftMedium;
        leftNumber10Content =
            <img src={'/ui/numbers/' + leftNumbers[0] + '_' + leftColor + '.png'} className={'number left third'} alt={''}/>
        leftNumber1Content =
            <img src={'/ui/numbers/' + leftNumbers[1] + '_' + leftColor + '.png'} className={'number left second'} alt={''}/>
    } else if(props.leftDamage >= 0){
        leftBackgroundSource = leftSmall;
        leftNumber1Content =
            <img src={'/ui/numbers/' + leftNumbers[0] + '_' + leftColor + '.png'} className={'number left second'} alt={''}/>
    }

    let rightBackgroundSource= null;
    let rightNumber100Content = null;
    let rightNumber10Content = null;
    let rightNumber1Content = null;
    let rightPercentageContent = null;

    let rightNumbers = props.rightDamage.toString().split('');
    if (props.rightDamage >= 100) {
        rightBackgroundSource = rightLarge;
        rightNumber100Content =
            <img src={'/ui/numbers/' + rightNumbers[0] + '_' + rightColor + '.png'} className={'number right first'} alt={''}/>
        rightNumber10Content =
            <img src={'/ui/numbers/' + rightNumbers[1] + '_' + rightColor + '.png'} className={'number right second'} alt={''}/>
        rightNumber1Content =
            <img src={'/ui/numbers/' + rightNumbers[2] + '_' + rightColor + '.png'} className={'number right third'} alt={''}/>
        rightPercentageContent = < img src={"/ui/numbers/p_" + rightColor + '.png'} className={'number right fourth'} alt={''}/>
    } else if (props.rightDamage >= 10) {
        rightBackgroundSource = rightMedium;
        rightNumber10Content =
            <img src={'/ui/numbers/' + rightNumbers[0] + '_' + rightColor + '.png'} className={'number right first'} alt={''}/>
        rightNumber1Content =
            <img src={'/ui/numbers/' + rightNumbers[1] + '_' + rightColor + '.png'} className={'number right second'} alt={''}/>
        rightPercentageContent = < img src={"/ui/numbers/p_" + rightColor + '.png'} className={'number right third'} alt={''}/>
    } else if(props.rightDamage >= 0){
        rightBackgroundSource = rightSmall;
        rightNumber1Content =
            <img src={'/ui/numbers/' + rightNumbers[0] + '_' + rightColor + '.png'} className={'number right first'} alt={''}/>
        rightPercentageContent = < img src={"/ui/numbers/p_" + rightColor + '.png'} className={'number right second'} alt={''}/>
    }

    return (
        props.open ?
            <div style={dropDownPosition} className={'damageIndicator'}>
                <img src={props.leftRed ? middle_redLeft_blueRight : middle_blueLeft_redRight} alt={""}/>
                <img src={leftBackgroundSource} className={'leftBackground'} alt={''}/>
                <img src={rightBackgroundSource} className={'rightBackground'} alt={''}/>
                <img src={"/ui/numbers/p_" + leftColor + '.png'} className={'number left first'} alt={''}/>
                {leftNumber100Content}
                {leftNumber10Content}
                {leftNumber1Content}
                {rightNumber100Content}
                {rightNumber10Content}
                {rightNumber1Content}
                {rightPercentageContent}
            </div>
            :
            null
    );

}

DamageIndicator.propTypes = {
    open: PropTypes.bool,
    y: PropTypes.number,
    x: PropTypes.number,
    leftDamage: PropTypes.number,
    rightDamage: PropTypes.number,
    leftRed: PropTypes.bool,

}

DamageIndicator.defaultProps = {
    open: false,
    y: 0,
    x: 0,
    leftDamage: 0,
    rightDamage: 0,
    leftRed: true,

};

export default DamageIndicator;
