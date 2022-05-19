import {Redirect, Route, Switch} from "react-router-dom";
import PropTypes from "prop-types";
import Game from "components/views/game/Game";
import {TokenGuard} from "components/routing/routeProtectors/TokenGuard";

const GameRouter = props => {
    /**
     * "this.props.base" is "/game" because it has been passed as a prop in the parent of GameRouter
     *, i.e., AppRouter.js
     */
    return (
        <Switch>
            <Route exact path={`${props.base}`}>
                <Redirect to={'/home'}/>
            </Route>
            <Switch>
                <TokenGuard>
                    <Route exact path={`${props.base}/:id`} render={({ match }) => {
                        const id = parseInt(match.params.id)
                        return (
                            <Game id={id} />
                        )
                    }} />
                </TokenGuard>
            </Switch>
        </Switch>
    );
};

GameRouter.propTypes = {
    base: PropTypes.string.isRequired
}

export default GameRouter;