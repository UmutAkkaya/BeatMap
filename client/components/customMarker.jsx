import React, {Component} from 'react';

const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} = require("react-google-maps");

export default class CustomMarker extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: false
        }
        
        this.onToggleOpen = this.onToggleOpen.bind(this);
    }
    
    onToggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });   
    }
    
    render(){
        return (< Marker
            position={{lat: this.props.marker.latitude, lng: this.props.marker.longitude}}
            onClick={this.onToggleOpen}
        >

            {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
                <div>
                    <h4> Top Genres </h4>
                    <ul>
                        {
                            this.props.marker.topGenres.slice(0, 7).map(genre => 
                                <li> {genre} </li>
                            )
                        }
                    </ul>
                    <hr/>

                    <h4> Recently Listened Tracks </h4>
                    <ul>
                        {
                            this.props.marker.topTracks.slice(0, 7).map(track => 
                                <li> <a href={track.split('=')[1]}> {track.split('=')[0]} </a> </li>
                            )
                        }
                    </ul>
                </div>

            </InfoWindow>}

        </Marker>)
    }
}

