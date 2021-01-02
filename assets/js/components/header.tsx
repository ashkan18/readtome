import * as React from "react";
import { Popup, Header as UIHeader, Icon, Menu } from "semantic-ui-react";
import Reader from "../models/reader";
import styled from "styled-components";
import { Profile } from "./profile";
import { BookSubmission } from "./book_submit";

interface Props {
  me: Reader | null;
  currentLocation?: any;
  switchPage?: (any) => void;
}

const HeaderDiv = styled.div`
  border-bottom: 2px solid orange;
`;

export const Header = (props: Props) => {
  return (
    <HeaderDiv>
      <Menu stackable secondary>
        <Menu.Item size={"tiny"}>
          <h2 onClick={() => props.switchPage({ ref: "home" })}>
            R<span style={{ fontSize: 10 }}>ead</span>T
            <span style={{ fontSize: 11 }}>o</span>M
            <span style={{ fontSize: 11 }}>e</span>
          </h2>
        </Menu.Item>
        {props.me && (
          <Menu.Menu position={"right"}>
            <Menu.Item>
              <Popup
                trigger={
                  <Icon
                    name="plus square outline"
                    size="large"
                    style={{ cursor: "pointer" }}
                  />
                }
                header="Add New Book"
                content={
                  <BookSubmission currentLocation={props.currentLocation} />
                }
                position="top center"
                on="click"
              />
            </Menu.Item>
            <Menu.Item>
              <Icon
                name="mail"
                size="large"
                style={{ cursor: "pointer" }}
                onClick={() => props.switchPage({ ref: "inquiries" })}
              />
            </Menu.Item>
            <Menu.Item>
              <Profile me={props.me} />
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
    </HeaderDiv>
  );
};
