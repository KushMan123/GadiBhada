import React, { Fragment } from "react";

const MessageBox = (props) => {
	let className = "message-container " + props.MessageStatus;
	if (!props.ShowMessage) {
		className = className + " hide";
	}
	return (
		<div className={className} id='message-container'>
			<div className='message-icon'>
				<i className='fas fa-info-circle'></i>
			</div>
			<div className='message'>{props.Message}</div>
		</div>
	);
};

export default MessageBox;
