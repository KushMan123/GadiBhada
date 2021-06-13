import React from "react";
import GeocoderBar from "./GeocoderBar";
import "../../static/css/formpage.css";
import "../containers/FormContainer";
import FormContainer from "../containers/FormContainer";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

const custom_message =
	"Note: To Update the exisiting Busstop Please Match the Busstop Name";

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

const csrftoken = getCookie("csrftoken");
console.log(csrftoken);

class Formpage extends React.Component {
	constructor(props) {
		super(props);
		this.inputLng = React.createRef();
		this.inputLat = React.createRef();
		this.state = {
			name: "",
			longitude: 0.0,
			latitude: 0.0,
			submit_message: "",
			submit_status: "",
			is_hidden: true,
		};
	}

	handleInputCoordinates(coordinates) {
		this.inputLat.current.value = coordinates[1];
		this.inputLng.current.value = coordinates[0];
		this.setState({
			longitude: this.inputLng.current.value,
			latitude: this.inputLat.current.value,
		});
	}

	handleNameChange(event) {
		this.setState({
			name: event.target.value,
		});
	}

	handleAfterSave() {
		document.getElementById("busstop_name").value = "";
		this.inputLng.current.value = "";
		this.inputLat.current.value = "";
	}

	handleAddStopClicked(event) {
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
			}),
		};
		fetch("/api/create-stop", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if ("id" in data) {
					this.setState({
						submit_message: "Busstop Created",
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
			</FormContainer>
		);
	}
}

export default Formpage;
