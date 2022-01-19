import React, { Fragment } from "react";
import Formpage from "./Formpage";
import GeocoderBar from "./GeocoderBar";
import Routepage from "./Routepage";
import Map from "./Map";
import Dropdown from "./Dropdown";
import Signup from "./Signup";
import Login from "./Login";
import Activate from "./Activate";
import ResetPassword from "./ResetPassword";
import ResetPassswordConfirm from "./ResetPasswordConfirm";
import "../../static/css/mappage.css";
import { lineString, length, along } from "@turf/turf";
import Information from "./Information";
import Loading from "./Loading";
import Profilepage from "./Profilepage";

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from "react-router-dom";

import { connect } from "react-redux";
import { checkAuthenticated, load_user, logout } from "../actions/auth";
import store from "../store";
import MessageBox from "./MessageBox";

const REACT_APP_MAPBOX_TOKEN =
	"pk.eyJ1Ijoia3VzaG1hbjEyMyIsImEiOiJja25vczluNzIxMXM5Mm5vNWNydzJkaDgyIn0.Cm70isgaVNNhYBmHRqScZg";

class Mappage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fetched_stops: [],
			has_busstop_fetched: false,
			fetched_routes: [],
			routeLength: "",
			actualRoute: [],
			actualSteps: 0,
			actualPoints: [],
			has_intial_routes_id_fetched: false,
			route: {},
			has_selected_routed_fetched: false,
			geometry: [],
			has_geometry_changed: false,
			is_authenticated: false,
			source: "",
			destination: "",
			instructions: ["No Instructions"],
			is_menuvisible: false,
			is_menuactive: false,
			is_datafetching: false,
			should_menu_be_visible: false,
			show_message: false,
			message_status: "green",
			message: "",
			error_occured: false,
			busfare: 0,
			has_calculated_fare: false,
			can_animate: false,
			is_busowner: false,
		};
		this.child = React.createRef();
	}

	componentDidMount() {
		console.log("Component Mounted");
		document.body.classList.add("overflow-hidden");
		this.props.checkAuthenticated();
		this.props.load_user();
		store.subscribe(() => {
			// console.log(store.getState().auth.isAuthenticated);
			this.setState({
				// is_busowner: store.getState().auth.user.is_busowner,
				is_authenticated: store.getState().auth.isAuthenticated,
			});
		});

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
		store.subscribe(() => {
			// console.log(store.getState().auth.isAuthenticated);
			this.setState({
				is_authenticated: store.getState().auth.isAuthenticated,
			});
		});
		if (this.state.has_selected_routed_fetched) {
			let result = this.state.route.map((a) => [a.longitude, a.latitude]);
			this.fetchRouteCoordinates(result);
			this.setState({ has_selected_routed_fetched: false });
		}

		if (this.state.has_geometry_changed || this.state.error_occured) {
			this.calculateFare();
			if (this.state.has_geometry_changed) {
				this.setState({
					is_datafetching: false,
				});
				setTimeout(() => {
					this.child.current.addRoute();
					this.setState({ can_animate: true });
					// this.child.current.handleAnimation();
					if (this.state.should_menu_be_visible) {
						this.setState({
							is_menuvisible: true,
							is_menuactive: true,
						});
					}
					this.setState({
						geometry: [],
						show_message: false,
					});
				}, 1500);
				this.setState({ has_geometry_changed: false });
			}
			if (this.state.error_occured) {
				setTimeout(() => {
					this.setState({
						show_message: false,
					});
				}, 1500);
				this.setState({ error_occured: false });
			}
		}
	}

	calculateFare = () => {
		console.log("Entered calculate fare");
		var line = lineString(this.state.actualRoute);
		var lineDistance = length(line, { units: "kilometers" });
		console.log(lineDistance);
		if (lineDistance <= 4) {
			console.log("The fare is Rs.13");
			this.setState({ busfare: 13, has_calculated_fare: true });
		} else if (lineDistance > 4 && lineDistance < 6) {
			console.log("The fare is Rs.15");
			this.setState({ busfare: 15, has_calculated_fare: true });
		} else if (lineDistance >= 6 && lineDistance < 8) {
			console.log("The fare is Rs.16");
			this.setState({ busfare: 16, has_calculated_fare: true });
		} else if (lineDistance >= 8 && lineDistance < 9) {
			console.log("The fare is Rs.17");
			this.setState({ busfare: 17, has_calculated_fare: true });
		} else if (lineDistance >= 9 && lineDistance <= 10) {
			console.log("The fare is Rs.19");
			this.setState({ busfare: 19, has_calculated_fare: true });
		} else if (lineDistance > 10 && lineDistance <= 13) {
			console.log("The fare is Rs.21");
			this.setState({ busfare: 21, has_calculated_fare: true });
		} else if (lineDistance > 13 && lineDistance <= 16) {
			console.log("The fare is Rs.22");
			this.setState({ busfare: 16, has_calculated_fare: true });
		} else if (lineDistance > 16 && lineDistance <= 19) {
			console.log("The fare is Rs.23");
			this.setState({ busfare: 23, has_calculated_fare: true });
		} else if (lineDistance > 19) {
			console.log("The fare is Rs.24");
			this.setState({ busfare: 24, has_calculated_fare: true });
		}
	};

	guestLinks = () => {
		return (
			<div className='signbtn_group'>
				<Link to='/login'>
					<button className='button green'>Login</button>
				</Link>
				<Link to='/signup'>
					<button className='button green'>Sign up</button>
				</Link>
			</div>
		);
	};

	authLinks = () => {
		return (
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
				<button className='icon_btn'>
					<Link to='/userprofile'>
						<i className='fas fa-user'></i>
					</Link>
				</button>
				<button className='icon_btn' onClick={this.props.logout}>
					<Link to='#!'>
						<i className='fas fa-power-off'></i>
					</Link>
				</button>
			</div>
		);
	};

	fetchRouteCoordinates(location) {
		console.log(location);
		console.log(location.length);
		var i,
			temporary,
			chunk = 25;
		var total_chucks = Math.ceil(location.length / chunk);
		console.log("totoal chucks", total_chucks);
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
					console.log(data);
					if (data.code === "Ok") {
						if (total_chucks === 1) {
							if (chunk_no === total_chucks) {
								var line = lineString(data.routes[0].geometry.coordinates);
								var lineDistance = length(line, { units: "kilometers" });
								var arc = [];
								var steps = 5000;

								for (var i = 0; i < lineDistance; i += lineDistance / steps) {
									var segment = along(line, i);
									arc.push(segment.geometry.coordinates);
								}
								console.log("changing");
								this.setState({
									actualSteps: steps,
									actualRoute: arc,
									routeLength: lineDistance.toString(),
									geometry: this.state.geometry.concat(
										data.routes[0].geometry.coordinates
									),
									has_geometry_changed: true,
									show_message: true,
									message_status: "green",
									message: "Data Fetched Successfully",
								});
							}
						} else {
							if (chunk_no < total_chucks) {
								var line = lineString(data.routes[0].geometry.coordinates);
								var lineDistance = length(line, { units: "kilometers" });
								var arc = [];
								var steps = 5000;

								for (var i = 0; i < lineDistance; i += lineDistance / steps) {
									var segment = along(line, i);
									arc.push(segment.geometry.coordinates);
								}

								this.setState({
									actualSteps: steps,
									actualRoute: this.state.actualRoute.concat(arc),
									routeLength: lineDistance.toString(),
									geometry: this.state.geometry.concat(
										data.routes[0].geometry.coordinates
									),
								});
							}
							if (chunk_no === total_chucks) {
								var line = lineString(data.routes[0].geometry.coordinates);
								var lineDistance = length(line, { units: "kilometers" });
								var arc = [];
								var steps = 5000;

								for (var i = 0; i < lineDistance; i += lineDistance / steps) {
									var segment = along(line, i);
									arc.push(segment.geometry.coordinates);
								}
								console.log("changing");
								this.setState({
									actualSteps: steps,
									actualRoute: this.state.actualRoute.concat(arc),
									routeLength: lineDistance.toString(),
									geometry: this.state.geometry.concat(
										data.routes[0].geometry.coordinates
									),
									has_geometry_changed: true,
									show_message: true,
									message_status: "green",
									message: "Data Fetched Successfully",
								});
							}
							chunk_no = chunk_no + 1;
						}
					} else {
						this.setState({
							show_message: true,
							message_status: "red",
							message: "Error Occured",
							error_occured: true,
						});
					}
				});
		}
	}

	handleRouteSelection(event) {
		console.log(event.target.id);
		this.setState({
			is_datafetching: true,
		});

		fetch(`http://127.0.0.1:8000/api/get-route?rid=${event.target.id}`)
			.then((response) => response.json())
			.then((data) => {
				console.log("data", data);
				if ("error" in data) {
					this.setState({
						error_occured: true,
						is_datafetching: false,
						show_message: true,
						message_status: "red",
						message: "Database Error Occured",
					});
				} else {
					this.setState({
						route: data,
						has_selected_routed_fetched: true,
					});
				}
			});
	}

	handleGetInfo = (event) => {
		console.log("Get Info");
		const sourceLat = this.child.current.getSourceLat();
		const sourceLng = this.child.current.getSourceLng();
		const destinationLat = this.child.current.getDestinationLat();
		const destinationLng = this.child.current.getDestinationLng();
		const source = this.child.current.getSourcePlaceholder();
		const destination = this.child.current.getDestinationPlaceholder();
		if (
			!(sourceLat === "" && sourceLng === "") &&
			!(destinationLat === "" && destinationLng === "")
		) {
			this.setState({
				is_datafetching: true,
			});
			fetch(
				`/api/get-path?source-longitude=${sourceLng}&source-latitude=${sourceLat}&destination-longitude=${destinationLng}&destination-latitude=${destinationLat}`
			)
				.then((response) => response.json())
				.then((data) => {
					console.log("data", data);
					if ("error" in data) {
						this.setState({
							error_occured: true,
							is_datafetching: false,
							show_message: true,
							message_status: "red",
							message: "Database Error Occured",
						});
					} else {
						console.log(data);
						this.setState({
							source: source,
							destination: destination,
							instructions: data.instructions,
							route: data.route,
							has_selected_routed_fetched: true,
							should_menu_be_visible: true,
						});
					}
				});
		}
	};

	handleBusAnimation() {
		if (this.state.can_animate) {
			console.log("Bus");
			this.child.current.handleAnimation();
		}
	}

	RenderContent() {
		if (
			this.state.has_busstop_fetched &&
			this.state.has_intial_routes_id_fetched
		) {
			if (!this.state.is_datafetching) {
				return (
					<div className='map-body'>
						<Map
							ref={this.child}
							busstops={this.state.fetched_stops}
							geometry={this.state.geometry}
							token={REACT_APP_MAPBOX_TOKEN}
							routeLength={this.state.routeLength}
							actualRoute={this.state.actualRoute}
							actualSteps={this.state.actualSteps}
							handleGetInfo={this.handleGetInfo.bind(this)}
						/>
						{this.state.is_authenticated ? this.authLinks() : this.guestLinks()}

						<Dropdown
							DisplayText='Select to View Route'
							FetchedStops={this.state.fetched_routes}
							handleFunction={this.handleRouteSelection.bind(this)}
						/>
						<div className='bottom-container'>
							<button
								className='button green'
								onClick={this.handleBusAnimation.bind(this)}>
								Get Bus Info
							</button>
						</div>

						<Information
							Source={this.state.source}
							Destination={this.state.destination}
							Instructions={this.state.instructions}
							Visible={this.state.is_menuvisible}
							Active={this.state.is_menuactive}
							Busfare={this.state.busfare}
						/>
						<MessageBox
							ShowMessage={this.state.show_message}
							Message={this.state.message}
							MessageStatus={this.state.message_status}
						/>
					</div>
				);
			} else {
				return <Loading LoadingText='Fetching Data' />;
			}
		} else {
			return <Loading LoadingText='Loading' />;
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
					<Route path='/login' component={Login}></Route>
					<Route path='/signup' component={Signup}></Route>
					<Route path='/reset-password' component={ResetPassword}></Route>
					<Route
						path='/password/reset/confirm/:uid/:token'
						component={ResetPassswordConfirm}></Route>
					<Route path='/activate/:uid/:token' component={Activate}></Route>
					<Route path='/userprofile' component={Profilepage}></Route>
				</Switch>
			</Router>
		);
	}
}

export default connect(null, { checkAuthenticated, load_user, logout })(
	Mappage
);
