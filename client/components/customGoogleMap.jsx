import React from "react";
import CustomMarker from './customMarker.jsx';

const fetch = require("isomorphic-fetch");
const {compose, withProps, withHandlers, withStateHandlers} = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} = require("react-google-maps");
const {MarkerClusterer} = require("react-google-maps/lib/components/addons/MarkerClusterer");


export default class CustomGoogleMap extends React.PureComponent {
    componentWillMount() {
        this.setState(
            {
                markers: [],
                coords: this.props.coords
            })
    }


    componentDidMount() {
        const url = '/getMarkers';
        fetch(url)
            .then(res => res.json())
            .then(data => {

                this.setState({markers: data.markers});
            });
    }

    render() {
        return (
            <MapWithAMarkerClusterer genre={this.props.genre} coords={this.state.coords} markers={this.state.markers}/>
        )
    }
}

const MapWithAMarkerClusterer = compose(
    withStateHandlers(() => ({
        isOpen: false,
    }), {
        onToggleOpen: ({isOpen}) => () => ({
            isOpen: !isOpen,
        })
    }),
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCqEtT_1dHS0PGK8S9vm05DiJ1i-ohcqNE&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{height: `100%`}}/>,
        containerElement: <div style={{height: `80vh`}}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={5}
        defaultCenter={{lat: props.coords.latitude, lng: props.coords.longitude}}
    >
        <MarkerClusterer
            onClick={props.onMarkerClustererClick}
            averageCenter
            enableRetinaIcons
            gridSize={60}
        >
            {(props.genre !== null && props.genre !== undefined) && props.markers.filter(m => m.topGenres.includes(props.genre)).map(marker => (
                <CustomMarker marker={marker}/>
            ))}

            {(props.genre === null || props.genre === undefined) && props.markers.map(marker => (
                <CustomMarker marker={marker}/>
            ))}
        </MarkerClusterer>
    </GoogleMap>
);
