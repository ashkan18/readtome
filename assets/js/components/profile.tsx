import { Popup, Image, Menu } from "semantic-ui-react";
import React, { useState } from "react";
import Reader from "../models/reader";
import { uploadPhoto } from "../services/user_service";

interface Props {
  me: Reader;
}

export const Profile = (props: Props) => {
  const { me } = props;
  return (
    <Popup
      key={me.name}
      trigger={
        me.photos.length > 0 ? (
          <Image
            circular
            src={me.photos[0].thumb}
            size="tiny"
            style={{ padding: 0 }}
          />
        ) : (
            <Image
              src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg"
              avatar
            />
          )
      }
      header={`Welcome ${me.name}`}
      content={
        <>
          <Menu size="small" vertical>
            <Menu.Item as="a" name="Edit" href="/profile" />
            <Menu.Item as="a" name="feed" href={`/users/${me.id}`} />
          </Menu>
        </>
      }
      position="top right"
      on="click"
    />
  );
};
