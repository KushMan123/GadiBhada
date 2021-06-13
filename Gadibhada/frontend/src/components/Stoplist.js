import React from "react";

const StopList = (props) => {
	return (
		<div className='checkbox'>
			<label>{props.LabelName}</label>
			<button
				className='add_btn'
				id={props.addButtonID}
				value={props.addButtonValue}
				onClick={props.handleAddButton}>
				ADD
			</button>
			<button
				className='delete_btn'
				id={props.deleteButtonID}
				value={props.deleteButtonValue}
				onClick={props.handleDeleteButton}>
				DELETE
			</button>
		</div>
	);
};

export default StopList;
