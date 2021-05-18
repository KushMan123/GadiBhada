import React from "react";

const InfoSection = (props) => {
	return (
		<form>
			<label>Starting Point:</label>
			<input id='start' type='text' onChange={props.handler} />
			<label>Destination:</label>
			<input id='end' type='text' onChange={props.handler} />
			<input type='submit' value='submit' onClick={props.submithandler} />
		</form>
	);
};

export default InfoSection;
