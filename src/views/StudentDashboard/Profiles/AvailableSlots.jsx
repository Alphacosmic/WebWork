import React from "react";
import { Button } from "antd";

function AvailableSlots() {
	return (
		<div style={{ display: "flex", justifyContent: "space-between" }}>
			<div>
				<Button>12:45 - 13:15</Button>
			</div>
			<div>
				<Button>13:30 - 14:00</Button>
			</div>
			<div>
				<Button>14:15 - 14:45</Button>
			</div>
		</div>
	);
}

export default AvailableSlots;
