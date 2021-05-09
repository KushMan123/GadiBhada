import React from "react";
import ReactMapGL from "react-map-gl";
import { lineString, along, length, lineDistance, bearing, randomLineString} from '@turf/turf';


const color = [
	// "#03AA46",
	// "#5630CF",
	// "#D926BD",
	// "#DC3023",
	// "#E29E1D",
	// "#36BAC9",
	"#D1EBDB"
];

var point1 = {
	'type':'FeatureCollection',
	'features':[
	  {
		'type':'Feature',
		'properties':{bearing},
		'geometry':{
		  'type':'Point',
		  'coordinates':[]
		}
	  }
	]
  };

  var counter = 0;

class Map extends React.Component {
	state = {
		width: "100vw",
		height: "100vh",
		latitude: 27.7270479,
		longitude: 85.304598,
		zoom: 15,
		route: [0],
		counter: 0,
	};
	

	addRoute() {
		if (Object.entries(this.props.geometry).length !== 0) {
			const map = this.ReactMapGL.getMap();
			var route_id = this.state.route[this.state.route.length - 1] + 1;

			var point1 = {
				'type':'FeatureCollection',
				'features':[
				  {
					'type':'Feature',
					'properties':{bearing},
					'geometry':{
					  'type':'Point',
					  'coordinates':[]
					}
				  }
				]
			  };

			map.addSource('point',{
				'type' : 'geojson',
				'data': {
					type: "Feature",
					properties: {bearing},
					geometry: {
					'type':'Point',
					'coordinates': this.props.geometry.coordinates[0]
				  }
				}
			  });

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

			map.addLayer({
				'id': 'point',
				'type': 'symbol',
				'source': 'point',
				'layout': {
				// This icon is a part of the Mapbox Streets style.
				// To view all images available in a Mapbox style, open
				// the style in Mapbox Studio and click the "Images" tab.
				// To add a new image to the style at runtime see
				// https://docs.mapbox.com/mapbox-gl-js/example/add-image/
				'icon-image': 'museum-15',
				'icon-rotate': ['get', 'bearing'],
				'icon-rotation-alignment': 'map',
				'icon-allow-overlap': true,
				'icon-ignore-placement': true,
				}
				});

			
			console.log(this.state.route);
			console.log(this.state.counter);
			console.log(this.props.actualSteps);
			console.log(this.props.actualRoute);
			this.animate(counter);

		}

		
	}

	animate = () => {
		const map = this.ReactMapGL.getMap();
		var start = this.props.actualRoute[
			this.state.counter >= this.props.actualSteps ? this.state.counter - 1 : this.state.counter 
		];
		var end = this.props.actualRoute[
			this.state.counter >= this.props.actualSteps ? this.state.counter  : this.state.counter + 1
		];

		if(!start || !end) return;

		point1.features[0].geometry.coordinates = this.props.actualRoute[this.state.counter];

		point1.features[0].properties.bearing = bearing(start, end);

		map.getSource('point').setData(point1);

		if (this.state.counter < this.props.actualSteps) {
			requestAnimationFrame(this.animate);
		  }
	  
		this.state.counter = this.state.counter + 1;

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
