import React from "react";
import Slot from "./Slot";

const slots = [
	{
		startTime: "12:45",
		endTime: "13:15",
	},
	{
		startTime: "12:45",
		endTime: "13:15",
	},
	{
		startTime: "12:45",
		endTime: "13:15",
	},
	{
		startTime: "12:45",
		endTime: "13:15",
	},
	{
		startTime: "12:45",
		endTime: "13:15",
	},
	{
		startTime: "12:45",
		endTime: "13:15",
	},
	{
		startTime: "12:45",
		endTime: "13:15",
	},
];

function AvailableSlots(props) {
	const { slots, setSelectedSlot } = props.props;

	return (
		<div>
			{slots.map((slot, index) => {
				if (index % 3 !== 0) return <div></div>;
				return (
					<div
						key={index}
						style={{
							display: "flex",
							justifyContent: "center",
							marginTop: "10px",
						}}>
						<Slot props={{ slot, setSelectedSlot }} />
						{index + 1 < slots.length && (
							<Slot props={{ slot: slots[index + 1], setSelectedSlot }} />
						)}
						{index + 2 < slots.length && (
							<Slot props={{ slot: slots[index + 2], setSelectedSlot }} />
						)}
					</div>
				);
			})}
		</div>
	);
}

export default AvailableSlots;
