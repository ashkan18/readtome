import * as React from "react";
import { Popup, Icon, Menu, Divider, Input } from "semantic-ui-react";
import Reader from "../models/reader";
import { Profile } from "./profile";
import { AddSomethingForm } from "./add_something_form";
import { Logo } from "./logo";

interface Props {
  me: Reader | null;
  currentLocation?: any;
}

export const Header = (props: Props) => {
  return (
    <div style={{ borderBottom: "2px solid orange", width: "100%" }}>
      <Menu stackable secondary>
        <Menu.Item size={"tiny"} as="a" href="/">
          <Logo/>
        </Menu.Item>
        {props.me && (
          <Menu.Menu position={"right"}>
            <Menu.Item icon position="left" style={{ paddingRight: 30 }}>
              <Popup
                trigger={
                  <Icon.Group size="big" style={{ cursor: "pointer" }}>
                    <Icon name="heart" style={{ color: "#337BB3" }} />
                    <Icon corner name="add" color="orange" />
                  </Icon.Group>
                }
                style={{ marginRight: 130 }}
                header={
                  <>
                    <h3>Add Something</h3>
                    <Divider />
                  </>
                }
                content={
                  <AddSomethingForm currentLocation={props.currentLocation} />
                }
                position="top center"
                on="click"
              />
            </Menu.Item>
            <Menu.Item position="right" style={{ marginRight: 10 }}>
              <Profile me={props.me} />
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
    </div>
  );
};
