import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Lobby from "components/views/Lobby";
import CreateLobby from "components/views/CreateLobby";
import HomePage from "components/views/HomePage";
import PublicLobbies from "components/views/PublicLobbies";
import UpdateLobby from "components/views/UpdateLobby";
import Header from "components/views/Header"
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
                    <Header />
                    <CreateLobby />
                </Route>
                <Route exact path="/lobby/:id">
                    <Header />
                    <Lobby />
                </Route>
                <Route exact path="/public-lobbies">
                    <Header />
                    <PublicLobbies />
                </Route>
                <Route exact path="/update-lobby/:id">
                    <Header />
                    <UpdateLobby />
                </Route>
                <Route exact path="/join-lobby">
                    <Header />
                    <LobbyByCode />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;
