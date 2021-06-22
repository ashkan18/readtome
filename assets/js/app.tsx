import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom";
import { AppRoutes } from "./app_routes";


import { QueryClient, QueryClientProvider, QueryCache } from 'react-query'

const queryCache = new QueryCache({
  onError: error => {
    console.log(error)
  },
})
const queryClient = new QueryClient({queryCache})


class App extends React.Component {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("container"));
