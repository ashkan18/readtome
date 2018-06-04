import * as React from "react"
import { render } from "react-dom"
import Header from "./components/header"
import Map from "./components/map"
import Coordinate from "./models/coordinate"
//import Main from "./main"

let coordinate = {lat: 123, lng: 321}
render(
  <div>
    <Header/>
    <Map initialCoordinate={coordinate} />
  </div>,
  document.getElementById("container")
)
