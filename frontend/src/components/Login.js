import React, { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import FormContainer from "../containers/FormContainer";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { useHistory } from "react-router";
import store from "../store";

const Login = ({ login, isAuthenticated, message }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [submit_message, setSubmitMessage] = useState("LOGIN FAILED");
	const [submit_status, setSubmitStatus] = useState("success");
	const [is_hidden, setIsHidden] = useState(true);
	const [msg, setMsg] = useState("Login Failed");
	const [authenticate, setAuthenticate] = useState(true);
	let clicked = false;
	const { email, password } = formData;
	const history = useHistory();

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		clicked = true;
		console.log("clicked");
		login(email, password);
		store.subscribe(() => {
			setMsg(store.getState().auth.message);
			console.log(store.getState().auth.message);
			setAuthenticate(store.getState().auth.isAuthenticated);
			//  store.getState().auth.isAuthenticated
		});
		// if (authenticate) {
		// 	console.log("inside if");
		// 	console.log(store.getState().auth.message);
		// 	console.log(msg);
		// } else {
		// 	console.log("inside else");
		// 	console.log(store.getState().auth.message);
		// 	console.log(msg);
		// 	setSubmitMessage(msg);
		// 	setSubmitStatus("fail");
		// 	setIsHidden(false);
		// 	setTimeout(() => {
		// 		setIsHidden(true);
		// 	}, 2500);
		// }
	};

	// useEffect(() => {
	// 	console.log("Clicked");
	// 	clicked = false;
	// 	console.log(message);
	// 	console.log(isAuthenticated);
	// 	if (isAuthenticated) {
	// 		console.log(message);
	// 		setSubmitMessage(message);
	// 		setSubmitStatus("success");
	// 		if (message === "") {
	// 			setIsHidden(true);
	// 		} else {
	// 			setIsHidden(false);
	// 		}
	// 		setTimeout(() => {
	// 			setIsHidden(true);
	// 		}, 2500);
	// 	} else {
	// 		setSubmitMessage(message);
	// 		setSubmitStatus("fail");
	// 		if (message === "") {
	// 			setIsHidden(true);
	// 		} else {
	// 			setIsHidden(false);
	// 		}
	// 		setTimeout(() => {
	// 			setIsHidden(true);
	// 		}, 2500);
	// 	}
	// }, [clicked, message, isAuthenticated]);
	// Is the user authenticated?
	// redirect them to the homepage

	if (isAuthenticated) {
		// setTimeout(() => {
		// 	history.push("/");
		// }, 250);
		return <Redirect to='/' />;
	}

	// useEffect(() => {
	// 	if (isAuthenticated) {
	// 		console.log(message);
	// 		setSubmitMessage(message);
	// 		setSubmitStatus("success");
	// 		setIsHidden(false);
	// 		setTimeout(() => {
	// 			setIsHidden(true);
	// 		}, 2500);
	// 	} else {
	// 		setSubmitMessage(message);
	// 		setSubmitStatus("fail");
	// 		setIsHidden(false);
	// 		setTimeout(() => {
	// 			setIsHidden(true);
	// 		}, 2500);
	// 	}
	// }, [isAuthenticated]);

	return (
		<FormContainer
			title='Login to Your Account'
			message=''
			submit_message={submit_message}
			submit_status={submit_status}
			is_hidden={is_hidden}>
			<InputField
				labelName='Email'
				inputID='email'
				handleFunction={(e) => onChange(e)}
				Name='email'
				isReadOnly={false}
				placeholder='Email'
				Value={email}
				Type='email'
			/>
			<InputField
				labelName='Password'
				inputID='password'
				handleFunction={(e) => onChange(e)}
				Name='password'
				isReadOnly={false}
				placeholder='Password'
				Value={password}
				Type='password'
			/>
			<SubmitButton Value='Login' handleFunction={onSubmit.bind(this)} />
			<div className='input_field'>
				<p className='link-text'>
					Don't have an account? <Link to='/signup'>Sign Up</Link>
				</p>
			</div>
			<div className='input_field'>
				<p className='link-text'>
					Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
				</p>
			</div>
		</FormContainer>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	message: state.auth.message,
});

export default connect(mapStateToProps, { login })(Login);
