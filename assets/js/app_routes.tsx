import * as React from "react";
import { Switch, Route } from "react-router-dom";

import { Login } from "./pages/login";
import { Signup } from "./pages/sign_up";
import { Main } from "./pages/main";

export const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/login" render={() => <Login />} />
      <Route path="/signup" render={() => <Signup />} />
      <Route path="/" render={() => <Main />} />
    </Switch>
  );
};
