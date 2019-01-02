import * as React from "react"
import { Popup, Segment, Header as UIHeader, Image } from "semantic-ui-react";
import Reader from "js/models/reader";

interface Props {
  me?: Reader
}

export default class Header extends React.Component<Props, {}> {
  public render() {
    return(
      <Segment clearing color='orange'>
        <UIHeader as='h4' floated='right'>
        { this.props.me &&
            <Popup
              key={this.props.me.name}
              trigger={<Image src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" avatar/>}
              header={this.props.me.name}
              content={this.props.me.sex}
              position="top right"
            />
        }
        </UIHeader>
        <UIHeader as='h4' floated='left'>
          Read to me 📖
        </UIHeader>
      </Segment>
    )
  }
}