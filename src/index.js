import React from "react";
import ReactDOM from "react-dom";
import InfoSection from "./InfoSection";
import Map from "./Map";

const REACT_APP_MAPBOX_TOKEN =
	"pk.eyJ1Ijoia3VzaG1hbjEyMyIsImEiOiJja25vczluNzIxMXM5Mm5vNWNydzJkaDgyIn0.Cm70isgaVNNhYBmHRqScZg";

// const locations = [
// 	//Route 1
// 	[85.2836136740116, 27.715801665252368],
// 	[85.2868155602215, 27.719565123175343],
// 	[85.28925553170771, 27.72076167718547],
// 	[85.29459915071986, 27.723374136257394],
// 	[85.30506466561249, 27.726145068309894],
// 	[85.30597470784187, 27.724711526470916],
// 	[85.30794249420168, 27.721635801395134],
// 	[85.30961718101014, 27.719184655873338],
// 	[85.3120104112786, 27.718183089618485],
// 	[85.31317864822459, 27.717809179915015],
// 	[85.31507386304095, 27.717134418186756],
// 	[85.31461058368699, 27.709341523472148],
// 	[85.31558769838833, 27.708942468044775],
// 	[85.31667511908184, 27.707554296585812],
// 	[85.31639179766916, 27.704237180095262],
// 	[85.31654919103855, 27.702018906808682],
// 	[85.3135854086907, 27.70024396141138],
// 	[85.3135142819939, 27.702505256868584],
// 	[85.31422611585727, 27.705711390273926],
// 	[85.31405183756304, 27.70774709821836],
// 	[85.31460058035827, 27.709346161620157],
// ];

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			start: "",
			end: "",
			geometry: {},
			has_geometry_changed: false,
		};
		this.child = React.createRef();
	}

	handleStartChange(event) {
		this.setState({
			start: event.target.value,
		});
		console.log(this.state.start);
	}

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
					geometry: data.routes[0].geometry,
					has_geometry_changed: true,
				});
			});
		event.preventDefault();
	}

	onUpdate() {
		this.child.current.addRoute();
	}

	componentDidUpdate() {
		if (this.state.has_geometry_changed) {
			console.log("Changed and Updated");
			this.onUpdate();
			this.setState({ has_geometry_changed: false });
		}
	}

	render() {
		return (
			<div>
				<Map
					ref={this.child}
					token={REACT_APP_MAPBOX_TOKEN}
					geometry={this.state.geometry}
				/>
				<InfoSection
					handler={this.handleEndChange.bind(this)}
					submithandler={this.handlefetch.bind(this)}
				/>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.querySelector("#root"));
