import React, { useRef } from "react";

const InputField = React.forwardRef((props, ref) => {
	const myRef = React.createRef();
	return (
		<div className='input_field'>
			<label>{props.labelName}</label>
			{props.isReadOnly ? (
				<input
					ref={ref}
					type='text'
					className='input'
					id={props.inputID}
					onChange={props.handleFunction}
					placeholder={props.placeholder}
					readOnly
				/>
			) : (
				<input
					ref={ref}
					type='text'
					className='input'
					id={props.inputID}
					onChange={props.handleFunction}
					placeholder={props.placeholder}
				/>
			)}
		</div>
	);
});

export default InputField;
