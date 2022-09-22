import React, { useState, useEffect } from "react";
import { Modal, Calendar, Form } from "antd";
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
					<Form
						id="schedulingForm"
						initialValues={{ selectedDate: moment("20221103", "YYYYMMDD") }}>
						<Form.Item name="selectedDate">
							<Calendar
								fullscreen={false}
								onPanelChange={onPanelChange}
								onSelect={onSelect}
								validRange={[
									moment(interview.dateRange[0], "DDMMYYYY"),
									moment(interview.dateRange[1], "DDMMYYYY"),
								]}
								headerRender={() => null}
							/>
						</Form.Item>
						{selectedDate && (
							<Form.Item>
								<AvailableSlots
									props={{
										slots: interview.interviewSlots.filter((slot) => {
											return (
												slot.date.slice(0, 2) === selectedDate.slice(0, 2)
											);
										})[0].timeSlots,
										setSelectedSlot,
									}}
								/>
							</Form.Item>
						)}
					</Form>
				</Modal>
			)}
		</div>
	);
}

export default InterviewScheduler;
