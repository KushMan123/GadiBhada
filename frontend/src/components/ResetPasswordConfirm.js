import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password_confirm } from "../actions/auth";
import FormContainer from "../containers/FormContainer";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

const ResetPasswordConfirm = ({ match, reset_password_confirm }) => {
	const [requestSent, setRequestSent] = useState(false);
	const [formData, setFormData] = useState({
		new_password: "",
		re_new_password: "",
	});

	const { new_password, re_new_password } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();

		const uid = match.params.uid;
		const token = match.params.token;

		reset_password_confirm(uid, token, new_password, re_new_password);
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
				title='Password Reset'
				message=''
				submit_message=''
				submit_status=''
				is_hidden={true}>
				<InputField
					labelName='New Password'
					inputID='new_password'
					handleFunction={(e) => onChange(e)}
					Name='new_password'
					isReadOnly={false}
					placeholder='New Password'
					Value={new_password}
					Type='password'
				/>
				<InputField
					labelName='Confirm Password'
					inputID='re_new_password'
					handleFunction={(e) => onChange(e)}
					Name='re_new_password'
					isReadOnly={false}
					placeholder='Confirm Password'
					Value={re_new_password}
					Type='password'
				/>
				<SubmitButton
					Value='Create an Account'
					handleFunction={onSubmit.bind(this)}
				/>
			</FormContainer>
		</Fragment>
	);
};

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);
