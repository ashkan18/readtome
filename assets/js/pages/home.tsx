import * as React from "react";

import { Header } from "../components/header";
import Search from "../components/search";
import { MapComponent } from "../components/map_component";
import { Redirect } from "react-router";
import BookInstanceService from "../services/book_instance_service";
import AuthService from "../services/auth_service";
import Reader from "../models/reader";
import BookInstance from "../models/book_instance";
import { Spinner } from "@artsy/palette";
import MainLayout from "../components/main_layout";
import UserService from "../services/user_service";
import { GeolocateControl } from "mapbox-gl";

//let defaultCoordinate = {lat: 40.690008, lng: -73.9857765}
interface Props {
  bookInstanceService: BookInstanceService;
  authService: AuthService;
  userService: UserService;
}

export const Home = (props: Props) => {
  const [bookInstances, setBookInstances] = React.useState<BookInstance[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<any>();
  const [needsLogin, setNeedsLogin] = React.useState(false);
  const [me, setMe] = React.useState<Reader | null>(null);
  const [offerings, setOfferings] = React.useState<Array<string> | null>(null);
  const [currentLocation, setCurrentLocation] = React.useState<any | null>(
    null
  );

  const geoLocation = new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
    trackUserLocation: false,
  });

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

  const search = (term: string | null) => {
    const coordination = currentLocation; //|| defaultCoordinate
    const token = props.authService.getToken();
    if (token) {
      props.bookInstanceService
        .fetchBooks(token, term, coordination.lat, coordination.lng, offerings)
        .then((bookInstances) => setBookInstances(bookInstances))
        .catch((_error) => setNeedsLogin(true));
    }
  };

  React.useEffect(() => setIsLoaded(true), [bookInstances]);

  if (needsLogin) {
    return <Redirect to="/login" />;
  } else if (error) {
    return <div> Error {error.message} </div>;
  } else if (!isLoaded) {
    return <Spinner />;
  } else {
    return (
      <MainLayout>
        <Header
          me={me}
          userService={props.userService}
          currentLocation={currentLocation}
        />
        <Search searchMethod={search} />

        <MapComponent
          center={currentLocation}
          bookInstances={bookInstances}
          geoLocation={geoLocation}
        />
      </MainLayout>
    );
  }
};
