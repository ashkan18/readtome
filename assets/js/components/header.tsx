import * as React from "react"
import Search from "./search"

export default class Header extends React.Component<{}, {}> {
  public render() {
    return(
      <header className="header">
        <Search />
      </header>
    )
  }
}