import React from "react";

const RouteSelection = (props) => {
	return (
		<form>
			<label>
				Select a Bus-route
				<select onChange={props.submithandler}>
					<option value=''>---CHOOSE---</option>
					<option value='RK_ROUTE'>Ratnapark-Kalanki-Ratnapark</option>
					<option value='KR_ROUTE'>Kalanki-Ratnapark</option>
					<option value='RBK_ROUTE'>Ratnapark-Balkhu-Kalanki-Balkhu-Ratnapark</option>
					<option value='RD_ROUTE'>Ratnapark-Dhulikhel-Ratnapark</option>
				</select>
			</label>
		</form>
	);
};

export default RouteSelection;
