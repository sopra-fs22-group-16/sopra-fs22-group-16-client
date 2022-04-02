import "styles/ui/Popup.scss";

export const Popup = props => (
    <div id={props.id} className="modal">
        <div className="modal_content">
            <p className="label">{props.children}</p>
            <button className="close">Close</button>
        </div>
    </div>
);
