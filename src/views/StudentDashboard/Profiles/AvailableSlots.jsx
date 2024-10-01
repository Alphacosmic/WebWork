import React, { useContext } from "react";
import Slot from "./Slot";
import { Typography } from "antd";
import { ThemeContext } from "../../../utils/styles";

function AvailableSlots(props) {
	const { slots, selectedSlot, setSelectedSlot, editMode, student } = props.props;
	const { darkMode } = useContext(ThemeContext);

	return (
		<div>
			<div style={{ textAlign: "center" }}>
				<Typography.Text style={{ color: "#f5f5f7" }} type="primary" strong>
					Select your slot
				</Typography.Text>
			</div>
			{slots.length !== 0 ? (
				<div style={{ display: "grid", gridTemplateColumns: "auto auto auto" }}>
					{slots.map((slot, index) => (
						<div
							key={index}
							style={{
								marginTop: "10px",
							}}
						>
							<Slot
								props={{ slot, setSelectedSlot, selectedSlot, editMode, student }}
							/>
						</div>
					))}
				</div>
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
