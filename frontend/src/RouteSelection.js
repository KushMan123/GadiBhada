import React from "react";

const RouteSelection = (props) => {
	return (
		<form>
			<label>
				Select a Bus-route
				<select onChange={props.submithandler}>
					<option value=''>---CHOOSE---</option>
					<option value='SRS_ROUTE'>Swayambhu-RNAC-Swayambhu</option>
					<option value='KG_ROUTE'>Kalanki-Gokarna</option>
					<option value='GK_ROUTE'>Gokarna-Kalanki</option>
					<option value='BK_ROUTE'>Balaju-Kamalbinayak</option>
					<option value='KB_ROUTE'>Kamalbinayak-Balaju</option>
					<option value='RINGROAD'>Ringroad</option>
					<option value='RINGROAD_REVERSE'>Ringroad Reverse</option>
				</select>
			</label>
		</form>
	);
};

export default RouteSelection;
