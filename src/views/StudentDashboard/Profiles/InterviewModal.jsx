import React, { useState, useEffect } from "react";
import axios from "../../../utils/_axios";
import InterviewPreview from "./InterviewPreview";
import InterviewScheduler from "./InterviewScheduler";

function InterviewModal(props) {
	const { interviewID, student, isModalOpen, handleOk, handleCancel } = props.props;
	const [interview, setInterview] = useState(null);
	const [isBookee, setIsBookee] = useState(false);
	const [chosenSlot, setChosenSlot] = useState(null);
	const [chosenDate, setChosenDate] = useState(null);

	useEffect(() => {
		axios
			.get(`/interview?id=${interviewID}`)
			.then((res) => {
				const interview = res.data;
				interview.interviewSlots.forEach((interview) => {
					setChosenDate((a) => a || interview.date);
					interview.timeSlots.forEach((slot) => {
						if (slot.applicant === student._id) {
							setIsBookee(true);
							setChosenSlot(slot);
							setChosenDate(interview.date);
						}
					});
				});
				setInterview(interview);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);
	return (
		<div>
			{isBookee && interview ? (
				<InterviewPreview
					props={{
						isModalOpen,
						handleOk,
						handleCancel,
						interview,
						chosenSlot,
						chosenDate,
					}}
				/>
			) : chosenDate ? (
				<InterviewScheduler
					props={{ isModalOpen, handleOk, handleCancel, interview, chosenDate }}
				/>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default InterviewModal;
