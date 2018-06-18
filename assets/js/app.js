import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from "./app_routes"

render(
  <BrowserRouter>
    <AppRoutes/>
  </BrowserRouter>,
  document.getElementById("container")
)
