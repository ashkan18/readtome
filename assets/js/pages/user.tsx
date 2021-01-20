import * as React from "react";

import { Redirect, useParams } from "react-router";
import {
  Dimmer,
  Divider,
  Feed,
  Header,
  Loader,
  Image,
  Button,
} from "semantic-ui-react";
import { DateTime } from "luxon";
import { getReader } from "../services/user_service";
import Reader from "../models/reader";
import { UserInterest } from "../models/user_interest";
import { follow } from "../services/connector_service";
import { getToken } from "../services/auth_service";
import { InterestIcon } from "../components/interest_icon";
import { interestTypeString } from "../util";

const stateReducer = (state, action) => {
  switch (action.type) {
    case "START_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "DATA_FETCHED":
      return {
        ...state,
        user: action.data,
        loading: false,
      };
    case "NOW_FOLLOWING":
      return {
        ...state,
        loading: false,
        following: true,
      };
    default:
      return state;
  }
};

interface State {
  user: Reader;
  loading: boolean;
  following: boolean;
  error?: string;
}

interface Action {
  data?: Reader;
  error?: string;
  type: string;
}

export const User = () => {
  const { userId } = useParams<{ userId: string }>();
  const initialState = {
    user: null,
    loading: true,
    following: false,
    error: null,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    stateReducer,
    initialState
  );

  const fetchData = () => {
    dispatch({ type: "START_LOADING" });
    getReader(userId)
      .then((reader) => dispatch({ type: "DATA_FETCHED", data: reader }))
      .catch((error) => dispatch({ type: "ERROR", error: error }));
  };

  // load data on page initialized
  React.useEffect(() => {
    fetchData();
  }, []);

  const followUser = () => {
    dispatch({ type: "START_LOADING" });
    follow(getToken(), userId)
      .then((_follow) => dispatch({ type: "NOW_FOLLOWING" }))
      .catch((_error) =>
        dispatch({ type: "ERROR", error: "Could not follow" })
      );
  };

  const renderInterest = (interest: UserInterest) => {
    return (
      <Feed.Event>
        <Feed.Label>
          <InterestIcon type={interest.type} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <b>{interestTypeString(interest.type)}</b>
            <Feed.User as="a" href={interest.ref}>
              <i>{interest.title}</i>
            </Feed.User>{" "}
            by{" "}
            {interest.creators.edges
              .map<React.ReactNode>((i_edge) => (
                <a href={`/creators/${i_edge.node.id}`}> {i_edge.node.name} </a>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
            <Feed.Date>
              {DateTime.fromISO(interest.insertedAt, {
                zone: "utc",
              }).toRelative()}
            </Feed.Date>
          </Feed.Summary>

          {interest.thumbnail && (
            <Feed.Extra images>
              <Image
                src={interest.thumbnail}
                size="mini"
                style={{ width: "100px" }}
              />
            </Feed.Extra>
          )}
        </Feed.Content>
      </Feed.Event>
    );
  };

  if (state.error) {
    return <Redirect to="/login" />;
  } else if (state.user) {
    return (
      <>
        {state.loading && (
          <Dimmer active inverted>
            <Loader inverted content="Loading" />
          </Dimmer>
        )}
        {state.user.interests && (
          <>
            <Header as="h1">
              {state.user.name}'s things ({state.user.interests.edges.length})
              {!state.user.amIFollowing && !state.following && (
                <Button basic color="orange" onClick={() => followUser()}>
                  Follow
                </Button>
              )}
              {(state.user.amIFollowing || state.following) && <>✅</>}
            </Header>
            <Divider />
            <Feed>
              {state.user.interests.edges.map((i_edge) =>
                renderInterest(i_edge.node)
              )}
            </Feed>
          </>
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
