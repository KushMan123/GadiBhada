import React from "react";

//Dropdown menu (Designed for the ROUTE Selection)
const Dropdown = (props) => {
	return (
		<div className='dropdown-container'>
			<div className='dropdown'>
				<div className='dropdown-select'>
					<span className='select'> {props.DisplayText}</span>
					<i className='fas fa-caret-down icon'></i>
				</div>
				<div className='dropdown-list'>
					{props.FetchedStops.map((route, key) => {
						return (
							<div
								className='dropdown-list-item'
								key={key}
								id={route.rid}
								onClick={props.handleFunction}>
								{route.rname}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Dropdown;
