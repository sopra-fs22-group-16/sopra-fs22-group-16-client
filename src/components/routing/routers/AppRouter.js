import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import LobbyRouter from "./LobbyRouter";
import CreateLobby from "components/views/CreateLobby";
import HomePage from "components/views/HomePage";
import PublicLobbies from "components/views/PublicLobbies";
import GameRouter from "./GameRouter";
import LobbyByCode from "components/views/LobbyByCode";

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
                <Route exact path="/create-lobby">
                    <CreateLobby />
                </Route>
                <Route exact path="/public-lobbies">
                    <PublicLobbies />
                </Route>
                <Route path="/lobby">
                    <LobbyRouter base="/lobby" />
                </Route>
                <Route path="/game">
                    <GameRouter base="/game" />
                </Route>

                <Route path="/join-lobby">
                    <LobbyByCode />
                </Route>
                <Route path="*">
                    <Redirect to="/home" />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;
