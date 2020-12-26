import * as React from "react";

import { Redirect } from "react-router";
import {
  Dimmer,
  Divider,
  Header,
  Image,
  List,
  Loader,
  Segment,
} from "semantic-ui-react";
import { myInquiries } from "../services/user_service";
import Inquiry from "../models/inquiry";

export const Inquiries = () => {
  const [inquiries, setInquiries] = React.useState<Array<Inquiry> | null>(null);
  const [needsLogin, setNeedsLogin] = React.useState(false);

  React.useEffect(() => {
    const fetchData = () => {
      myInquiries()
        .then((inquiries) => setInquiries(inquiries))
        .catch((error) => {
          console.error(error);
          setNeedsLogin(true);
        });
    };

    fetchData();
  }, []);

  if (needsLogin) {
    return <Redirect to="/login" />;
  } else if (inquiries) {
    return (
      <>
        <Header as="h1">Your Current Inquiries ({inquiries.length})</Header>
        <Divider />
        <List>{inquiries.map((i) => renderInquiry(i))}</List>
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
  const { user, bookInstance } = inquiry;
  return (
    <List.Item>
      <Image avatar src={bookInstance.book.mediumCoverUrl} />
      <List.Content>
        <List.Header as="a">{bookInstance.book.title}</List.Header>
        <List.Description>
          By <b>{user.name}</b> asked for <b>{inquiry.offering}</b>
        </List.Description>
      </List.Content>
    </List.Item>
  );
};
