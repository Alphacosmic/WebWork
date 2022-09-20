import React from "react";
import { Button, Popover } from "antd";

function Slot(props) {
	const { slot, setSelectedSlot } = props.props;

	const occupantContact = <div>{slot.applicant?.email || "Vacant"}</div>;

	return (
		<div style={{ marginRight: "10px" }}>
			<Popover content={occupantContact}>
				<Button
					style={{
						borderRadius: "30px",
						color: slot.status === "BOOKED" ? "#a83240" : "#018711",
					}}
					disabled={slot.status === "BOOKED"}
					onClick={(e) => {
						e.preventDefault();
						setSelectedSlot(slot.timeRange);
					}}>
					{slot.timeRange}
				</Button>
			</Popover>
		</div>
	);
}

export default Slot;
