import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password } from "../actions/auth";
import FormContainer from "../containers/FormContainer";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

const ResetPassword = ({ reset_password }) => {
	const [requestSent, setRequestSent] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
	});

	const { email } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();

		reset_password(email);
		setRequestSent(true);
	};

	// Is the user authenticated?
	// redirect them to the homepage

	if (requestSent) {
		return <Redirect to='/' />;
	}

	return (
		<Fragment>
			<FormContainer
				title='Request Password Reset'
				message='Give your Valid Email Address and Check your Email for Reset Link'
				submit_message=''
				submit_status=''
				is_hidden={true}>
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
				<SubmitButton
					Value='Reset Password'
					handleFunction={onSubmit.bind(this)}
				/>
			</FormContainer>
		</Fragment>
	);
};

export default connect(null, { reset_password })(ResetPassword);
