import React from "react";

const SubmitButton = (props) => {
	return (
		<div className='input_field'>
			<input
				type='submit'
				value={props.Value}
				className='btn'
				onClick={props.handleFunction}
			/>
		</div>
	);
};

export default SubmitButton;
