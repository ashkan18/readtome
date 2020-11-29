import * as React from "react";

import { Header } from "../components/header";
import { MapComponent } from "../components/map_component";
import { Redirect } from "react-router";
import BookInstanceService from "../services/book_instance_service";
import AuthService from "../services/auth_service";
import Reader from "../models/reader";
import BookInstance from "../models/book_instance";
import MainLayout from "../components/main_layout";
import UserService from "../services/user_service";
import { GeolocateControl } from "mapbox-gl";
import { useDebounce } from "../hooks/debounce";
import { Input } from "semantic-ui-react";

//let defaultCoordinate = {lat: 40.690008, lng: -73.9857765}
interface Props {
  bookInstanceService: BookInstanceService;
  authService: AuthService;
  userService: UserService;
}

export const Home = (props: Props) => {
  const geoLocation = new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
    trackUserLocation: false,
  });

  const [bookInstances, setBookInstances] = React.useState<BookInstance[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [error, setError] = React.useState<any>();
  const [needsLogin, setNeedsLogin] = React.useState(false);
  const [me, setMe] = React.useState<Reader | null>(null);
  const [offerings, setOfferings] = React.useState<Array<string> | null>(null);
  const [currentLocation, setCurrentLocation] = React.useState<any | null>(
    null
  );
  const [searchTerm, setSearchTerm] = React.useState<string>();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const search = (term: string | null) => {
    const coordination = currentLocation; //|| defaultCoordinate
    const token = props.authService.getToken();
    if (token) {
      setSearching(true);
      props.bookInstanceService
        .fetchBooks(token, term, coordination.lat, coordination.lng, offerings)
        .then((bookInstances) => setBookInstances(bookInstances))
        .catch((_error) => setNeedsLogin(true));
    }
  };

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

  geoLocation.on("geolocate", (data) => {
    const { latitude, longitude } = data.coords;
    setCurrentLocation({ lat: latitude, lng: longitude });
  });

  React.useEffect(() => {
    const fetchData = () => {
      props.authService
        .me()
        .then((me) => setMe(me))
        .catch((_error) => setNeedsLogin(true));
    };

    fetchData();
  }, []);

  React.useEffect(() => setSearching(false), [bookInstances]);

  if (needsLogin) {
    return <Redirect to="/login" />;
  } else if (error) {
    return <div> Error {error.message} </div>;
  } else {
    return (
      <MainLayout>
        <Header
          me={me}
          userService={props.userService}
          currentLocation={currentLocation}
        />
        <Input
          placeholder="Search By Title, Author..."
          fluid
          icon="search"
          loading={searching}
          onChange={(_event, { value }) => setSearchTerm(value)}
        />

        <MapComponent
          center={currentLocation}
          bookInstances={bookInstances}
          geoLocation={geoLocation}
        />
      </MainLayout>
    );
  }
};