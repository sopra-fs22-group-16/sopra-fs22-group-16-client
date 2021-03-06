import { Switch, Route } from "react-router-dom";
import PropTypes from 'prop-types';

import ScanQRCode from "components/views/ScanQRCode";
import LobbyByCode from "components/views/LobbyByCode";
import CreateLobby from "components/views/CreateLobby";
import PublicLobbies from "components/views/PublicLobbies";
import SpecificLobbyRouter from "./SpecificLobbyRouter";

const LobbyRouter = props => {
    /**
     * "this.props.base" is "/lobby" because as been passed as a prop in the parent of LobbyRouter
     *, i.e., AppRouter.js
     */
    return (
        <Switch>
            <Route path={`${props.base}/join/qr`} render={() => {
                return <ScanQRCode />
            }}>
            </Route>
            <Route path={`${props.base}/join/code`} render={() => {
                return <LobbyByCode />
            }}>
            </Route>
            <Route path={`${props.base}/join`} render={() => {
                return <PublicLobbies />
            }}>
            </Route>
            <Route path={`${props.base}/create`} render={() => {
                return <CreateLobby />
            }}>
            </Route>
            <Route path={`${props.base}/:id`} render={({ match }) => {
                const id = parseInt(match.params.id);
                const base = match.url;
                return <SpecificLobbyRouter base={base} id={id} />
            }}>
            </Route>
        </Switch>
    );
};

LobbyRouter.propTypes = {
    base: PropTypes.string.isRequired
}

export default LobbyRouter;