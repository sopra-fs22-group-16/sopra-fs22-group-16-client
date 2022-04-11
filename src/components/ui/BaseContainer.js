import 'styles/ui/BaseContainer.scss';
import PropTypes from "prop-types";
import Header from 'components/views/Header';

const BaseContainer = props => (
  <div>
    <Header />
    <div {...props} className={`base-container ${props.className ?? ''}`}>
      {props.children}
    </div>
  </div>
);

BaseContainer.propTypes = {
  children: PropTypes.node,
};

export default BaseContainer;