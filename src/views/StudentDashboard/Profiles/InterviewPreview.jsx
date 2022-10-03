import React from "react";
import { Modal } from "antd";
import cleanTimeSlot from "../../../utils/cleanTimeSlot";
import cleanDateDisplay from "../../../utils/cleanDateDisplay";

function InterviewPreview(props) {
	const { isModalOpen, handleOk, handleCancel, interview, chosenSlot, chosenDate } = props.props;
	return (
		<Modal
			title="Your booking"
			visible={isModalOpen}
			handleOk={(e) => {
				e.preventDefault();
				handleOk();
				console.log(isModalOpen);
			}}
			handleCancel={handleCancel}>
			<div>
				<b>Meet Link: </b>
				<a href={interview.meetLink}>Join meet</a>
			</div>
			<div>
				<b>Time: </b>
				{cleanTimeSlot(chosenSlot)}
			</div>
			<div>
				<b>Date: </b>
				{cleanDateDisplay(chosenDate)}
			</div>
		</Modal>
	);
}

export default InterviewPreview;
