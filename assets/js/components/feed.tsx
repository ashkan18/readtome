import React from "react";
import { Container, Dimmer, Divider, Header, Loader, Feed } from "semantic-ui-react";
import { Connection } from "../models/connection";
import { UserInterest } from "../models/user_interest";
import { FeedItem } from "./feed_item";

interface Props {
  userInterests: Connection<UserInterest>,
  loading?: boolean
}


export const FeedComponent = (props: Props) => {
  return (<Container style={{ backgroundColor: '#black' }}>
    {props.loading && (
      <Dimmer active inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
    )}
    {props.userInterests && (
      <Feed size="small">
        {props.userInterests.edges.map((i_edge) => <FeedItem userInterest={i_edge.node} />)}
      </Feed>
    )}
  </Container>)
}