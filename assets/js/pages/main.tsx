import { GeolocateControl } from "mapbox-gl";
import React from "react";
import { useState } from "react";
import { Header } from "../components/header";
import MainLayout from "../components/main_layout";
import { Coordinate } from "../models/coordinate";
import Reader from "../models/reader";
import { getMe } from "../services/user_service";
import { Home } from "../components/home";
import { Inquiries } from "./inquiries";
import { Redirect, Route, Switch } from "react-router";
import { User } from "./user";
import { CreatorPage } from "./creatorPage";

interface Page {
  ref: string;
  params?: any;
}

export const Main = () => {
  const geoLocation = new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
    trackUserLocation: false,
  });
  const [me, setMe] = React.useState<Reader | null>(null);
  const [needsLogin, setNeedsLogin] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState<any | null>(
    null
  );

  geoLocation.on("geolocate", (data) => {
    const { latitude, longitude } = data.coords;
    const coords: Coordinate = { lat: latitude, lng: longitude };
    setCurrentLocation(coords);
  });

  React.useEffect(() => {
    const fetchData = () => {
      getMe()
        .then((me) => setMe(me))
        .catch((_error) => setNeedsLogin(true));
    };
    fetchData();
  }, []);

  if (needsLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <MainLayout>
      <Header me={me} currentLocation={currentLocation} />
      <Switch>
        <Route path="/inquiries">
          <Inquiries />
        </Route>
        <Route path="/users/:userId">
          <User />
        </Route>
        <Route path="/creators/:creatorId">
          <CreatorPage />
        </Route>
        <Route path="/">
          <Home geoLocation={geoLocation} location={currentLocation} />
        </Route>
      </Switch>
    </MainLayout>
  );
};
