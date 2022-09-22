import React from "react";
import { Button, Popover } from "antd";

function Slot(props) {
	const { slot, setSelectedSlot } = props.props;

	const occupantContact =
		slot.status === "BOOKED" ? (
			<div>
				<div>
					<b>Email:</b> {slot.applicant.email}
				</div>
				<div>
					<b>Phone:</b> {slot.applicant.phoneNumber}
				</div>
			</div>
		) : (
			<div>
				<b>Vacant</b>
			</div>
		);

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
					{slot.startTime + slot.endTime}
				</Button>
			</Popover>
		</div>
	);
}

export default Slot;
