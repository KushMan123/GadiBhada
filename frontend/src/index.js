import React from "react";
import ReactDOM from "react-dom";
import InfoSection from "./InfoSection";
import RouteSelection from "./RouteSelection";
import Map from "./Map";
import "axios";
import axios from "axios";

const REACT_APP_MAPBOX_TOKEN =
	"pk.eyJ1Ijoia3VzaG1hbjEyMyIsImEiOiJja25vczluNzIxMXM5Mm5vNWNydzJkaDgyIn0.Cm70isgaVNNhYBmHRqScZg";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			start: "",
			end: "",
			geometry: [],
			has_geometry_changed: false,
			has_busstops_fetched: false,
			has_route_fetched: false,
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
				this.setState({
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
							this.setState({
								geometry: this.state.geometry.concat(
									data.routes[0].geometry.coordinates
								),
								has_geometry_changed: true,
							});
						}
					} else {
						if (chunk_no < total_chucks) {
							this.setState({
								geometry: this.state.geometry.concat(
									data.routes[0].geometry.coordinates
								),
							});
						}
						if (chunk_no === total_chucks) {
							this.setState({
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
		axios.get("http://127.0.0.1:8000/getAllStop").then((res) => {
			this.setState({
				busstops: res.data,
				has_busstops_fetched: true,
			});
		});
	}

	componentDidUpdate() {
		if (this.state.has_route_fetched) {
			let result = this.state.route.map((a) => [a.longitude, a.latitude]);
			this.fetchcoordinate(result);
			this.setState({ has_route_fetched: false });
		}

		if (this.state.has_geometry_changed) {
			console.log("Changed and Updated");
			console.log(this.state.geometry);
			this.onUpdate();
			this.setState({ geometry: [], has_geometry_changed: false });
		}
	}

	//HELPER FUNCTIONS
	RenderContents() {
		if (this.state.has_busstops_fetched === false) {
			return <div>Loading</div>;
		} else {
		}
		return (
			<div>
				<Map
					ref={this.child}
					token={REACT_APP_MAPBOX_TOKEN}
					geometry={this.state.geometry}
					busstop={this.state.busstops}
				/>
				<InfoSection
					handler={this.handleEndChange.bind(this)}
					submithandler={this.handlefetch.bind(this)}
				/>
				<RouteSelection submithandler={this.handlechoose.bind(this)} />
			</div>
		);
	}

	render() {
		return this.RenderContents();
	}
}

ReactDOM.render(<App />, document.querySelector("#root"));
