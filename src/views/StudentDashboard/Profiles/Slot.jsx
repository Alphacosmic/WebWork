import React, { useState, useEffect } from "react";
import { Button, Popover } from "antd";
import axios from "../../../utils/_axios";
import { VACANT } from "../../../utils/constants";

function Slot(props) {
	const { slot, setSelectedSlot } = props.props;
	const [applicantDetails, setApplicantDetails] = useState(null);

	useEffect(async () => {
		try {
			if (slot.status === VACANT) return;
			const { data: applicant } = await axios.get(`/studentByID?id=${slot.applicant}`);
			setApplicantDetails({ email: applicant.email, phoneNumber: applicant.phone });
		} catch (error) {
			console.error(error);
		}
	}, []);

	const occupantContact =
		slot.status === "BOOKED" && applicantDetails ? (
			<div>
				<div>
					<b>Email:</b> {applicantDetails.email}
				</div>
				<div>
					<b>Phone:</b> {applicantDetails.phoneNumber}
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
						setSelectedSlot(slot._id);
					}}>
					{slot.startTime}-{slot.endTime}
				</Button>
			</Popover>
		</div>
	);
}

export default Slot;
