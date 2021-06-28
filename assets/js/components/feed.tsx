import React from "react";
import { Container, Dimmer, Divider, Header, Loader, Feed } from "semantic-ui-react";
import { Connection } from "../models/connection";
import { UserInterest } from "../models/user_interest";
import { FeedItem } from "./feed_item";

interface Props {
  userInterests: Connection<UserInterest>,
  minimal?: boolean
}


export const FeedComponent = (props: Props) => {
  if (props.userInterests) {
    return (
      <Feed size="small">
        {props.userInterests.edges.map((i_edge) => <FeedItem userInterest={i_edge.node} key={i_edge.node.id} minimal={props.minimal}/>)}
      </Feed>
    )
  } 
}