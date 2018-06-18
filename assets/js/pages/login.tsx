import * as React from "react"

export default class Login extends React.Component<{}, {}> {
  public render() {
    return(
      <div>
        <input type="text" placeholder="Username"/>
        <input type="password" placeholder="Password"/>
      </div>
    )
  }
}