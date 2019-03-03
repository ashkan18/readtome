import * as React from "react"
import { Popup, Segment, Header as UIHeader, Image, Button, Label } from "semantic-ui-react";
import Reader from "../models/reader";
import { FileUploader } from "./file_uploader";
import UserService from "../services/user_service";

interface Props {
  me: Reader | null
}

interface State{
  editProfile: boolean,
  photos: any
}

export default class Header extends React.Component<Props, State> {
  UserService: UserService
  public constructor(props: Props, context: any) {
    super(props, context)
    this.UserService = new UserService
    this.state = { editProfile: false, photos: this.props.me && this.props.me.photos }
    this.editProfile = this.editProfile.bind(this)
    this.uploadPhoto = this.uploadPhoto.bind(this)
  }
  public render() {
    return(
      <Segment clearing color='orange'>
        <UIHeader as='h4' floated='right'>
        { this.props.me &&
            <>
              <Popup
                key={this.props.me.name}
                trigger={
                  this.state.photos && this.state.photos.length > 0 ?
                    <Image src={this.state.photos[0].thumb} />
                  :
                    <Image src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" avatar/>
                }
                header={this.props.me.name}
                content={
                  <>
                  { this.state.editProfile ?
                  <FileUploader onSelect={this.uploadPhoto}/>
                  :
                  <Button onClick={this.editProfile}>edit</Button>
                  }
                  </>
                }
                position="top right"
                on="click"
              />
            </>
        }
        </UIHeader>
        <UIHeader as='h4' floated='left'>
          Read to me 📖
        </UIHeader>
      </Segment>
    )
  }

  private editProfile() {
    this.setState({editProfile: true})
  }

  private uploadPhoto(file: any) {
    this.UserService.uploadPhoto(file)
    .then( user => this.setState({photos: user.photos, editProfile: false}))
  }
}