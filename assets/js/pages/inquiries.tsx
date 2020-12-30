import * as React from "react";

import { Redirect } from "react-router";
import {
  Button,
  Dimmer,
  Divider,
  Header,
  Image,
  Loader,
  Table,
} from "semantic-ui-react";
import { myActivity, MyActivityResponse } from "../services/user_service";
import Inquiry from "../models/inquiry";
import { accept, reject } from "../services/connector_service";
import { getToken } from "../services/auth_service";

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
        activities: action.data,
        loading: false,
      };
    default:
      return state;
  }
};

interface State {
  activities: MyActivityResponse | null;
  loading: boolean;
  error?: string;
}

interface Action {
  data?: MyActivityResponse;
  error?: string;
  type: string;
}

export const Inquiries = () => {
  const initialState = {
    activities: null,
    loading: true,
    error: null,
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    stateReducer,
    initialState
  );

  const fetchData = () => {
    dispatch({ type: "START_LOADING" });
    myActivity()
      .then((activity) => dispatch({ type: "DATA_FETCHED", data: activity }))
      .catch((error) => dispatch({ type: "ERROR", error: error }));
  };

  const respond = (inquiryId: string, response: boolean) => {
    dispatch({ type: "START_LOADING" });
    if (response) {
      accept(getToken(), inquiryId)
        .then((_) => fetchData())
        .catch((e) => console.log(e));
    } else {
      reject(getToken(), inquiryId)
        .then((_) => fetchData())
        .catch((e) => console.log(e));
    }
  };

  // load data on page initialized
  React.useEffect(() => {
    fetchData();
  }, []);

  const renderInquiry = (inquiry: Inquiry) => {
    const { bookInstance, offering } = inquiry;
    return (
      <Table.Row>
        <Table.Cell>
          <Header as="h4" image>
            <Image avatar src={bookInstance.book.mediumCoverUrl} size="small" />
            <Header.Content>
              {bookInstance.book.title}
              <Header.Subheader>
                You asked for <b>{offering} from {bookInstance.reader.name}</b>
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
      </Table.Row>
    );
  };

  const renderRequest = (request: Inquiry) => {
    const { id, user, bookInstance, offering } = request;
    return (
      <Table.Row>
        <Table.Cell width={12}>
          <Header as="h4" image>
            <Image avatar src={bookInstance.book.mediumCoverUrl} size="small" />
            <Header.Content>
              {bookInstance.book.title}
              <Header.Subheader>
                <b>{user.name}</b> asked for <b>{offering}</b>
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell width={3}>
          <Button.Group>
            <Button onClick={() => respond(id, true)}>hm...no</Button>
            <Button.Or />
            <Button positive onClick={() => respond(id, false)}>
              Let's!
            </Button>
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    );
  };

  if (state.error) {
    return <Redirect to="/login" />;
  } else if (state.activities) {
    return (
      <>
        {state.loading && (
          <Dimmer active inverted>
            <Loader inverted content="Loading" />
          </Dimmer>
        )}
        <Header as="h1">
          Your Current Requests ({state.activities.requests.length})
        </Header>
        <Divider />
        <Table basic="very" celled collapsing>
          <Table.Body>
            {state.activities.requests.map((i) => renderRequest(i))}
          </Table.Body>
        </Table>
        <Divider />
        <Header as="h1">
          Your Current Inquiries ({state.activities.inquiries.length})
        </Header>
        <Divider />
        <Table basic="very" celled collapsing>
          {state.activities.inquiries.map((i) => renderInquiry(i))}
        </Table>
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
