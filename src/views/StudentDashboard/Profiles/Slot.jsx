import React from "react";
import { Button } from "antd";

function Slot(props) {
	const { slot, setSelectedSlot } = props.props;
	return (
		<div style={{ marginRight: "10px" }}>
			<Button
				style={{ borderRadius: "30px" }}
				onClick={(e) => {
					e.preventDefault();
					setSelectedSlot(slot.timeRange);
				}}>
				{slot.timeRange}
			</Button>
		</div>
	);
}

export default Slot;
