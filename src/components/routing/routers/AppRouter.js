import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Lobby from "components/views/Lobby";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/lobby/:id">
                    <Lobby/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;
