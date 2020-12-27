import * as React from "react";

import { Redirect } from "react-router";
import {
  Button,
  Dimmer,
  Divider,
  Form,
  FormGroup,
  Header,
  Image,
  List,
  Loader,
  Table,
} from "semantic-ui-react";
import { myActivity, MyActivityResponse } from "../services/user_service";
import Inquiry from "../models/inquiry";

export const Inquiries = () => {
  const [activities, setActivities] = React.useState<MyActivityResponse | null>(
    null
  );
  const [needsLogin, setNeedsLogin] = React.useState(false);

  React.useEffect(() => {
    const fetchData = () => {
      myActivity()
        .then((activities) => setActivities(activities))
        .catch((error) => {
          console.error(error);
          setNeedsLogin(true);
        });
    };

    fetchData();
  }, []);

  if (needsLogin) {
    return <Redirect to="/login" />;
  } else if (activities) {
    return (
      <>
        <Header as="h1">
          Your Current Requests ({activities.requests.length})
        </Header>
        <Divider />
        <Table basic="very" celled collapsing>
          <Table.Body>
            {activities.requests.map((i) => renderRequest(i))}
          </Table.Body>
        </Table>
        <Divider />
        <Header as="h1">
          Your Current Inquiries ({activities.inquiries.length})
        </Header>
        <Divider />
        <Table basic="very" celled collapsing>
          {activities.inquiries.map((i) => renderInquiry(i))}
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
              You asked for <b>{offering}</b>
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Table.Cell>
    </Table.Row>
  );
};

const renderRequest = (request: Inquiry) => {
  const { user, bookInstance, offering } = request;
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
          <Button>hm...no</Button>
          <Button.Or />
          <Button positive>Let's!</Button>
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  );
};
