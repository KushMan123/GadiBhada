import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signup } from "../actions/auth";
import FormContainer from "../containers/FormContainer";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

const Signup = ({ signup, isAuthenticated, message }) => {
	const [accountCreated, setAccountCreated] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		re_password: "",
		is_busowner: false,
	});

	const { name, email, password, re_password, is_busowner } = formData;

	const onChange = (e) => {
		console.log(e.target.value);
		if (e.target.type == "checkbox") {
			setFormData({ ...formData, is_busowner: !is_busowner });
		} else {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();

		if (password === re_password) {
			signup(name, email, password, re_password, is_busowner);
			setAccountCreated(true);
		}
	};

	// Is the user authenticated?
	// redirect them to the homepage

	if (isAuthenticated) {
		return <Redirect to='/' />;
	}

	if (accountCreated) {
		return <Redirect to='/login' />;
	}

	return (
		<FormContainer
			title='Create an Account'
			message='Password must conatin at least 8 characters (mix of Letters, Numbers, Symbols)'
			submit_message=''
			submit_status=''
			is_hidden={true}>
			<InputField
				labelName='Name'
				inputID='name'
				handleFunction={(e) => onChange(e)}
				Name='name'
				isReadOnly={false}
				placeholder='Name'
				Value={name}
				Type='text'
			/>
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
			<InputField
				labelName='Confirm Password'
				inputID='re_password'
				handleFunction={(e) => onChange(e)}
				Name='re_password'
				isReadOnly={false}
				placeholder='Confirm Password'
				Value={re_password}
				Type='password'
			/>
			<div className='input_field terms'>
				<label className='check'>
					<input
						type='checkbox'
						onChange={(e) => onChange(e)}
						name='is_busowner'
						checked={is_busowner}
					/>
					<span className='checkmark'></span>
				</label>
				<p>Are you a Bus-Owner?</p>
			</div>
			<SubmitButton
				Value='Create an Account'
				handleFunction={onSubmit.bind(this)}
			/>
			<div className='input_field'>
				<p className='link-text'>
					Already have an Account ? <Link to='/login'>Sign In</Link>
				</p>
			</div>
		</FormContainer>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	message: state.auth.message,
});

export default connect(mapStateToProps, { signup })(Signup);
