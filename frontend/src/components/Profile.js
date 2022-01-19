import React, { useState } from "react";
import Busdatainput from "./Busdatainput";

const Profile = (props) => {
	console.log(props.Image);
	return (
		<div className='profilebody'>
			<div className='card-container'>
				{props.Is_Busowner ? (
					<span className='busowner'>BUSOWNER</span>
				) : (
					<span className='busowner'>BUSUSER</span>
				)}
				<br />
				<div className='round'>
					<img className='img' src={props.Image} alt='user' />
				</div>
				<div className='name-container'>
					<h3>{props.Name}</h3>
					<div className='popup'>
						{/* {show ? null : <h6>Bus data input</h6>} */}
						<i className='fas fa-edit' onClick={props.HandleEdit}></i>
					</div>
				</div>
				<h6>Nepal</h6>
				<p className='email'>{props.Email}</p>

				<div className='busdet'>
					<h6 className='Route'> Your Route</h6>
					<ul>
						{props.Routes.map((item, index) => {
							return (
								<ul key={index}>
									{item.map((subitem, i) => {
										return <li>{subitem}</li>;
									})}
								</ul>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};
export default Profile;
