import * as React from "react"
import { Popup, Segment, Header as UIHeader, Image, Button, Label } from "semantic-ui-react";
import Reader from "../models/reader";
import { FileUploader } from "./file_uploader";
import UserService from "../services/user_service";
import styled from "styled-components";

interface Props {
  me: Reader | null
}

interface State{
  editProfile: boolean,
  photos: any
}

const HeaderDiv = styled.div`
  padding: 10px;
  display: flex;
  flex-shrink: 1;
  width: 100%;
  flex-direction: row;
  align-self: flex-start;
  justify-content: space-between;
  border-bottom: 2px solid orange;
`

const LogoSection = styled.div`
  align-self: flex-start;
`
const ProfileSection = styled.div`
  align-self: flex-end;
`


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
      <HeaderDiv>
        <LogoSection>
          <h2>R<span style={{fontSize: 10 }}>ead</span>T<span style={{fontSize: 11 }}>o</span>M<span style={{fontSize: 11 }}>e</span></h2>
        </LogoSection>
        { this.props.me &&
            <ProfileSection>
              <Popup
                key={this.props.me.name}
                trigger={
                  this.state.photos && this.state.photos.length > 0 ?
                    <Image src={this.state.photos[0].thumb} size="mini"/>
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
            </ProfileSection>
        }
      </HeaderDiv>
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