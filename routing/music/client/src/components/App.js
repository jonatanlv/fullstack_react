import React from "react";

import TopBar from "./TopBar";
import AlbumsContainer from "./AlbumsContainer";

import "../styles/App.css";
import { Route, Redirect } from "react-router-dom";
import Logout from "./Logout";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

const App = () => (
  <div className="ui grid">
    <TopBar />
    <div className="spacer row" />
    <div className="row">
      <PrivateRoute path="/albums" component={AlbumsContainer} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route exact path="/" render={() => <Redirect to="/albums" />} />
    </div>
  </div>
);

export default App;
