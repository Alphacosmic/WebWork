import React, { useState, useEffect } from "react";
import { Button, Popover } from "antd";
import axios from "../../../utils/_axios";
import { BOOKED, VACANT } from "../../../utils/constants";
import cleanTimeSlot from "../../../utils/cleanTimeSlot";
import { ThemeContext } from "../../../utils/styles";
function Slot(props) {
	const { slot, selectedSlot, setSelectedSlot, editMode, student } = props.props;
	const [applicantDetails, setApplicantDetails] = useState(null);

	useEffect(() => {
		try {
			if (slot.status === VACANT) return;
			axios.get(`/studentByID?id=${slot.applicant}`).then((res) => {
				const applicant = res.data;
				setApplicantDetails({ email: applicant.email, phoneNumber: applicant.phone });
			});
		} catch (error) {
			console.error(error);
		}
	}, [slot]);

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
			<Popover
				content={
					applicantDetails &&
					student.email === applicantDetails.email &&
					slot.status === BOOKED ? (
						<div>Your current slot</div>
					) : (
						occupantContact
					)
				}
			>
				<Button
					style={{
						borderRadius: "30px",
						color:
							applicantDetails &&
							student.email === applicantDetails.email &&
							slot.status === BOOKED
								? "#5192ed"
								: slot.status === BOOKED
								? "#a83240"
								: slot._id === selectedSlot
								? "gold"
								: "#018711",
					}}
					disabled={slot.status === BOOKED}
					onClick={(e) => {
						e.preventDefault();
						setSelectedSlot(slot._id);
					}}
				>
					{cleanTimeSlot(slot)}
				</Button>
			</Popover>
		</div>
	);
}

export default Slot;
