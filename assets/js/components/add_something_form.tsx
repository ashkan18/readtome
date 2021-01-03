import React, { useState } from "react";
import { Button, Form, FormGroup } from "semantic-ui-react";
import { getToken } from "../services/auth_service";
import { addInterest } from "../services/interest_service";

export const AddSomethingForm = () => {
  const [title, setTitle] = useState<string>();
  const [link, setLink] = useState<string>();
  const [creatorNames, setCreatorNames] = useState<string>();
  const [type, setType] = useState<string>();
  const [created, setCreated] = useState(false);
  const submit = () => {
    const token = getToken();

    addInterest(token, title, link, type, creatorNames.split(",")).then(() =>
      setCreated(true)
    );
  };

  return (
    <>
      {!created && (
        <Form>
          <Form.Group inline>
            <Form.Field
              label="Read"
              control="input"
              type="radio"
              name="type"
              onChange={(e) => setType("READ")}
            />
            <Form.Field
              label="Listened"
              control="input"
              type="radio"
              name="type"
              onChange={(e) => setType("LISTENED")}
            />
            <Form.Field
              label="Watched"
              control="input"
              type="radio"
              name="type"
              onChange={(e) => setType("WATCHED")}
            />
            <Form.Field
              label="Saw"
              control="input"
              type="radio"
              name="type"
              onChange={(e) => setType("SAW")}
            />
          </Form.Group>
          <Form.Field>
            <Form.Input
              type="text"
              label="Title"
              placeholder="Title"
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Link"
              placeholder="Link"
              onChange={(event) => setLink(event.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="By Who?"
              placeholder="List creator names comma separated"
              onChange={(event) => setCreatorNames(event.target.value)}
            />
          </Form.Field>
          <FormGroup>
            <Button onClick={() => submit()}>Offer!</Button>
          </FormGroup>
        </Form>
      )}
      {created && <div>Thanks for sharing your thingy!</div>}
    </>
  );
};
