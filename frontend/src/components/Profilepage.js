import React, { Fragment, useState, useEffect } from "react";
import "../../static/css/profilepage.css";
import Profile from "./Profile";
import Busdatainput from "./Busdatainput";
import { connect } from "react-redux";
import { render } from "react-dom";
import { checkAuthenticated, load_user, logout } from "../actions/auth";
import { lengthToDegrees } from "@turf/turf";

const Profilepage = ({ isAuthenticated, user }) => {
	const token = localStorage.getItem("access");
	const [profileData, updateProfileData] = useState(user.name);
	const [profileimage, setProfileImage] = useState(null);
	const [routes, setRoutes] = useState([]);

	const config = {
		headers: {
			Authorization: `JWT ${localStorage.getItem("access")}`,
		},
	};

	console.log(config);

	fetch(`http://127.0.0.1:8000/account/get-profiledata?uid=${user.id}`, config)
		.then((response) => response.json())
		.then((data) => {
			updateProfileData(data[0].name);
			let len = data[0].image.length;
			let img = data[0].image.slice(55, len);
			let img_src = "../../.." + img;
			console.log(img_src);
			setProfileImage(img_src);
		});

	useEffect(() => {
		fetch(`http://127.0.0.1:8000/account/get-routedata?uid=${user.id}`, config)
			.then((response) => response.json())
			.then((data) => {
				let datae = data[0].route_names;
				setRoutes([...routes, datae]);
			});
	}, [null]);

	if (isAuthenticated) {
		function show() {
			document.querySelector(".modal").style.display = "block";
		}
		function hide() {
			document.querySelector(".modal").style.display = "none";
		}

		return (
			<Fragment>
				<Busdatainput HandleClose={hide.bind(this)} Email={user.email} />
				<Profile
					Name={profileData}
					Email={user.email}
					Image={profileimage}
					Is_Busowner={user.is_busowner}
					HandleEdit={show.bind(this)}
					Routes={routes}
				/>
			</Fragment>
		);
	} else {
		return <div>Lol</div>;
	}
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps)(Profilepage);
