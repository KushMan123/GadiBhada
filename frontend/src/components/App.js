import React from "react";
import ReactDOM from "react-dom";
import Mappage from "./Mappage";
import { Provider } from "react-redux";
import store from "../store";

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Provider store={store}>
				<div>
					<Mappage />
				</div>
			</Provider>
		);
	}
}

export default App;

const appDiv = document.getElementById("app");
ReactDOM.render(<App />, appDiv);
