import { Switch, Redirect, Route } from "react-router-dom";
import PropTypes from 'prop-types';

import { TokenGuard } from "components/routing/routeProtectors/TokenGuard";

import Lobby from "components/views/lobby/Lobby";
import UpdateLobby from "components/views/lobby/UpdateLobby";
import ShareQRCode from "components/views/lobby/ShareQRCode";
import ShareLobbyCode from "components/views/lobby/ShareLobbyCode";
import ScanQRCode from "components/views/ScanQRCode";
import LobbyByCode from "components/views/LobbyByCode";
import CreateLobby from "components/views/CreateLobby";
import PublicLobbies from "components/views/PublicLobbies";

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
                    <Route path={`${props.base}/join/qr`} render={() => {
                        return <ScanQRCode />
                    }} >
                    </Route>
                    <Route path={`${props.base}/join/code`} render={() => {
                        return <LobbyByCode />
                    }} >
                    </Route>
                    <Route path={`${props.base}/join`} render={() => {
                        return <PublicLobbies />
                    }} >
                    </Route>
                    <Route path={`${props.base}/create`} render={() => {
                        return <CreateLobby />
                    }} >
                    </Route>
                    <TokenGuard>
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
                        <Route path={`${props.base}/:id/invite-users`} render={({ match }) => {
                            const id = parseInt(match.params.id)
                            return <ShareLobbyCode id={id} />
                        }} >
                        </Route>
                    </TokenGuard>
                </Switch>
            </Switch>
        </div>
    );
};

LobbyRouter.propTypes = {
    base: PropTypes.string.isRequired
}

export default LobbyRouter;