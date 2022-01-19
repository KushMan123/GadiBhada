import React, {
	useRef,
	useState,
	useImperativeHandle,
	useCallback,
	useEffect,
} from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { bearing, lineString, length, point } from "@turf/turf";

const color = [
	"#03AA46",
	"#5630CF",
	"#D926BD",
	"#DC3023",
	"#E29E1D",
	"#36BAC9",
];

const Map = React.forwardRef((props, ref) => {
	var point1 = {
		type: "FeatureCollection",
		features: [
			{
				type: "Feature",
				properties: { bearing },
				geometry: {
					type: "Point",
					coordinates: [],
				},
			},
		],
	};

	const [viewport, setViewport] = useState({
		latitude: 27.7270479,
		longitude: 85.304598,
		zoom: 15,
	});
	// let [counter, setCounter] = useState(0);
	const [busfare, setBusfare] = useState(0);

	const [route, setRoute] = useState([0]);
	const [sourceMarkerLocation, setSourceMarkerLocation] = useState({
		latitude: 0,
		longitude: 0,
	});
	const [destinationMarkerLocation, setDestinationMarkerLocation] = useState({
		latitude: 0,
		longitude: 0,
	});
	const [sourceInit, setSourceInit] = useState(null);
	const [destinationInit, setDestinationInit] = useState(null);
	const [place_name, setPlaceName] = useState("");
	const [sourcePlaceholder, setSourcePlaceholder] =
		useState("Current Location");
	const [destinationPlaceholder, setDestinationPlaceholder] =
		useState("Select Destination");
	const [focus, setFocus] = useState("");

	const myRef = useRef();
	const sourceLng = useRef();
	const sourceLat = useRef();
	const destinationLng = useRef();
	const destinationLat = useRef();
	const geocoderContainerRef = useRef();
	const source = useRef();
	const destination = useRef();

	const [busstopMarker, setBusstopMarker] = useState(null);

	useImperativeHandle(ref, () => ({
		addRoute() {
			if (Object.entries(props.geometry).length !== 0) {
				console.log("Route Length", props.routeLength);
				console.log("Map Reference", myRef.current);
				const map = myRef.current.getMap();
				var route_id = route[route.length - 1] + 1;
				map.addLayer({
					id: route_id.toString(),
					type: "line",
					source: {
						type: "geojson",
						data: {
							type: "Feature",
							properties: {},
							geometry: {
								type: "LineString",
								coordinates: props.geometry,
							},
						},
					},
					layout: {
						"line-join": "round",
						"line-cap": "round",
					},
					paint: {
						"line-color": color[Math.floor(Math.random() * color.length)],
						"line-width": 10,
						"line-opacity": 0.8,
					},
				});
				setRoute([...route, route_id]);
			}
		},

		handleAnimation() {
			const map = myRef.current.getMap();
			map.addSource("happy", {
				type: "geojson",
				data: {
					type: "Feature",
					properties: { bearing },
					geometry: {
						type: "Point",
						coordinates: props.geometry[0],
					},
				},
			});

			map.addLayer({
				id: "hritik",
				type: "symbol",
				source: "happy",
				layout: {
					// This icon is a part of the Mapbox Streets style.
					// To view all images available in a Mapbox style, open
					// the style in Mapbox Studio and click the "Images" tab.
					// To add a new image to the style at runtime see
					// https://docs.mapbox.com/mapbox-gl-js/example/add-image/
					"icon-image": "museum-15",
					"icon-rotate": ["get", "bearing"],
					"icon-rotation-alignment": "map",
					"icon-allow-overlap": true,
					"icon-ignore-placement": true,
				},
			});
			animate();
		},
		getSourceLat() {
			return sourceLat.current.value;
		},
		getSourceLng() {
			return sourceLng.current.value;
		},
		getDestinationLat() {
			return destinationLat.current.value;
		},
		getDestinationLng() {
			return destinationLng.current.value;
		},
		getSourcePlaceholder() {
			return source.current.props.placeholder;
		},
		getDestinationPlaceholder() {
			return destination.current.props.placeholder;
		},
	}));

	var counter = 0;

	function animate() {
		const map = myRef.current.getMap();
		var steps = props.actualRoute.length;
		var start = props.actualRoute[counter >= steps ? t.counter - 1 : counter];
		var end = props.actualRoute[counter >= steps ? counter : counter + 1];

		if (!start || !end) return;

		point1.features[0].geometry.coordinates = props.actualRoute[counter];

		point1.features[0].properties.bearing = bearing(start, end);
		map.getSource("happy").setData(point1);

		if (counter < steps) {
			requestAnimationFrame(animate);
		}
		counter = counter + 1;
	}

	const reverseGeocode = async (coordinate) => {
		const response = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinate[0]},${coordinate[1]}.json?access_token=${props.token}`
		);
		const json = await response.json();
		console.log(json);
		console.log(json.features[0].text);
		setPlaceName(json.features[0].text);
	};

	const handleSourceCoordinates = (coordinate) => {
		sourceLng.current.value = coordinate[0];
		sourceLat.current.value = coordinate[1];
	};

	const handleDestinationCoordinates = (coordinate) => {
		destinationLng.current.value = coordinate[0];
		destinationLat.current.value = coordinate[1];
	};

	const add_marker = (coordinate, geocodetype) => {
		if (focus === "SOURCE") {
			if (geocodetype === "forward") {
				setSourceMarkerLocation({
					latitude: coordinate[1],
					longitude: coordinate[0],
				});
				handleSourceCoordinates(coordinate);
			}
			if (geocodetype === "reverse") {
				setSourceMarkerLocation({
					latitude: coordinate[1],
					longitude: coordinate[0],
				});
				handleSourceCoordinates(coordinate);
				let temp = place_name;
				reverseGeocode(coordinate);
				if (temp == place_name) {
					setSourcePlaceholder(place_name);
				}
			}
		}
		if (focus === "DESTINATION") {
			if (geocodetype === "forward") {
				setDestinationMarkerLocation({
					latitude: coordinate[1],
					longitude: coordinate[0],
				});
				handleDestinationCoordinates(coordinate);
			}
			if (geocodetype === "reverse") {
				setDestinationMarkerLocation({
					latitude: coordinate[1],
					longitude: coordinate[0],
				});
				handleDestinationCoordinates(coordinate);
				let temp = place_name;
				reverseGeocode(coordinate);
				if (temp == place_name) {
					setDestinationPlaceholder(place_name);
				}
			}
		}
	};

	useEffect(() => {
		if (sourceInit !== null && destinationInit !== null) {
			if (focus === "SOURCE") {
				setSourcePlaceholder(place_name);
			}
			if (focus === "DESTINATION") {
				setDestinationPlaceholder(place_name);
			}
		}
	}, [place_name]);

	const handleViewportChange = useCallback((newViewport) => {
		setViewport(newViewport);
	}, []);

	const handleSourceFocus = (geocoderInstance) => {
		if (sourceInit === null) {
			setSourceInit(geocoderInstance);
		}
		const inputEL = geocoderInstance._inputEl;
		inputEL.setAttribute("id", "source--input");
		inputEL.onfocus = function (event) {
			setFocus("SOURCE");
		};
	};

	const handleDestinationFocus = (geocoderInstance) => {
		if (destinationInit === null) {
			setDestinationInit(geocoderInstance);
		}
		const inputEL = geocoderInstance._inputEl;
		inputEL.setAttribute("id", "destination--input");
		inputEL.onfocus = function (event) {
			setFocus("DESTINATION");
		};
	};

	return (
		<ReactMapGL
			ref={myRef}
			{...viewport}
			width='100vw'
			height='100vh'
			mapboxApiAccessToken={props.token}
			onViewportChange={handleViewportChange}
			onClick={(event) => {
				if (event.target.className === "overlays") {
					add_marker(event.lngLat, "reverse");
				}
			}}>
			{props.busstops.map((park, key) => {
				return (
					<Marker key={key} latitude={park.latitude} longitude={park.longitude}>
						<button
							className='map-btn'
							onClick={(e) => {
								e.preventDefault();
								setBusstopMarker(park);
								console.log(busstopMarker);
							}}>
							<i className='fas fa-bus'></i>
						</button>
					</Marker>
				);
			})}
			<Marker
				latitude={sourceMarkerLocation.latitude}
				longitude={sourceMarkerLocation.longitude}>
				<i className='fas fa-map-marker-alt fa-2x source'></i>
			</Marker>
			<Marker
				latitude={destinationMarkerLocation.latitude}
				longitude={destinationMarkerLocation.longitude}>
				<i className='fas fa-map-marker-alt fa-2x destination'></i>
			</Marker>

			<div ref={geocoderContainerRef} className='geocoder-container'>
				<Geocoder
					ref={source}
					mapRef={myRef}
					containerRef={geocoderContainerRef}
					mapboxApiAccessToken={props.token}
					reverseGeocode={true}
					marker={true}
					onViewportChange={handleViewportChange}
					position='top-left'
					placeholder={sourcePlaceholder}
					onResult={(result) => {
						add_marker(result.result.geometry.coordinates, "forward");
					}}
					onInit={handleSourceFocus}
				/>
				<Geocoder
					ref={destination}
					mapRef={myRef}
					containerRef={geocoderContainerRef}
					mapboxApiAccessToken={props.token}
					reverseGeocode={true}
					marker={true}
					onViewportChange={handleViewportChange}
					position='top-left'
					placeholder={destinationPlaceholder}
					onResult={(result) => {
						add_marker(result.result.geometry.coordinates, "forward");
					}}
					onInit={handleDestinationFocus}
				/>
				<button className='button green' onClick={props.handleGetInfo}>
					Get Info
				</button>
			</div>
			<div hidden>
				<input ref={sourceLat} type='text' />
				<input ref={sourceLng} type='text' />
			</div>
			<div hidden>
				<input ref={destinationLat} type='text' />
				<input ref={destinationLng} type='text' />
			</div>
			{busstopMarker ? (
				<Popup
					latitude={busstopMarker.latitude}
					longitude={busstopMarker.longitude}
					onClose={() => {
						setBusstopMarker(null);
					}}>
					<div>{busstopMarker.name}</div>
				</Popup>
			) : null}
		</ReactMapGL>
	);
});

export default Map;
