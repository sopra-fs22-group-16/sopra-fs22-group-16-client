import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import Lobby from "components/views/Lobby";
import CreateLobby from "components/views/CreateLobby";
import HomePage from "components/views/HomePage";
import PublicLobbies from "components/views/PublicLobbies";
import UpdateLobby from "components/views/UpdateLobby";
import Header from "components/views/Header"
import GameRouter from "components/routing/routers/GameRouter";
import { GameGuard } from "components/routing/routeProtectors/GameGuard";
 
 const AppRouter = () => {
     return (
         <BrowserRouter>
             <Switch>
                 <Route exact path="/lobby/:id">
                 <Header/>
                  <Lobby/>
                 </Route>
                 <Route exact path="/create-lobby">
                 <Header/>
                 <CreateLobby/>
                 </Route>
            <Route exact path="/home-page">
            
                <HomePage/>
            </Route>
            <Route path="/game">
              <GameGuard>
                <GameRouter base="/game"/>
              </GameGuard>
              </Route>
            <Route exact path="/public-lobbies">
                <Header/>
                <PublicLobbies/>
            </Route>
            <Route exact path="/update-lobby/:id">
              <Header/>
              <UpdateLobby/>
                </Route>
          </Switch>
         </BrowserRouter>
     );
 };

export default AppRouter;
