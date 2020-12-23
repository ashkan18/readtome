
import { FileUploader } from "./file_uploader"
import { Popup, Image, Button, Menu, Label } from "semantic-ui-react"
import styled from "styled-components";
import React, { useState } from "react";
import Reader from "../models/reader";
import { uploadPhoto } from "../services/user_service";

const ProfileSection = styled.div`
  align-self: flex-end;
`

interface Props {
  me: Reader
}

export const Profile = (props: Props) => {

  const [photos, setPhotos] = useState(props.me && props.me.photos || [])
  const [activeItem, setActiveItem] = useState<string>()

  const uploadProfilePhoto = (file: any) => {
    uploadPhoto(file)
    .then( user => setPhotos(user.photos))
  }

  const handleItemClick = (e, { name }) => setActiveItem(name)

  return(
    <ProfileSection>
      <Popup
        key={props.me.name}
        trigger={
          photos && photos.length > 0 ?
            <Image src={photos[0].thumb} size="mini"/>
          :
            <Image src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" avatar/>
        }
        header={`Welcome ${props.me.name}`}
        content={
          <>

          <Menu size='small' vertical>
            <Menu.Item
              name='inbox'
              active={activeItem == 'inbox'}
              onClick={handleItemClick}
            >
            </Menu.Item>

            <Menu.Item
              name='edit'
              active={activeItem === 'edit'}
              onClick={handleItemClick}
            > 
            </Menu.Item>
          </Menu>
          {activeItem === 'edit' && <FileUploader onSelect={uploadProfilePhoto}/>}
          </>
        }
        position="top right"
        on="click"
      />
    </ProfileSection>
  )
}