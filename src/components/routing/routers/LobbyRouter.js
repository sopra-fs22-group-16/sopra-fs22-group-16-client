import { Switch, Redirect, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import Lobby from "components/views/Lobby";
import UpdateLobby from "components/views/UpdateLobby";
import ShareQRCode from "components/views/ShareQRCode";
import ScanQRCode from "components/views/ScanQRCode";
import LobbyByCode from "components/views/LobbyByCode";

const LobbyRouter = props => {
    /**
     * "this.props.base" is "/lobby" because as been passed as a prop in the parent of LobbyRouter
     *, i.e., AppRouter.js
     */
    return (
        <div>
            <Switch>
                <Route exact path={`${props.base}`}>
                    <Redirect to={'/home'} />
                </Route>
                <Switch>
                    <Route exact path={`${props.base}/:id`} render={({ match }) => {
                        const id = parseInt(match.params.id)
                        return <Lobby id={id} />
                    }} >
                    </Route>
                    <Route path={`${props.base}/:id/update`} render={({ match }) => {
                        const id = parseInt(match.params.id)
                        return <UpdateLobby id={id} />
                    }} >
                    </Route>
                    <Route path={`${props.base}/:id/share/qr`} render={({ match }) => {
                        const id = parseInt(match.params.id)
                        return <ShareQRCode id={id} />
                    }} >
                    </Route>
                    <Route path={`${props.base}/scan/qr`} render={() => {
                        return <ScanQRCode/>
                    }} >
                    </Route>
                    <Route path={`/join-lobby`} render={() => {
                        return <LobbyByCode />
                    }} >
                    </Route>
                </Switch>
            </Switch>
        </div>
    );
};

LobbyRouter.propTypes = {
    base: PropTypes.string.isRequired
}

export default LobbyRouter;