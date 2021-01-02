import * as React from "react";
import { Switch, Route } from "react-router-dom";

import { Login } from "./pages/login";
import { Signup } from "./pages/sign_up";
import { Main } from "./pages/main";

export default class AppRoutes extends React.Component<{}, {}> {
  public constructor(props: any, context: any) {
    super(props, context);
    this.authenticate = this.authenticate.bind(this);
  }

  public render() {
    return (
      <Switch>
        <Route path="/login" render={() => <Login />} />
        <Route path="/signup" render={() => <Signup />} />
        <Route path="/" render={() => <Main />} />
      </Switch>
    );
  }

  public authenticate(token: string) {
    this.setState({
      token: token,
      isLoggedIn: true,
    });
  }
}
