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
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		axios
			.get(`/interview?id=${interviewID}`)
			.then((res) => {
				const interview = res.data;
				interview.interviewSlots.forEach((interview) => {
					setChosenDate((a) =>
						a || interview.date.length === 8 ? interview.date : "0" + interview.date
					);
					interview.timeSlots.forEach((slot) => {
						if (slot.applicant === student._id) {
							setIsBookee(true);
							setChosenSlot(slot);
							setChosenDate(
								interview.date.length === 8 ? interview.date : "0" + interview.date
							);
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
			{isBookee && interview && !editMode ? (
				<InterviewPreview
					props={{
						isModalOpen,
						handleOk,
						handleCancel,
						interview,
						chosenSlot,
						chosenDate,
						setEditMode,
						setChosenDate,
					}}
				/>
			) : (chosenDate || (editMode && chosenSlot)) && interview ? (
				<InterviewScheduler
					props={{
						isModalOpen,
						handleOk,
						handleCancel,
						interview,
						chosenDate,
						editMode,
						student,
						chosenSlot,
					}}
				/>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default InterviewModal;
