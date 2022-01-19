import React, { useState, useCallback, useRef } from "react";
import ReactMapGL, {
	GeolocateControl,
	NavigationControl,
	Marker,
} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

const REACT_APP_MAPBOX_TOKEN =
	"pk.eyJ1Ijoia3VzaG1hbjEyMyIsImEiOiJja25vczluNzIxMXM5Mm5vNWNydzJkaDgyIn0.Cm70isgaVNNhYBmHRqScZg";

//Map Component in the Form Page
const GeocoderBar = (props) => {
	//Initial Viewport Condition
	const [viewport, setViewport] = useState({
		latitude: 27.7270315,
		longitude: 85.3047379,
		zoom: 15,
	});
	//Initial Marker Location
	const [markerLocation, setMarkerLocation] = useState({
		latitude: 0,
		longitude: 0,
	});
	// Mapbox Map Reference for Geocoder
	const mapRef = useRef();

	//Handles viewport change enabling the map to move and zoom from mouse and geocoder search
	const handleViewportChange = useCallback((newViewport) => {
		setViewport(newViewport);
	}, []);

	//Add Markers on the map after click on the map or based on result of geocoder 
	const add_marker = (coordinate) => {
		setMarkerLocation({
			latitude: coordinate[1],
			longitude: coordinate[0],
		});
		props.handleInputCoordinates(coordinate);
	};

	return (
		<ReactMapGL
			ref={mapRef}
			{...viewport}
			width='100%'
			height='100%'
			mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
			mapStyle='mapbox://styles/mapbox/streets-v11'
			onViewportChange={handleViewportChange}
			onClick={(event) => {
				if (event.target.className === "overlays") {
					add_marker(event.lngLat);
				}
			}}>
			<Marker
				latitude={markerLocation.latitude}
				longitude={markerLocation.longitude}>
				<i className='fas fa-map-marker-alt fa-2x'></i>
			</Marker>
			<Geocoder
				mapRef={mapRef}
				onViewportChange={handleViewportChange}
				mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
				marker={false}
				position='top-left'
				onResult={(result) => {
					add_marker(result.result.geometry.coordinates);
				}}></Geocoder>
		</ReactMapGL>
	);
};

export default GeocoderBar;
