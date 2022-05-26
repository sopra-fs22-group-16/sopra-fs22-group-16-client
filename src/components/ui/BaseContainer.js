import 'styles/ui/BaseContainer.scss';
import PropTypes from "prop-types";
import Header from "./Header";


const BaseContainer = props => (
    <div>
        <div className={`base-container ${props.className ?? ''}`}>
            <Header
             noLogOutBool = {props.noLogOutBool}
            />
            {props.children}
        </div>
    </div>
);

BaseContainer.propTypes = {
    children: PropTypes.node,
    noLogOutBool: PropTypes.bool,
    //isRegistered: PropTypes.bool
};

export default BaseContainer;