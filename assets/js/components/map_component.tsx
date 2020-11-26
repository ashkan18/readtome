import * as React from "react"
import ReactMapboxGl, { Feature, Layer, Marker, Popup } from 'react-mapbox-gl';

import Coordinate from "../models/coordinate"
import BookInstance from "../models/book_instance"
import AuthService from "../services/auth_service";
import styled from "styled-components"
import {GeolocateControl} from "mapbox-gl"
import BookInstanceDetail from "./book_instance_detail";
import { svg } from "./icon";


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


const layoutLayer = { 'icon-image': 'londonCycle' };

// Create an image for the Layer
const image = new Image();
image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg);
const images: any = ['londonCycle', image];

const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;


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
        zoom={zoom}
        fitBounds={fitBounds}
        >
          <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
            {bookInstances?.map((bi, index) => (
              <Feature
                key={bi.id}
                onMouseEnter={this.onToggleHover.bind(this, 'pointer')}
                onMouseLeave={this.onToggleHover.bind(this, '')}
                onClick={() => this.onMarkerClick(bi)}
                coordinates={[bi.location.lng, bi.location.lat]}
              />
            ))}
          </Layer>
          
        {/* { bookInstances && bookInstances.map( bi =>
          <Marker
            key={bi.id}
            coordinates={[bi.location.lng, bi.location.lat]}
            onClick={ () => {
              this.onMarkerClick(bi)}
            }
            anchor="bottom">
            <StyledMarker key={bi.id}/>
          </Marker>)
        } */}
        { selectedBookInstance &&
          <Popup
            coordinates={[selectedBookInstance.location.lng, selectedBookInstance.location.lat]}
            anchor="bottom"
            offset={[0, -15]}>
            <BookInstanceDetail bookInstance={selectedBookInstance}/>
          </Popup>
        }
      </Map>
    )
  }
}
