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
                    <h3> Top Genres </h3>
                    <ul>
                        {
                            this.props.marker.topGenres.map(genre => 
                                <li> {genre.name} </li>
                            )
                        }
                    </ul>
                    <hr/>

                    <h3> Top Tracks </h3>
                    <ul>
                        {
                            this.props.marker.topTracks.map(track => 
                                <li> <a href={track.url}> {track.name} </a> </li>
                            )
                        }
                    </ul>
                </div>

            </InfoWindow>}

        </Marker>)
    }
}

