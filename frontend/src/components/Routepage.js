import React from "react";
import FormContainer from "../containers/FormContainer";
import "../../static/css/formpage.css";
import InputField from "./InputField";
import StopList from "./Stoplist";
import SubmitButton from "./SubmitButton";
import store from "../store";
import { checkAuthenticated, load_user, logout } from "../actions/auth";
import { connect } from "react-redux";

const custom_message =
	"Note: To Update the exisiting BusRoute Please Match the Busroute Name. Add the Routes in Sequentail Order";

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

class Routepage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			route_name: "",
			route_id: "",
			fetched_stops: [],
			stops: [],
			searchfield: "",
			submit_message: "",
			submit_status: "",
			is_hidden: true,
			auth_id: 0,
		};
		this.textarea = React.createRef();
	}

	componentDidMount() {
		fetch("/api/stops")
			.then((response) => response.json())
			.then((data) => {
				this.setState({ fetched_stops: data });
			});
	}

	handleRouteNameChange(event) {
		console.log(event.target.value);
		this.setState({ route_name: event.target.value });
	}

	handleRouteIDChange(event) {
		console.log(event.target.value);
		this.setState({ route_id: event.target.value });
	}

	handleAddButtonClick(event) {
		this.setState({ stops: [...this.state.stops, event.target.value] });
		setTimeout(() => {
			this.textarea.current.value = this.state.stops.toString();
		}, 100);
		event.preventDefault();
	}

	handleDeleteButtonClick(event) {
		let temp_array = this.state.stops;
		console.log(temp_array.includes(event.target.value));
		if (temp_array.includes(event.target.value)) {
			console.log("Yess");
			let index = temp_array.indexOf(event.target.value);
			if (index > -1) {
				temp_array.splice(index, 1);
			}
			this.setState({ stops: temp_array });
			setTimeout(() => {
				this.textarea.current.value = this.state.stops.toString();
			}, 100);
		}
		event.preventDefault();
	}

	handleSearchEvent(event) {
		this.setState({ searchfield: event.target.value });
	}

	handleAfterSave() {
		document.getElementById("route_id").value = "";
		document.getElementById("route_name").value = "";
		document.getElementById("route_search").value = "";
		document.getElementById("stops_entered").value = "";
		this.setState({ stops: [] });
	}

	handleAddRouteClick(event) {
		console.log("clicked");
		const requestOptions = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-CSRFToken": csrftoken,
			},
			body: JSON.stringify({
				rname: this.state.route_name,
				rid: this.state.route_id,
				stops: this.state.stops,
				usid: store.getState().auth.user.id,
			}),
		};
		fetch("/api/create-route", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if ("rid" in data) {
					this.setState({
						submit_message: "Route Created",
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
					this.setState({ is_hidden: true });
				}, 1500);
			});
		event.preventDefault();
	}

	handleDeleteRoute(event) {
		fetch(`/api/delete-route?rid=${this.state.route_id}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if ("success" in data) {
					this.setState({
						submit_message: "Route Deleted Successfully",
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
				}, 2000);
			});
		event.preventDefault();
	}

	render() {
		const filteredStops = this.state.fetched_stops.filter((stops) => {
			return stops.name
				.toString()
				.toLowerCase()
				.includes(this.state.searchfield.toLocaleLowerCase());
		});

		return (
			<FormContainer
				title='Add Route'
				message={custom_message}
				submit_message={this.state.submit_message}
				submit_status={this.state.submit_status}
				is_hidden={this.state.is_hidden}>
				<InputField
					labelName='Route-ID'
					inputID='route_id'
					handleFunction={this.handleRouteIDChange.bind(this)}
					isReadOnly={false}
				/>
				<InputField
					labelName='Route Name'
					inputID='route_name'
					handleFunction={this.handleRouteNameChange.bind(this)}
					isReadOnly={false}
				/>
				<InputField
					labelName=''
					inputID='route_search'
					placeholder='Search Stops'
					handleFunction={this.handleSearchEvent.bind(this)}
					isReadOnly={false}
				/>
				<div className='input_field'>
					<label>Busstops Selected</label>
					<textarea
						type='text'
						className='textarea'
						id='stops_entered'
						readOnly
						ref={this.textarea}></textarea>
				</div>
				<div className='input_field'>
					<label>Stops</label>
					<div className='checkbox_group'>
						{filteredStops.map((fetch_stop, key) => {
							let delete_id = `${fetch_stop.name}_delete`;
							return (
								<StopList
									key={key}
									LabelName={fetch_stop.name}
									addButtonID={fetch_stop.name}
									addButtonValue={fetch_stop.name}
									handleAddButton={this.handleAddButtonClick.bind(this)}
									deleteButtonID={delete_id}
									deleteButtonValue={fetch_stop.name}
									handleDeleteButton={this.handleDeleteButtonClick.bind(this)}
								/>
							);
						})}
					</div>
				</div>
				<SubmitButton
					Value='Add Route'
					handleFunction={this.handleAddRouteClick.bind(this)}
				/>
				<SubmitButton
					Value='Delete Route'
					handleFunction={this.handleDeleteRoute.bind(this)}
				/>
			</FormContainer>
		);
	}
}

export default connect(null, { checkAuthenticated, load_user, logout })(
	Routepage
);
