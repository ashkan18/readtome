import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom";
import { AppRoutes } from "./app_routes";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("container"));
