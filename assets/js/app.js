import * as React from "react"
import { render } from "react-dom"
import Header from "./components/header"
import Main from "./components/main"

let coordinate = {lat: 40.6904832, lng: -73.9753984}
render(
  <div>
    <Header/>
    <Main initialCoordinate={coordinate} />
  </div>,
  document.getElementById("container")
)
