import React, { Component } from 'react'
import { GoogleMap, LoadScript, Autocomplete, Marker  } from '@react-google-maps/api';

const mapContainerStyle = {
    height: "400px",
    width: "100%",
    border:'1px solid black',
    borderRadius:'5px'
}

const equals = (prev, next) =>
    ((prev['lat'] === next['lat']) &&
    (prev['lng'] === next['lng']))
const lib = ["places"]

class MyMapWithAutocomplete extends Component {
    constructor(props) {
        super(props)

        this.autocomplete = null

        this.onLoad = this.onLoad.bind(this)
        this.onPlaceChanged = this.onPlaceChanged.bind(this)

        this.state = {
            center : {...props.defaultCenter},
            markerPosition : {...props.defaultCenter}
        }
    }

    onLoad(autocomplete) {
        this.autocomplete = autocomplete
    }
    componentDidUpdate(prevProps) {
        if(!equals(this.props.defaultCenter, prevProps.defaultCenter)) 
            this.setState({
                center : {...this.props.defaultCenter},
                markerPosition : {...this.props.defaultCenter},
            })
    }

    onPlaceChanged() {
        if (this.autocomplete !== null) {
            if(Object.keys(this.autocomplete.getPlace()).length < 2) return
            let location = this.autocomplete.getPlace().geometry.location
            let loc = {
                lat : location.lat(),
                lng : location.lng()
            }
            this.props.onChange(loc)
            this.setState({center : {...loc}})
        } else {
            console.log('Autocomplete is not loaded yet!')
        }
    }

    render() {    
        return (
            <LoadScript
                googleMapsApiKey="AIzaSyACwixJrrTRyzuCE41kMC_-ZrGCMrRQFfY"
                libraries={lib}>
                <GoogleMap
                    id="searchbox-example"
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={this.state.center}
                    onClick={ev=>{
                        const location = {
                            lat : ev.latLng.lat(),
                            lng : ev.latLng.lng()
                        }
                        this.props.onChange(location)
                        this.setState({...this.state, markerPosition : {...location}})
                    }}>
                    <Marker position={this.state.markerPosition}/>
                    <Autocomplete
                        onLoad={this.onLoad}
                        onPlaceChanged={this.onPlaceChanged}
                    >
                        <input
                            type="text"
                            placeholder="Search Place"
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `240px`,
                                height: `32px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                position: "absolute",
                                left: "50%",
                                marginLeft: "-120px"
                            }}
                        />
                    </Autocomplete>
                </GoogleMap>
            </LoadScript>
        )
    }
}

export default MyMapWithAutocomplete