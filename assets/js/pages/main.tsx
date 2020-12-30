import { GeolocateControl } from "mapbox-gl";
import React from "react";
import { useState } from "react";
import { Header } from "../components/header";
import MainLayout from "../components/main_layout";
import Coordinate from "../models/coordinate";
import Reader from "../models/reader";
import { getMe } from "../services/user_service";
import { Home } from "../components/home";
import { Inquiries } from "./inquiries";
import { Redirect } from "react-router";

export const Main = () => {
  const geoLocation = new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
    trackUserLocation: false,
  });
  const [pageStack, setPageStack] = useState<Array<string>>(["home"]);
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

  const currentPage = pageStack.slice(-1)[0];
  const switchPage = (newPage: string) => {
    setPageStack(pageStack.concat(newPage));
  };

  if (needsLogin){
    return(<Redirect to="/login"/>)
  }

  return (
    <MainLayout>
      <Header
        me={me}
        currentLocation={currentLocation}
        switchPage={switchPage}
      />
      {currentPage === "home" && (
        <Home geoLocation={geoLocation} location={currentLocation} />
      )}
      {currentPage === "inquiries" && <Inquiries />}
    </MainLayout>
  );
};
