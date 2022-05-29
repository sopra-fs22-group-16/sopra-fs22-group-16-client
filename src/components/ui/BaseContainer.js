import 'styles/ui/BaseContainer.scss';
import PropTypes from "prop-types";
import Header from "./Header";


const BaseContainer = props => (
    <div>
        <div className={`base-container ${props.className ?? ''}`}>
            <Header
             noHeaderIcons= {props.noHeaderIcons}
            />
            {props.children}
        </div>
    </div>
);

BaseContainer.propTypes = {
    children: PropTypes.node,
    noHeaderIcons: PropTypes.bool,
};

export default BaseContainer;