import * as React from "react"
import ReactMapboxGl, { Marker, Popup } from "react-mapbox-gl"

import Coordinate from "../models/coordinate"
import BookInstance from "../models/book_instance"
import AuthService from "../services/auth_service";
import styled from "styled-components"
import {GeolocateControl} from "mapbox-gl"
import BookInstanceDetail from "./book_instance_detail";


const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYXNoa2FuMTgiLCJhIjoiY2pzdnk5eGRpMGMxcTN5bzRsOHRjdDR2cCJ9.qaLMKiKsDDLnMPLJ-s4rIQ",
  minZoom: 8,
  maxZoom: 15,
});

const mapStyle = {
  flex: 1
};

const flyToOptions = {
  speed: 0.8
};


const Mark = styled.div`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 4px solid #eaa29b;
`;


interface Props{
  bookInstances: Array<BookInstance>
  initialCoordinate: Coordinate
  onStyleLoad?: (map: any) => any
}

interface State {
  selectedBookInstance?: BookInstance
  fitBounds?: [[number, number], [number, number]];
  center: [number, number];
  zoom: [number];
}

const StyledMarker = styled.div`
  background-color: orange;
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  left: -0.5rem;
  top: -0.5rem;
  position: relative;
  border-radius: 1.5rem 1.5rem 0;
  transform: rotate(45deg);
  border: 1px solid orangered;
`

export default class MapComponent extends React.Component<Props, State>{
  authService: AuthService = new AuthService()
  geoLocation: GeolocateControl;

  public constructor(props: Props, context: any) {
    super(props, context)
    this.state = {
      fitBounds: undefined,
      center: [props.initialCoordinate.lng, props.initialCoordinate.lat],
      zoom: [13],
      selectedBookInstance: undefined
    }
    this.geoLocation = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: false
      },
      trackUserLocation: false
    })
  }
  private onDrag = () => {
    if (this.state.selectedBookInstance) {
      this.setState({ selectedBookInstance: undefined });
    }
  };

  private onToggleHover(cursor: string, { map }: { map: any }) {
    map.getCanvas().style.cursor = cursor;
  }

  private onMarkerClick = (selectedBookInstance: BookInstance) => {
    const {location} = selectedBookInstance
    this.setState({
      center: [location.lng, location.lat],
      zoom: [13],
      selectedBookInstance
    });
  };

  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    map.addControl(this.geoLocation);
    setTimeout(() => {
      this.geoLocation.trigger()
    }, 500);
    return onStyleLoad && onStyleLoad(map);
  }

  render(){
    const { bookInstances } = this.props
    const { fitBounds, center, zoom, selectedBookInstance } = this.state
    return(
      <Map
        style="mapbox://styles/ashkan18/cjswesy7d0gqp1fqmkzbtuudr"
        containerStyle={mapStyle}
        flyToOptions={flyToOptions}
        onStyleLoad={this.onStyleLoad}
        onDrag={this.onDrag}
        center={center}
        fitBounds={fitBounds}
        zoom={zoom}
        >
        { bookInstances && bookInstances.map( bi =>
          <Marker
            key={bi.id}
            coordinates={[bi.location.lng, bi.location.lat]}
            onClick={ () => {
              this.onMarkerClick(bi)}
            }
            anchor="bottom">
            <StyledMarker key={bi.id}/>
          </Marker>)
        }
        { selectedBookInstance ?
          <Popup
            coordinates={[selectedBookInstance.location.lng, selectedBookInstance.location.lat]}
            anchor="bottom"
            offset={[0, -15]}>
            <BookInstanceDetail bookInstance={selectedBookInstance}/>
          </Popup>
        :
        null}
      </Map>
    )
  }
}
