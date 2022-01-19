import React, { useRef } from "react";

//Input Fields for the form with Readonly features also
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
					name={props.Name}
					onChange={props.handleFunction}
					placeholder={props.placeholder}
					value={props.Value}
					type={props.Type}
					readOnly
				/>
			) : (
				<input
					ref={ref}
					type='text'
					className='input'
					id={props.inputID}
					name={props.Name}
					onChange={props.handleFunction}
					placeholder={props.placeholder}
					value={props.Value}
					type={props.Type}
				/>
			)}
		</div>
	);
});

export default InputField;
