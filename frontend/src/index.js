import React from "react";
import ReactDOM from "react-dom";
import InfoSection from "./infoSection";
import RouteSelection from "./routeSelection";
import Map from "./Map";
import "axios";
import axios from "axios";
import { lineString, length, along } from "@turf/turf";



const REACT_APP_MAPBOX_TOKEN =
	"pk.eyJ1Ijoia3VzaG1hbjEyMyIsImEiOiJja25vczluNzIxMXM5Mm5vNWNydzJkaDgyIn0.Cm70isgaVNNhYBmHRqScZg";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			start: "",
			end: "",
			geometry: [],
			routeLength: "",
			actualRoute: [],
			actualSteps: 0,
			actualPoints: [],
			has_geometry_changed: false,
			has_busstops_fetched: false,
			has_route_fetched: false,
			// has_velocity_calculated: false,
			busstops: [],
			route: {},
		};
		this.child = React.createRef();
	}

	//HANDLING EVENTS
	handleEndChange(event) {
		if (event.target.id === "start") {
			this.setState({
				start: event.target.value,
			});
			console.log(this.state.start);
		}
		if (event.target.id === "end") {
			this.setState({
				end: event.target.value,
			});
			console.log(this.state.end);
		}
	}

	handlefetch(event) {
		fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${this.state.start};${this.state.end}?geometries=geojson&steps=true&access_token=${REACT_APP_MAPBOX_TOKEN}`
		)
			.then((data) => data.json())
			.then((data) => {
				console.log(data);
				var line = lineString(data.routes[0].geometry.coordinates)
				var lineDistance = length(line,{ units: 'kilometers'} );
				var arc = [];
				var steps = 10000;

				for ( var i = 0; i < lineDistance; i += lineDistance/steps) {
					var segment = along(line, i);
					arc.push(segment.geometry.coordinates)
				  }

				this.setState({
					actualSteps: steps,
					actualRoute: arc,
					routeLength: lineDistance.toString(),
					geometry: data.routes[0].geometry.coordinates,
					has_geometry_changed: true,
				});
			});
		event.preventDefault();
	}

	handlechoose(event) {
		axios
			.get(`http://127.0.0.1:8000/getroute?rname=${event.target.value}`)
			.then((res) => {
				this.setState({
					route: res.data,
					has_route_fetched: true,
				});
			});
	}

	//CLASS FUNCTIONS
	onUpdate() {
		this.child.current.addRoute();
	}



	fetchcoordinate(location) {
		var i,
			temporary,
			chunk = 10;
		console.log(location.length)
		var total_chucks = Math.ceil(location.length / chunk);
		var chunk_no = 1;
		var last_stop = [];
		console.log(total_chucks);
		for (i = 0; i < location.length; i += chunk) {
			console.log("In for loop");
			temporary = last_stop.concat(location.slice(i, i + chunk));
			last_stop = [temporary[temporary.length - 1]];
			// console.log(temporary);
			fetch(
				`https://api.mapbox.com/directions/v5/mapbox/driving/${temporary.join(  
					";"
				)}?geometries=geojson&steps=true&access_token=${REACT_APP_MAPBOX_TOKEN}`
			)
				.then((data) => data.json())
				.then((data) => {
					if (total_chucks === 1) {
						if (chunk_no === total_chucks) {
							var line = lineString(data.routes[0].geometry.coordinates)
							var lineDistance = length(line,{ units: 'kilometers'} );
							var arc = [];
							var steps = 10000;

							for ( var i = 0; i < lineDistance; i += lineDistance/steps) {
								var segment = along(line, i);
								arc.push(segment.geometry.coordinates)
							}

							this.setState({
								actualSteps: steps,
								actualRoute: arc,
								routeLength: lineDistance.toString(),
								geometry: this.state.geometry.concat(
									data.routes[0].geometry.coordinates
								),
								has_geometry_changed: true,
							});
						}
					} else {
						if (chunk_no < total_chucks) {
							var line = lineString(data.routes[0].geometry.coordinates)
							var lineDistance = length(line,{ units: 'kilometers'} );
							var arc = [];
							var steps = 10000;

							for ( var i = 0; i < lineDistance; i += lineDistance/steps) {
								var segment = along(line, i);
								arc.push(segment.geometry.coordinates)
							}

							this.setState({
								actualSteps: steps,
								actualRoute: arc,
								routeLength: lineDistance.toString(),
								geometry: this.state.geometry.concat(
									data.routes[0].geometry.coordinates
								),
							});
						}
						if (chunk_no === total_chucks) {
							var line = lineString(data.routes[0].geometry.coordinates)
							var lineDistance = length(line,{ units: 'kilometers'} );
							var arc = [];
							var steps = 10000;

							for ( var i = 0; i < lineDistance; i += lineDistance/steps) {
								var segment = along(line, i);
								arc.push(segment.geometry.coordinates)
							}

							this.setState({
								actualSteps: steps,
								actualRoute: this.state.actualRoute.concat(arc),
								routeLength: lineDistance.toString(),
								geometry: this.state.geometry.concat(
									data.routes[0].geometry.coordinates
								),
								has_geometry_changed: true,
							});
						}
						chunk_no = chunk_no + 1;
					}
				});
		}
	}

	// LIFE CYCLE COMPONENTS
	componentDidMount() {
		axios.get("http://127.0.0.1:8000/getallstop").then((res) => {
			this.setState({
				busstops: res.data,
				has_busstops_fetched: true,
			});
		});
	}

	componentDidUpdate() {
		if (this.state.has_route_fetched) {
			let result = this.state.route.map((a) => [a.longitude, a.latitude]);
			console.log(result)
			this.fetchcoordinate(result);
			console.log(this.state.geometry);
			this.setState({ has_route_fetched: false});
		}

		if (this.state.has_geometry_changed) {
			console.log("Changed and Updated");
			console.log(this.state.geometry);
			let res = this.state.geometry;
			console.log("abcd");
			let length1 = this.state.actualRoute.length
			console.log(length1);
			console.log(this.state.actualSteps);
			this.onUpdate();
			this.setState({ geometry: [], has_geometry_changed: false });
		}
	}

	//HELPER FUNCTIONS
	RenderContents() {
		if (this.state.has_busstops_fetched === false) {
			return <div>Loading</div>;
		} else {
			console.log(this.state.busstops)
			return (
				<div>
					<Map
						ref={this.child}
						token={REACT_APP_MAPBOX_TOKEN}
						geometry={this.state.geometry}
						busstop={this.state.busstops}
						routeLength={this.state.routeLength}
						actualRoute={this.state.actualRoute}
						actualSteps={this.state.actualSteps}
					/>
					<InfoSection
						handler={this.handleEndChange.bind(this)}
						submithandler={this.handlefetch.bind(this)}
					/>
					<RouteSelection submithandler={this.handlechoose.bind(this)}
					/>
				</div>
			);
		}
		
	}

	render() {
		return this.RenderContents();
	}
}

ReactDOM.render(<App />, document.querySelector("#root"));
