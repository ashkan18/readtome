import * as React from "react";
import { Popup, Icon, Menu, Divider } from "semantic-ui-react";
import Reader from "../models/reader";
import { Profile } from "./profile";
import { AddSomethingForm } from "./add_something_form";

interface Props {
  me: Reader | null;
  currentLocation?: any;
}

export const Header = (props: Props) => {
  return (
    <div style={{borderBottom: "2px solid orange", width: "100%"}}>
      <Menu stackable secondary>
        <Menu.Item size={"tiny"} as="a" href="/">
          <h2>
            R<span style={{ fontSize: 10 }}>ead</span>T
            <span style={{ fontSize: 11 }}>o</span>M
            <span style={{ fontSize: 11 }}>e</span>
          </h2>
        </Menu.Item>
        {props.me && (
          <Menu.Menu position={"right"}>
            <Menu.Item icon position="left" style={{paddingRight: 30}}>
              <Popup
                trigger={
                  <Icon.Group size="huge" style={{ cursor: "pointer" }}>
                    <Icon name="heart" color="orange"/>
                    <Icon corner name="add" color="orange"/>
                  </Icon.Group>
                }
                style={{marginRight: 130}}
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
            <Menu.Item position="right" style={{marginRight: 10}}>
              <Profile me={props.me} />
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
    </div>
  );
};
