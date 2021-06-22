import * as React from "react";

import { Redirect, useParams } from "react-router";
import {
  Dimmer,
  Divider,
  Feed,
  Header,
  Loader,
  Button,
  Container,
} from "semantic-ui-react";
import { getReader } from "../services/user_service";
import { follow } from "../services/connector_service";
import { getToken } from "../services/auth_service";
import { useMutation, useQuery } from "react-query";
import { Interest } from "../components/interest";


export const User = () => {
  const { userId } = useParams<{ userId: string }>();

  const {data: user, error, isLoading}  = useQuery(['myFeed', userId], () => getReader(userId))
  const followUser = useMutation(() => follow(getToken(), userId))
  
  const initialState = {
    following: false,
    error: null,
  };
  
  
  if (error) {
    return <Redirect to="/login" />;
  }

  if (user) {
    return (
      <>
        {isLoading && (
          <Dimmer active inverted>
            <Loader inverted content="Loading" />
          </Dimmer>
        )}
        {user.interests && (
          <Container style={{ marginTop: "20px" }}>
            <Header as="h1">
              {user.name}'s things ({user.interests.edges.length})
              {!user.amIFollowing && !followUser.data && (
                <Button basic color="orange" onClick={() => followUser.mutate()}>
                  Follow
                </Button>
              )}
              {(user.amIFollowing || followUser.data) && <>✅</>}
            </Header>
            <Divider />
            <Feed>
              {user.interests.edges.map((i_edge) =>
                <Interest interest={i_edge.node} key={i_edge.node.id}/>
              )}
            </Feed>
          </Container>
        )}
      </>
    );
  } else {
    return (
      <Dimmer active inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
    );
  }
};
