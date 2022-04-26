import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import LobbyRouter from "components/routing/routers/LobbyRouter";
import GameRouter from "components/routing/routers/GameRouter";

import HomePage from "components/views/HomePage";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/home" />
                </Route>
                <Route exact path="/home">
                    <HomePage />
                </Route>
                <Route path="/lobby">
                    <LobbyRouter base="/lobby" />
                </Route>
                <Route path="/game">
                    <GameRouter base="/game" />
                </Route>
                <Route path="*">
                    <Redirect to="/home" />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;
