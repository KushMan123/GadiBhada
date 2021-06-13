import React, { useRef } from "react";
import Logo from "../../static/images/logo.svg";

const FormContainer = (props) => {
	var alert_class = "message " + props.submit_status;
	return (
		<div className='body'>
			<div className='wrapper'>
				<div className='logo'>
					<img src={Logo} alt='logo' />
				</div>
				<div className='title'>{props.title}</div>
				<div className='note'>{props.message}</div>
				{props.is_hidden ? (
					<div className={alert_class} hidden>
						{props.submit_message}
					</div>
				) : (
					<div className={alert_class}>{props.submit_message}</div>
				)}
				<form className='form'>{props.children}</form>
			</div>
		</div>
	);
};

export default FormContainer;
