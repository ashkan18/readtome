import * as React from "react";

import { MapComponent } from "./map_component";
import { Redirect } from "react-router";
import { getToken } from "../services/auth_service";
import BookInstance from "../models/book_instance";
import { useDebounce } from "../hooks/debounce";
import { Input } from "semantic-ui-react";
import { fetchBooks } from "../services/book_instance_service";
import { Coordinate } from "../models/coordinate";
import { GeolocateControl } from "mapbox-gl";

interface Props {
  location: Coordinate | null;
  geoLocation: GeolocateControl;
  switchPage?: (any) => void;
}

export const Home = (props: Props) => {
  const [bookInstances, setBookInstances] = React.useState<BookInstance[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [error, setError] = React.useState<any>();
  const [needsLogin, setNeedsLogin] = React.useState(false);

  const [offerings, setOfferings] = React.useState<Array<string> | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const search = (
    term: string | null,
    location: Coordinate = props.location
  ) => {
    const token = getToken();
    if (token && location?.lat) {
      setSearching(true);
      fetchBooks(token, term, location.lat, location.lng, offerings)
        .then((bookInstances) => setBookInstances(bookInstances))
        .catch((_error) => setNeedsLogin(true));
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
        setBookInstances([]);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  React.useEffect(() => setSearching(false), [bookInstances]);

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

        <MapComponent
          center={props.location}
          bookInstances={bookInstances}
          geoLocation={props.geoLocation}
          switchPage={props.switchPage}
        />
      </>
    );
  }
};
