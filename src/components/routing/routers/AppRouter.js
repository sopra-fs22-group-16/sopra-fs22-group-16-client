import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import Lobby from "components/views/Lobby";
 import CreateLobby from "components/views/CreateLobby";
 
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
         </BrowserRouter>
     );
 };
};

export default AppRouter;
