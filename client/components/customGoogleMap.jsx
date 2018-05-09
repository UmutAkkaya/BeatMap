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
        this.setState({markers: []})
    }


    // componentDidMount() {
    //     const url = `http://localhost:3000/getUsers`
    //     fetch(url)
    //         .then(res => res.json())
    //         .then(data => {
    //             this.setState({markers: data});
    //         });
    // }


    componentDidMount() {
        const url = [
            // Length issue
            `https://gist.githubusercontent.com`,
            `/farrrr/dfda7dd7fccfec5474d3`,
            `/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
        ].join("");
        fetch(url)
            .then(res => res.json())
            .then(data => {

                data.photos.forEach(d => {
                    d.topGenres = [{
                        name: 'test'
                    }, {
                        name: 'test2'
                    }]
                    
                    d.topTracks = [{
                        name: 'test',
                        url: 'www.google.com'
                    }, {
                        name: 'test2',
                        url: 'www.google.com'
                    }]
                });

                this.setState({markers: data.photos});
            });
    }

    render() {
        return (
            <MapWithAMarkerClusterer markers={this.state.markers}/>
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
        containerElement: <div style={{height: `400px`}}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={3}
        defaultCenter={{lat: 25.0391667, lng: 121.525}}
    >
        <MarkerClusterer
            onClick={props.onMarkerClustererClick}
            averageCenter
            enableRetinaIcons
            gridSize={60}
        >
            {props.markers.map(marker => (
                <CustomMarker marker={marker}/>
            ))}
        </MarkerClusterer>
    </GoogleMap>
);
