import * as React from "react"
import styled from "styled-components"

const StyledHeader = styled.div`
  width: 100%
  text-align: center
  padding: 10px
`

export default class Header extends React.Component<{}, {}> {
  public render() {
    return(
      <StyledHeader>
        ReadToMe!
      </StyledHeader>
    )
  }
}