import 'styles/ui/BaseContainer.scss';
import PropTypes from "prop-types";
import Header from "./Header";


const BaseContainer = props => (
    <div>
        <div className={`base-container ${props.className ?? ''}`}>
            <Header
             logOutBool = {props.logOutBool}
            />
            {props.children}
        </div>
    </div>
);

BaseContainer.propTypes = {
    children: PropTypes.node,
    logOutBool: PropTypes.bool
};

export default BaseContainer;