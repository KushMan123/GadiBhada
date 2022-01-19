import React, { useEffect } from "react";

const Information = (props) => {
	function show() {
		document.getElementById("menu-container").classList.toggle("active");
	}

	useEffect(() => {
		if (!props.Visible) {
			document.getElementById("menu-container").classList.add("hidden");
		} else {
			document.getElementById("menu-container").classList.remove("hidden");
		}
	}, [props.Visible]);

	useEffect(() => {
		if (props.Active) {
			document.getElementById("menu-container").classList.add("active");
		} else {
			document.getElementById("menu-container").classList.remove("active");
		}
	}, [props.Active]);

	return (
		<div className='menu-container' id='menu-container'>
			<div className='menu-scroll'>
				<i className='fas fa-bars' onClick={show}></i>
			</div>
			<div className='menu-body'>
				<div className='menu-title'>Additional Information</div>
				<div className='tcol-wrapper'>
					<div className='tcol'>
						<label className='title'>Source</label>
						<label className='value'>{props.Source}</label>
					</div>
					<div className='tcol'>
						<label className='title'>Destination</label>
						<label className='value'>{props.Destination}</label>
					</div>
				</div>
				<div className='instruction-wrapper'>
					<div className='title'>Instructions</div>
					<ul className='lists'>
						{props.Instructions.map((instruction, key) => {
							console.log(instruction, key);
							return (
								<li className='list-items' key={key}>
									<span>{key + 1}</span>
									{instruction}
								</li>
							);
						})}
					</ul>
				</div>
				<div className='tcol-wrapper'>
					<div className='tcol'>
						<label className='title'>Total price:</label>
						<label className='value'>Rs {props.Busfare}</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Information;
