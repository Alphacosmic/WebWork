import React from "react";
import Slot from "./Slot";
import { Typography } from "antd";

function AvailableSlots(props) {
	const { slots, setSelectedSlot } = props.props;

	return (
		<div>
			{slots.length !== 0 ? (
				slots.map((slot, index) => {
					if (index % 3 !== 0) return <div key={index}></div>;
					return (
						<div
							key={index}
							style={{
								display: "flex",
								justifyContent:
									index + 2 < slots.length ? "space-between" : "start",
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
				})
			) : (
				<div style={{ textAlign: "center" }}>
					<Typography.Text type="secondary" strong>
						No slots available
					</Typography.Text>
				</div>
			)}
		</div>
	);
}

export default AvailableSlots;
