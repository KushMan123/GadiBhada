import React from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { bearing, lineString, length } from '@turf/turf';
import "./Map.css";

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
		counter: 0,
		busfare: 0,
		has_calculated_fare: false,
		has_animated: false,
		point1 : {
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
		  }
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
						geometry: {
							type: "LineString",
							coordinates: this.props.geometry,
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
			this.setState({ route: [...this.state.route, route_id] });

		}
	}

	handleAnimation = () => {
		const map = this.ReactMapGL.getMap();

		map.addSource('happy',{
			'type' : 'geojson',
			'data': {
				type: "Feature",
				properties: {bearing},
				geometry: {
				'type':'Point',
				'coordinates': this.props.geometry[0]
			  }
			}
		  });
		  
		  map.addLayer({
			'id': 'hritik',
			'type': 'symbol',
			'source': 'happy',
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

		this.animate(this.state.counter);
		this.setState({ has_animated: true });
		this.calculateFare(this.state.counter);

	}

	animate = () => {
		const map = this.ReactMapGL.getMap();
		var steps = this.props.actualRoute.length;
		var start = this.props.actualRoute[
			this.state.counter >= steps ? this.state.counter - 1 : this.state.counter 
		];
		var end = this.props.actualRoute[
			this.state.counter >= steps ? this.state.counter  : this.state.counter + 1
		];

		if(!start || !end) return;

		this.state.point1.features[0].geometry.coordinates = this.props.actualRoute[this.state.counter];

		this.state.point1.features[0].properties.bearing = bearing(start, end);

		map.getSource('happy').setData(this.state.point1);

		if (this.state.counter < steps) {
			requestAnimationFrame(this.animate);
		  }
	  
		this.state.counter = this.state.counter + 1;

	}

	calculateFare = () => {
		console.log("Entered calculate fare");
		// var beginjourney = [];
		// var endjourney = [];
		// this.props.actualRoute[0].map((coord) => {
		// 	beginjourney.push(coord)
		// });
		// console.log(beginjourney);
		// this.props.actualRoute[this.props.actualRoute.length - 1].map((coord) => {
		// 	endjourney.push(coord)
		// });
		// console.log(endjourney);
		var line = lineString(this.props.actualRoute)
		var lineDistance = length(line,{ units: 'kilometers'} );
		console.log(lineDistance)
		if(lineDistance <=4)
			{console.log("The fare is Rs.13");
			this.setState({ busfare: 13,
							has_calculated_fare: true});}
		else if(lineDistance > 4 && lineDistance < 6)
			{console.log("The fare is Rs.15");
			this.setState({ busfare: 15,
							has_calculated_fare: true});}

		else if(lineDistance >= 6 && lineDistance < 8)
			{console.log("The fare is Rs.16");
			this.setState({ busfare: 16,
				has_calculated_fare: true});}
		else if(lineDistance >= 8 && lineDistance < 9){
			console.log("The fare is Rs.17");
			this.setState({ busfare: 17,
				has_calculated_fare: true});}
		else if(lineDistance >= 9 && lineDistance <= 10){
			console.log("The fare is Rs.19");
			this.setState({ busfare: 19,
				has_calculated_fare: true});}
		else if(lineDistance > 10 && lineDistance <=13){
			console.log("The fare is Rs.21");
			this.setState({ busfare: 21,
				has_calculated_fare: true});}
		else if(lineDistance > 13 && lineDistance <=16){
			console.log("The fare is Rs.22");
			this.setState({ busfare: 16,
				has_calculated_fare: true});}
		else if(lineDistance > 16 && lineDistance <=19){
			console.log("The fare is Rs.23");
			this.setState({ busfare: 23,
				has_calculated_fare: true});}
		else if(lineDistance > 19){
			console.log("The fare is Rs.24");
			this.setState({ busfare: 24,
				has_calculated_fare: true});}

	}

	render() {

		let button;
		let fare;
		if (this.state.route.length > 1 && this.state.has_animated == false) {
			button =  <button className='animate-btn'
				 		onClick={this.handleAnimation} 
						>Get Info</button>;
		}
		if (this.state.has_calculated_fare == true){
			fare = <h2>
						The bus fare is Rs. {this.state.busfare}
					</h2>
		}
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
				}}>
					
					
				{this.props.busstop.map((park) => {
					return (
						<Marker
							key={park.bid}
							latitude={park.latitude}
							longitude={park.longitude}>
							<button className='map-btn'>
								<i className='fas fa-bus'></i>
							</button>
						</Marker>
					);
				})}
				{button}
				{fare}
			</ReactMapGL>
		);
	}
}

export default Map;
