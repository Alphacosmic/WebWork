import React from "react";
import { Button } from "antd";

function Slot({ slot }) {
	return (
		<div>
			<Button style={{ borderRadius: "30px" }}>
				{slot.startTime}-{slot.endTime}
			</Button>
		</div>
	);
}

export default Slot;
