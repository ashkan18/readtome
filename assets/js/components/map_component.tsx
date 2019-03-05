import * as React from "react"
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

import Coordinate from "../models/coordinate"
import BookInstance from "../models/book_instance"
import AuthService from "../services/auth_service";
import styled from "styled-components";


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

const layoutLayer = {  };


const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
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
export default class MapComponent extends React.Component<Props, State>{
  authService: AuthService = new AuthService()
  public constructor(props: Props, context: any) {
    super(props, context)
    this.state = {
      fitBounds: undefined,
      center: [props.initialCoordinate.lng, props.initialCoordinate.lat],
      zoom: [13],
      selectedBookInstance: undefined
    }
  }
  private onDrag = () => {
    if (this.state.selectedBookInstance) {
      this.setState({ selectedBookInstance: undefined });
    }
  };

  private onToggleHover(cursor: string, { map }: { map: any }) {
    map.getCanvas().style.cursor = cursor;
  }

  private markerClick = (selectedBookInstance: BookInstance) => {
    const {location} = selectedBookInstance
    this.setState({
      center: [location.coordinates[0], location.coordinates[1]],
      zoom: [14],
      selectedBookInstance
    });
  };

  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  render(){
    const { bookInstances} = this.props
    const { fitBounds, center, zoom, selectedBookInstance } = this.state
    return(
      <Map
        style="mapbox://styles/ashkan18/cjswesy7d0gqp1fqmkzbtuudr"
        containerStyle={mapStyle}
        flyToOptions={flyToOptions}
        center={center}
        fitBounds={fitBounds}
        zoom={zoom}
        >
        <Layer
          type="symbol"
          id="marker"
          layout={layoutLayer}>
          { bookInstances && bookInstances.map( bi =>
            <Feature
              key={bi.id}
              onMouseEnter={this.onToggleHover.bind(this, 'pointer')}
              onMouseLeave={this.onToggleHover.bind(this, '')}
              onClick={this.markerClick.bind(this, bi)}
              coordinates={bi.location.coordinates.reverse()}
              />)
          }
        </Layer>
      </Map>
    )
  }
}
