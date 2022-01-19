import React from "react";
import GeocoderBar from "./GeocoderBar";
import "../../static/css/formpage.css";
import "../containers/FormContainer";
import FormContainer from "../containers/FormContainer";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import store from "../store";
import { checkAuthenticated, load_user, logout } from "../actions/auth";
import { connect } from "react-redux";

// Custom Note Message to display at Note:
const custom_message =
	"Note: To Update or Delete the exisiting Busstop Please Match the Busstop Name";

//to get the cookie value for CRSF Token for POST Request
function getCookie(name) {
	if (!document.cookie) {
		return null;
	}
	const token = document.cookie
		.split(";")
		.map((c) => c.trim())
		.filter((c) => c.startsWith(name + "="));

	if (token.length === 0) {
		return null;
	}
	return decodeURIComponent(token[0].split("=")[1]);
}

const csrftoken = getCookie("csrftoken"); //getting the Token Value
console.log(csrftoken);

//Add Bustop Component
class Formpage extends React.Component {
	constructor(props) {
		super(props);
		this.inputLng = React.createRef(); // Reference to the Readonly Longitude Input
		this.inputLat = React.createRef(); // Reference to the Readonly Latitude Input
		this.state = {
			name: "", // Busstop name to pass to fetch request
			longitude: 0.0, // Inital Longitude Location
			latitude: 0.0, // Initial Latitude Location
			submit_message: "", // Message to display after submit (i,e, Success Message or Failure Message)
			submit_status: "", // Message Status that determines the background color of the submit message
			is_hidden: true, // hide and unhide the submit message
		};
	}

	//handles displaying the coordinates in the Latitude and Longitude Input Fields
	handleInputCoordinates(coordinates) {
		this.inputLat.current.value = coordinates[1];
		this.inputLng.current.value = coordinates[0];
		this.setState({
			longitude: this.inputLng.current.value,
			latitude: this.inputLat.current.value,
		});
	}

	//handles the Name in Name Input field
	handleNameChange(event) {
		this.setState({
			name: event.target.value,
		});
	}

	// Handles to Intialize the Input Fields after the data has been submitted
	handleAfterSave() {
		document.getElementById("busstop_name").value = "";
		this.inputLng.current.value = "";
		this.inputLat.current.value = "";
	}

	// Handles all the functionality to submit the data by POST, displaying and undisplaying the submit message and initialing the input fields
	handleAddStopClicked(event) {
		console.log(store.getState().auth.user.id);
		//POST REQUEST
		const requestOptions = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-CSRFToken": csrftoken,
			},
			body: JSON.stringify({
				name: this.state.name,
				latitude: this.state.latitude,
				longitude: this.state.longitude,
				usid: store.getState().auth.user.id,
			}),
		};
		fetch("/api/create-stop", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				//If the POST Request is successful then the response json contains the id of the Stop created else then there is an error.
				if ("id" in data) {
					//If the request is success then the success message and success status is set and is unhidden
					this.setState({
						submit_message: "Busstop Created",
						submit_status: "success",
						is_hidden: false,
					});
				} else {
					//If the request is failure then the failure message and failure status is set and is unhidden
					this.setState({
						submit_message: "Error Occurred",
						submit_status: "fail",
						is_hidden: false,
					});
				}
				this.handleAfterSave(); //Initialize the input Field
				//hide the submit message after 2500ms
				setTimeout(() => {
					this.setState({
						is_hidden: true,
					});
				}, 2500);
			});
		event.preventDefault(); //Prevent component from returning to default position
	}

	handleDeleteStop(event) {
		fetch(`/api/delete-stop?name=${this.state.name}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if ("success" in data) {
					this.setState({
						submit_message: "Busstop Deleted Successfully",
						submit_status: "success",
						is_hidden: false,
					});
				} else {
					this.setState({
						submit_message: "Error Occurred",
						submit_status: "fail",
						is_hidden: false,
					});
				}
				this.handleAfterSave();
				setTimeout(() => {
					this.setState({
						is_hidden: true,
					});
				}, 2500);
			});
		event.preventDefault();
	}

	render() {
		return (
			<FormContainer
				title='Add Busstop'
				message={custom_message}
				submit_message={this.state.submit_message}
				submit_status={this.state.submit_status}
				is_hidden={this.state.is_hidden}>
				<InputField
					labelName='Busstop Name'
					inputID='busstop_name'
					handleFunction={this.handleNameChange.bind(this)}
					isReadOnly={false}
				/>
				<div className='input_field'>
					<label>Busstop Coordinates</label>
				</div>
				<InputField
					labelName='Longitude'
					inputID='busstop_longitude'
					isReadOnly={true}
					ref={this.inputLng}
				/>
				<InputField
					labelName='Latitude'
					inputID='busstop_latitude'
					isReadOnly={true}
					ref={this.inputLat}
				/>
				<div className='input_field'>
					<div className='map_view'>
						<GeocoderBar
							handleInputCoordinates={this.handleInputCoordinates.bind(this)}
						/>
					</div>
				</div>
				<SubmitButton
					Value='Add Stop'
					handleFunction={this.handleAddStopClicked.bind(this)}
				/>
				<SubmitButton
					Value='Delete Stop'
					handleFunction={this.handleDeleteStop.bind(this)}
				/>
			</FormContainer>
		);
	}
}

export default connect(null, { checkAuthenticated, load_user, logout })(
	Formpage
);
