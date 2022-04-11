import 'styles/ui/BaseContainer.scss';
import PropTypes from "prop-types";
import Header from "./Header";


const BaseContainer = props => (
    <div>
        <div {...props} className={`base-container ${props.className ?? ''}`}>
            <Header/>
            {props.children}
        </div>
    </div>
);

BaseContainer.propTypes = {
    children: PropTypes.node,
};

export default BaseContainer;