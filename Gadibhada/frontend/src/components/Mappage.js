import React from "react";
import Formpage from "./Formpage";
import GeocoderBar from "./GeocoderBar";
import Routepage from "./Routepage";
import Map from "./Map";
import Dropdown from "./Dropdown";
import "../../static/css/mappage.css";

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from "react-router-dom";

const REACT_APP_MAPBOX_TOKEN =
	"pk.eyJ1Ijoia3VzaG1hbjEyMyIsImEiOiJja25vczluNzIxMXM5Mm5vNWNydzJkaDgyIn0.Cm70isgaVNNhYBmHRqScZg";

class Mappage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fetched_stops: [],
			has_busstop_fetched: false,
			fetched_routes: [],
			has_intial_routes_id_fetched: false,
			route: {},
			has_selected_routed_fetched: false,
			geometry: [],
			has_geometry_changed: false,
		};
		this.child = React.createRef();
	}

	componentDidMount() {
		fetch("/api/stops")
			.then((response) => response.json())
			.then((data) => {
				this.setState({ fetched_stops: data, has_busstop_fetched: true });
			});
		fetch("/api/routes")
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					fetched_routes: data,
					has_intial_routes_id_fetched: true,
				});
			});
	}

	componentDidUpdate() {
		if (this.state.has_selected_routed_fetched) {
			let result = this.state.route.map((a) => [a.longitude, a.latitude]);
			this.fetchRouteCoordinates(result);
			this.setState({ has_selected_routed_fetched: false });
		}

		if (this.state.has_geometry_changed) {
			this.child.current.addRoute();
			this.setState({ geometry: [], has_geometry_changed: false });
		}
	}

	fetchRouteCoordinates(location) {
		var i,
			temporary,
			chunk = 5;
		var total_chucks = Math.ceil(location.length / chunk);
		var chunk_no = 1;
		var last_stop = [];
		for (i = 0; i < location.length; i += chunk) {
			temporary = last_stop.concat(location.slice(i, i + chunk));
			last_stop = [temporary[temporary.length - 1]];
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

	handleRouteSelection(event) {
		fetch(`http://127.0.0.1:8000/api/get-route?rid=${event.target.id}`)
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					route: data,
					has_selected_routed_fetched: true,
				});
			});
	}

	RenderContent() {
		if (
			this.state.has_busstop_fetched &&
			this.state.has_intial_routes_id_fetched
		) {
			return (
				<div>
					<Map
						ref={this.child}
						busstops={this.state.fetched_stops}
						geometry={this.state.geometry}
						token={REACT_APP_MAPBOX_TOKEN}
					/>
					<div className='iconbtn_group'>
						<button className='icon_btn'>
							<Link to='/createstop'>
								<i className='fas fa-bus-alt'></i>
							</Link>
						</button>
						<button className='icon_btn'>
							<Link to='/createroute'>
								<i className='fas fa-route'></i>
							</Link>
						</button>
					</div>
					<Dropdown
						DisplayText='Select to View Route'
						FetchedStops={this.state.fetched_routes}
						handleFunction={this.handleRouteSelection.bind(this)}
					/>
				</div>
			);
		} else {
			return <div>Loading..</div>;
		}
	}

	render() {
		return (
			<Router>
				<Switch>
					<Route exact path='/'>
						{this.RenderContent()}
					</Route>
					<Route path='/createstop' component={Formpage}></Route>
					<Route path='/map' component={GeocoderBar}></Route>
					<Route path='/createroute' component={Routepage}></Route>
				</Switch>
			</Router>
		);
	}
}

export default Mappage;
