import React, { useState } from "react";
import "../../static/css/busdatainput.css";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router";

const Busdatainput = (props) => {
	const [profileData, updateProfileData] = useState(null);
	const [profileimage, setProfileImage] = useState(null);
	const history = useHistory();
	const handleChange = (e) => {
		if ([e.target.name] == "name") {
			updateProfileData({
				profileData: e.target.value,
			});
			console.log(e.target.value);
		}

		if ([e.target.name] == "image") {
			if (e.target.files && e.target.files[0]) {
				var img = document.querySelector("#p-image");
				var lbl = document.querySelector("#p-name"); // $('img')[0]
				img.src = URL.createObjectURL(e.target.files[0]);
				lbl.innerHTML = e.target.files[0].name; // set src to blob url
				// img.onload = imageIsLoaded;
			}
			setProfileImage({
				image: e.target.files,
			});
			console.log(e.target.files[0]);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `JWT ${localStorage.getItem("access")}`,
			},
		};
		const URL = `http://127.0.0.1:8000/account/create-profiledata/`;
		let formData = new FormData();
		formData.append("email", props.Email);
		formData.append("name", profileData.profileData);
		formData.append("image", profileimage.image[0]);
		console.log(formData.get("email"));
		axios
			.post(URL, formData, {
				headers: {
					"content-type": "multipart/form-data",
					Authorization: `JWT ${localStorage.getItem("access")}`,
				},
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => console.log(err));
		setTimeout(() => {
			history.push("/");
		}, 1000);
	};

	return (
		// <div className="bg-contact3 hidebusdataform" id="busdataform">
		//   <div class="container-contact3">
		//     <div class="wrap-contact3">
		//       <div class="close-button">
		//         <button onClick={props.HandleClose}>
		//           <i class="far fa-times-circle"></i>
		//         </button>
		//       </div>
		//       <form class="contact3-form validate-form">
		//         <span class="contact3-form-title">Personal Details</span>

		//         <div
		//           class="wrap-input3 validate-input"
		//           data-validate="Bus Number is required"
		//         >
		//           <input
		//             class="input3"
		//             name="name"
		//             onChange={handleChange}
		//             placeholder="Your name"
		//           ></input>
		//           <span class="focus-input3"></span>
		//         </div>

		//       <input
		//         accept="imagae/*"
		//         id="profile-image"
		//         onChange={handleChange}
		//         name="image"
		//         type="file"
		//       />
		//         <div class="container-contact3-form-btn">
		//           <button class="contact3-form-btn"
		//           onClick={handleSubmit}
		//           >Submit</button>
		//         </div>
		//       </form>
		//     </div>
		//   </div>
		// </div>
		<div className='modal'>
			<div className='add-wrapper'>
				<i className='fas fa-times' onClick={props.HandleClose}></i>
				<div className='registration-title'>Edit Your Profile Information</div>
				<div className='form'>
					<div className='input-field'>
						<label>Profile Name</label>
						<input
							type='text'
							className='input'
							name='name'
							placeholder='Your name'
							onChange={handleChange}></input>
					</div>
					<div className='input-field'>
						<label>Profile Image</label>
						<input
							type='file'
							id='file'
							accept='image/*'
							name='image'
							onChange={handleChange}></input>
						<br />
						<label for='file' className='alt-btn'>
							<i className='far fa-image'></i>Choose a Photo
						</label>
					</div>
					<div className='input-field'>
						<img
							src='https://omegamma.com.au/wp-content/uploads/2017/04/default-image-720x530.jpg'
							alt='p-image'
							id='p-image'></img>
					</div>
					<div className='input-field'>
						<label id='p-name'>Image</label>
					</div>
					<div className='input-field'>
						<input
							type='submit'
							value='Update'
							className='reg-btn'
							onClick={handleSubmit}></input>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps)(Busdatainput);
