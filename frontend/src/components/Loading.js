import React from "react";
import "../../static/css/loading.css";

const Loading = (props) => {
	return (
		<div className='loading-body'>
			<div className='loading loading--fullheight'>
				<div className='loading-text'>{props.LoadingText}</div>
			</div>
		</div>
	);
};

export default Loading;
