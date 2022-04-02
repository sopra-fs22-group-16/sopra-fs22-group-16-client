import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Lobby from "components/views/Lobby";
import CreateLobby from "components/views/CreateLobby";
import UpdateLobby from "components/views/UpdateLobby";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/lobby/:id">
                    <Lobby/>
                </Route>
                <Route exact path="/create-lobby">
                    <CreateLobby/>
                </Route>
                <Route exact path="/update-lobby/:id">
                    <UpdateLobby />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;
