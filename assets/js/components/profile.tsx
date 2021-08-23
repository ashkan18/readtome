import { Popup, Image, Menu } from "semantic-ui-react";
import React from "react";
import Reader from "../models/reader";

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
            avatar
            src={me.photos[0].thumb}
            style={{ padding: 0 }}
            size={"mini"}
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
            <Menu.Item as="a" name="My Profile" href="/profile" />
            <Menu.Item as="a" name="My feed" href={`/users/${me.id}`} />
          </Menu>
        </>
      }
      position="top right"
      on="click"
    />
  );
};
