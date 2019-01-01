import * as React from "react"
import styled from "styled-components"
import { Popup, Image } from "semantic-ui-react";
import Reader from "js/models/reader";

const StyledHeader = styled.div`
  width: 100%;
  text-align: right;
  padding: 10px;
`

interface Props {
  me?: Reader
}

export default class Header extends React.Component<Props, {}> {
  public render() {
    return(
      <StyledHeader>
        { this.props.me &&
            <Popup
              key={this.props.me.name}
              trigger={<Image src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" avatar />}
              header={this.props.me.name}
              content={this.props.me.sex}
              position="top right"
            />
        }
      </StyledHeader>
    )
  }
}