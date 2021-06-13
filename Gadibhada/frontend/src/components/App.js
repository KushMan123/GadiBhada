import React from "react";
import ReactDOM from "react-dom";
import Mappage from "./Mappage";

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Mappage />
			</div>
		);
	}
}

export default App;

const appDiv = document.getElementById("app");
ReactDOM.render(<App />, appDiv);
