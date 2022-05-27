import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import Lobby from "../../views/lobby/Lobby";
import UpdateLobby from "../../views/lobby/UpdateLobby";
import ShareQRCode from "../../views/lobby/ShareQRCode";
import ShareLobbyCode from "../../views/lobby/ShareLobbyCode";

const SpecificLobbyRouter = props => {
    /**
     * "this.props.base" is "/lobby" because as been passed as a prop in the parent of LobbyRouter
     *, i.e., AppRouter.js
     */


    return (
        <div>
            <Switch>
                <Route exact path={`${props.base}`} render={() => {
                    return <Lobby id={props.id} />
                }} />
                <Route exact path={`${props.base}/update`} render={() => {
                    return <UpdateLobby id={props.id} />
                }} />
                <Route exact path={`${props.base}/share/qr`} render={() => {
                    return <ShareQRCode id={props.id} />
                }} />
                <Route exact path={`${props.base}/invite-users`} render={() => {
                    return <ShareLobbyCode id={props.id} />
                }} />
            </Switch>
        </div>
    );
}


SpecificLobbyRouter.propTypes = {
    base: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
}

export default SpecificLobbyRouter;
