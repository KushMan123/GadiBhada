import React, { useState, useCallback, useRef } from "react";
import ReactMapGL, {
	GeolocateControl,
	NavigationControl,
	Marker,
} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

const REACT_APP_MAPBOX_TOKEN =
	"pk.eyJ1Ijoia3VzaG1hbjEyMyIsImEiOiJja25vczluNzIxMXM5Mm5vNWNydzJkaDgyIn0.Cm70isgaVNNhYBmHRqScZg";

const GeocoderBar = (props) => {
	const [viewport, setViewport] = useState({
		latitude: 27.7270315,
		longitude: 85.3047379,
		zoom: 15,
	});
	const [markerLocation, setMarkerLocation] = useState({
		latitude: 0,
		longitude: 0,
	});

	const mapRef = useRef();

	const handleViewportChange = useCallback((newViewport) => {
		setViewport(newViewport);
	}, []);

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
