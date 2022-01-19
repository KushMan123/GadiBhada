import React from "react";
import ReactMapGL from "react-map-gl";

const color = [
	"#03AA46",
	"#5630CF",
	"#D926BD",
	"#DC3023",
	"#E29E1D",
	"#36BAC9",
];

class Map extends React.Component {
	state = {
		width: "100vw",
		height: "100vh",
		latitude: 27.7270479,
		longitude: 85.304598,
		zoom: 15,
		route: [0],
	};

	addRoute() {
		if (Object.entries(this.props.geometry).length !== 0) {
			const map = this.ReactMapGL.getMap();
			var route_id = this.state.route[this.state.route.length - 1] + 1;
			map.addLayer({
				id: route_id.toString(),
				type: "line",
				source: {
					type: "geojson",
					data: {
						type: "Feature",
						properties: {},
						geometry: this.props.geometry,
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
			this.setState({ route: [...this.state.route, route_id] });
		}
	}

	render() {
		return (
			<ReactMapGL
				ref={(reactmap) => (this.ReactMapGL = reactmap)}
				width={this.state.width}
				height={this.state.height}
				latitude={this.state.latitude}
				longitude={this.state.longitude}
				zoom={this.state.zoom}
				mapboxApiAccessToken={this.props.token}
				onViewportChange={(viewport) => {
					this.setState({
						latitude: viewport.latitude,
						longitude: viewport.longitude,
						zoom: viewport.zoom,
					});
				}}></ReactMapGL>
		);
	}
}

export default Map;
