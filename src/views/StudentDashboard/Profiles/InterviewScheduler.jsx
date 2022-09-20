import React, { useState, useEffect } from "react";
import { Modal, Calendar } from "antd";
import AvailableSlots from "./AvailableSlots";
import moment from "moment";
import interviews from "../../../data/db.json";

function InterviewScheduler(props) {
	const { isModalOpen, handleOk, handleCancel, interviewID } = props.props;
	const [interview, setInterview] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedSlot, setSelectedSlot] = useState(null);

	useEffect(() => {
		setInterview(interviews[0]);
	}, []);

	const onPanelChange = (value, mode) => {
		console.log(value.format("YYYY-MM-DD"), mode);
	};

	const onSelect = (date) => {
		setSelectedDate(date.format("DDMMYYYY"));
	};

	const handleSubmit = () => {
		console.log(selectedDate, selectedSlot, interview.id);
	};

	return (
		<div>
			{interview === null || (
				<Modal
					title="Schedule your interview"
					visible={isModalOpen && interviewID === interview.id}
					onOk={(e) => {
						e.preventDefault();
						handleSubmit();
						handleOk();
					}}
					onCancel={handleCancel}>
					<Calendar
						fullscreen={false}
						onPanelChange={onPanelChange}
						onSelect={onSelect}
						validRange={[
							moment(interview.dateRange[0], "DDMMYYYY"),
							moment(interview.dateRange[1], "DDMMYYYY"),
						]}
						headerRender={() => null}
						defaultValue={moment("20221103", "YYYYMMDD")}
					/>
					{selectedDate && (
						<AvailableSlots
							props={{
								slots: interview.slots.filter((slot) => {
									return slot.date.slice(0, 2) === selectedDate.slice(0, 2);
								}),
								setSelectedSlot,
							}}
						/>
					)}
				</Modal>
			)}
		</div>
	);
}

export default InterviewScheduler;
