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

function AvailableSlots() {
	return (
		<div>
			{slots.map((slot, index) => {
				if (index % 3 !== 0) return <div></div>;
				return (
					<div
						key={index}
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "10px",
						}}>
						<Slot slot={slot} />
						{index + 1 < slots.length && <Slot slot={slots[index + 1]} />}
						{index + 2 < slots.length && <Slot slot={slots[index + 2]} />}
					</div>
				);
			})}
		</div>
	);
}

export default AvailableSlots;
