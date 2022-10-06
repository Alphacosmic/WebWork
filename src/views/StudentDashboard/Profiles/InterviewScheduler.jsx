import React, { useState, useEffect } from "react";
import { Modal, Calendar, Form } from "antd";
import AvailableSlots from "./AvailableSlots";
import moment from "moment";
import axios from "../../../utils/_axios";

function InterviewScheduler(props) {
	const [form] = Form.useForm();
	const { isModalOpen, handleOk, handleCancel, interview, chosenDate } = props.props;
	const [selectedDate, setSelectedDate] = useState(chosenDate);
	const [selectedSlot, setSelectedSlot] = useState(null);

	const onPanelChange = (value, mode) => {
		console.log(value.format("YYYY-MM-DD"), mode);
	};

	const onSelect = (date) => {
		setSelectedDate(date.format("DDMMYYYY"));
	};

	const handleSubmit = async () => {
		console.log(selectedDate, selectedSlot, interview.id);
		try {
			await axios.post("/interview", {
				interviewID: interview._id,
				date: selectedDate,
				slotID: selectedSlot,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			{interview === null || (
				<Modal
					title="Schedule your interview"
					visible={isModalOpen}
					onOk={(e) => {
						e.preventDefault();
						handleSubmit();
						handleOk();
					}}
					onCancel={handleCancel}
					okButtonProps={{ disabled: !selectedSlot }}>
					<Form
						form={form}
						id="schedulingForm"
						initialValues={{ selectedDate: moment(chosenDate, "DDMMYYYY") }}>
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
							<AvailableSlots
								props={{
									slots: interview.interviewSlots.filter((slot) => {
										return slot.date.slice(0, 2) === selectedDate.slice(0, 2);
									})[0].timeSlots,
									setSelectedSlot,
									selectedSlot,
								}}
							/>
						)}
					</Form>
				</Modal>
			)}
		</div>
	);
}

export default InterviewScheduler;
