import * as React from "react";

import { MapComponent } from "./map_component";
import { Redirect } from "react-router";
import { getToken } from "../services/auth_service";
import { useDebounce } from "../hooks/debounce";
import { Dimmer, Input, Loader } from "semantic-ui-react";
import { Coordinate } from "../models/coordinate";
import { UserInterest } from "../models/user_interest";
import { fetchUserInterest } from "../services/interest_service";

interface Props {
  location: Coordinate;
  switchPage?: (any) => void;
}

export const Home = (props: Props) => {
  const [userInterests, setUserInterests] = React.useState<UserInterest[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [error, setError] = React.useState<any>();
  const [needsLogin, setNeedsLogin] = React.useState(false);

  const [searchTerm, setSearchTerm] = React.useState<string>();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const search = (
    term: string | null,
    location: Coordinate = props.location
  ) => {
    const token = getToken();
    if (token && location?.lat) {
      setSearching(true);
      fetchUserInterest(token, term, location.lat, location.lng)
        .then((userInterests) => setUserInterests(userInterests))
        .catch((_error) => setNeedsLogin(false));
    }
  };

  React.useEffect(() => {
    setTimeout(() => search(null, props.location), 1000);
  }, [props.location]);

  React.useEffect(
    () => {
      if (debouncedSearchTerm) {
        search(debouncedSearchTerm);
      } else {
        setUserInterests([]);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  React.useEffect(() => setSearching(false), [userInterests]);

  if (needsLogin) {
    return <Redirect to="/login" />;
  } else if (error) {
    return <div> Error {error.message} </div>;
  } else {
    return (
      <>
        <Input
          placeholder="Search By Title, Author..."
          fluid
          icon="search"
          loading={searching}
          onChange={(_event, { value }) => setSearchTerm(value)}
        />
        {!props.location && (
          <Dimmer active inverted>
            <Loader inverted content="Getting your location..." />
          </Dimmer>
        )}
        {props.location && (
          <MapComponent
            center={props.location}
            userInterests={userInterests}
            switchPage={props.switchPage}
          />
        )}
      </>
    );
  }
};
