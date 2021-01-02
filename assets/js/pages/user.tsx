import * as React from "react";

import { Redirect } from "react-router";
import { Dimmer, Divider, Header, Loader, Table } from "semantic-ui-react";
import { getReader } from "../services/user_service";
import Reader from "../models/reader";
import UserInterest from "../models/user_interest";

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
    default:
      return state;
  }
};

interface State {
  user: Reader;
  loading: boolean;
  error?: string;
}

interface Action {
  data?: Reader;
  error?: string;
  type: string;
}

interface Props {
  id: string;
}

export const User = (props: Props) => {
  const initialState = {
    user: null,
    loading: true,
    error: null,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    stateReducer,
    initialState
  );

  const fetchData = () => {
    dispatch({ type: "START_LOADING" });
    getReader(props.id)
      .then((reader) => dispatch({ type: "DATA_FETCHED", data: reader }))
      .catch((error) => dispatch({ type: "ERROR", error: error }));
  };

  // load data on page initialized
  React.useEffect(() => {
    fetchData();
  }, []);

  const renderInterest = (interest: UserInterest) => {
    return (
      <Table.Row>
        <Table.Cell>
          <Header as="h4" image>
            <Header.Content>
              {interest.title}
              <Header.Subheader>
                <b>{interest.type}</b>
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
      </Table.Row>
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
              {state.user.name}'s interests ({state.user.interests.edges.length}
              )
            </Header>
            <Divider />
            <Table basic="very" celled collapsing>
              <Table.Body>
                {state.user.interests.edges.map((i_edge) =>
                  renderInterest(i_edge.node)
                )}
              </Table.Body>
            </Table>
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
