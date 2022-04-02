import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import Lobby from "components/views/Lobby";
import CreateLobby from "components/views/CreateLobby";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import HomePage from "components/views/HomePage";
import PublicLobbies from "components/views/PublicLobbies";
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
             </Switch>
             <Switch>
            <Route path="/game">
              <GameGuard>
                <GameRouter base="/game"/>
              </GameGuard>
            </Route>
            <Route exact path="/">
              <Redirect to="/game"/>
            </Route>
            <Route exact path="/home-page">
              <LoginGuard>
                <HomePage/>
              </LoginGuard>
            </Route>
            <Route exact path="/public-lobbies">
              <LoginGuard>
                <PublicLobbies/>
              </LoginGuard>
            </Route>
            <Route exact path="/create-lobby">
              <LoginGuard>
                <CreateLobby/>
              </LoginGuard>
            </Route>
            <Route exact path="/update-lobby/:id">
                    <UpdateLobby/>
                </Route>
          </Switch>
         </BrowserRouter>
     );
 };

export default AppRouter;
