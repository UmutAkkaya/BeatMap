import React, {Component} from 'react';
import CustomGoogleMap from '../customGoogleMap.jsx';
import {connect} from 'react-redux';
import {
    getMyInfo,
    setTokens,
} from '../../actions/actions';

class MapComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: {latitude: 25.0391667, longitude: 121.525},
            loading: true
        };

        this.getLocation = this.getLocation.bind(this);
        this.setUserLocation = this.setUserLocation.bind(this);
    }

    componentDidMount() {
        const {dispatch, params} = this.props;
        dispatch(getMyInfo());

        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setUserLocation);
        }
    }

    setUserLocation(position) {
        this.setState({
            location: {latitude: position.coords.latitude, longitude: position.coords.longitude},
            loading: false
        })
    }

    render() {
        return (
            <div>
                {!this.state.loading &&
                <CustomGoogleMap genre={this.props.params ? this.props.params.genre : null} coords={this.state.location}/>
                }
            </div>
        )
    }
}


export default connect(state => state)(MapComponent);