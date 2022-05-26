import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import LobbyRouter from "components/routing/routers/LobbyRouter";
import GameRouter from "components/routing/routers/GameRouter";

import LoginUser from "components/views/LoginUser"
import RegisterUser from "components/views/RegisterUser"
import HomePage from "components/views/HomePage";
import Leaderboard from "components/views/Leaderboard";
import InfoPage from "components/views/InfoPage";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/user/register">
                    <RegisterUser />
                </Route>
                <Route exact path="/user/login">
                    <LoginUser />
                </Route>
                <Route exact path="/info">
                    <InfoPage />
                </Route>
                <Route exact path="/leaderboard">
                    <Leaderboard />
                </Route>
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
