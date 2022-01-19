import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADED_SUCCESS,
	USER_LOADED_FAIL,
	AUTHENTICATED_SUCCESS,
	AUTHENTICATED_FAIL,
	PASSWORD_RESET_FAIL,
	PASSWORD_RESET_SUCCESS,
	PASSWORD_RESET_CONFIRM_FAIL,
	PASSWORD_RESET_CONFIRM_SUCCESS,
	SIGNUP_SUCCESS,
	SIGNUP_FAIL,
	ACTIVATION_FAIL,
	ACTIVATION_SUCCESS,
	LOGOUT,
} from "./types";

export const checkAuthenticated = () => async (dispatch) => {
	const url = "http://127.0.0.1:8000/auth/jwt/verify/";
	if (localStorage.getItem("access")) {
		console.log("hey there! I am authenticated");
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ token: localStorage.getItem("access") }),
		};

		console.log(options);

		try {
			console.log("I am in");
			let response = await fetch(url, options);
			console.log(response.status);

			if (response.status == 200) {
				dispatch({
					type: AUTHENTICATED_SUCCESS,
				});
			} else {
				dispatch({
					type: AUTHENTICATED_FAIL,
				});
			}
		} catch (err) {
			dispatch({
				type: AUTHENTICATED_FAIL,
			});
		}
	} else {
		dispatch({
			type: AUTHENTICATED_FAIL,
		});
	}
};

export const load_user = () => async (dispatch) => {
	if (localStorage.getItem("access")) {
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `JWT ${localStorage.getItem("access")}`,
				Accept: "application/json",
			},
		};

		try {
			const response = await fetch(
				`http://127.0.0.1:8000/auth/users/me/`,
				config
			);
			let result = await response.text();
			let res = JSON.parse(result);
			console.log(res);
			dispatch({
				type: USER_LOADED_SUCCESS,
				payload: res,
			});
		} catch (err) {
			dispatch({
				type: USER_LOADED_FAIL,
			});
		}
	} else {
		dispatch({
			type: USER_LOADED_FAIL,
		});
	}
};

export const login = (email, password) => async (dispatch) => {
	const url = "http://127.0.0.1:8000/auth/jwt/create/";

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	};

	console.log(email);
	try {
		console.log("hello1");
		let response = await fetch(url, options);
		let result = await response.text();
		let res = JSON.parse(result);
		console.log(res);
		if (res.detail != "No active account found with the given credentials") {
			document.getElementById("message").classList.add("success");
			document.getElementById("message").innerHTML = "Login Success";
			document.getElementById("message").hidden = false;
			setTimeout(() => {
				document.getElementById("message").hidden = true;
			}, 2500);
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res,
			});

			dispatch(load_user());
		} else {
			document.getElementById("message").classList.add("fail");
			document.getElementById("message").innerHTML = "Login Failed";
			document.getElementById("message").hidden = false;
			setTimeout(() => {
				document.getElementById("message").hidden = true;
			}, 2500);
			dispatch({
				type: LOGIN_FAIL,
			});
		}
	} catch (err) {
		dispatch({
			type: LOGIN_FAIL,
		});
	}
};

export const signup =
	(name, email, password, re_password, is_busowner) => async (dispatch) => {
		const url = "http://127.0.0.1:8000/auth/users/";

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email, password, re_password, is_busowner }),
		};

		try {
			let response = await fetch(url, options);
			let result = await response.text();
			let res = JSON.parse(result);
			console.log(res);
			if (response.status == 201) {
				document.getElementById("message").classList.add("success");
				document.getElementById("message").innerHTML =
					"Signup Success. Check your email to Verify your Account";
				document.getElementById("message").hidden = false;
				setTimeout(() => {
					document.getElementById("message").hidden = true;
				}, 1500);
				dispatch({
					type: SIGNUP_SUCCESS,
					payload: res,
				});
			} else {
				document.getElementById("message").classList.add("fail");
				document.getElementById("message").innerHTML =
					"Sign Up failed. Password too common or similar to the name/email or You Already have an account";
				document.getElementById("message").hidden = false;
				setTimeout(() => {
					document.getElementById("message").hidden = true;
				}, 4500);
				dispatch({
					type: SIGNUP_FAIL,
				});
			}
		} catch (err) {
			dispatch({
				type: SIGNUP_FAIL,
			});
		}
	};

export const verify = (uid, token) => async (dispatch) => {
	const url = "http://127.0.0.1:8000/auth/users/activation/";
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ uid, token }),
	};

	try {
		let response = await fetch(url, options);

		if (response.status == 204) {
			dispatch({
				type: ACTIVATION_SUCCESS,
			});
		} else {
			dispatch({
				type: ACTIVATION_FAIL,
			});
		}
	} catch (err) {
		dispatch({
			type: ACTIVATION_FAIL,
		});
	}
};

export const reset_password = (email) => async (dispatch) => {
	const url = "http://127.0.0.1:8000/auth/users/reset_password/";
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email }),
	};

	try {
		await fetch(url, options);
		dispatch({
			type: PASSWORD_RESET_SUCCESS,
		});
	} catch (err) {
		dispatch({
			type: PASSWORD_RESET_FAIL,
		});
	}
};

export const reset_password_confirm =
	(uid, token, new_password, re_new_password) => async (dispatch) => {
		const url = "http://127.0.0.1:8000/auth/users/reset_password_confirm/";
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ uid, token, new_password, re_new_password }),
		};

		try {
			let response = await fetch(url, options);

			if (response.status == 204) {
				dispatch({
					type: PASSWORD_RESET_CONFIRM_SUCCESS,
				});
			} else {
				dispatch({
					type: PASSWORD_RESET_CONFIRM_FAIL,
				});
			}
		} catch (err) {
			dispatch({
				type: PASSWORD_RESET_CONFIRM_FAIL,
			});
		}
	};

export const logout = () => (dispatch) => {
	dispatch({
		type: LOGOUT,
	});
};
