import React, { useState } from "react";
import { Modal, Calendar, Form } from "antd";
import AvailableSlots from "./AvailableSlots";
import moment from "moment";
import axios from "../../../utils/_axios";
import openNotification from "../../../utils/openAntdNotification";

function InterviewScheduler(props) {
	const [form] = Form.useForm();
	const {
		isModalOpen,
		handleOk,
		handleCancel,
		interview,
		chosenDate,
		editMode,
		student,
		chosenSlot,
	} = props.props;
	const [selectedDate, setSelectedDate] = useState(chosenDate);
	const [selectedSlot, setSelectedSlot] = useState(editMode ? chosenSlot : null);

	const onPanelChange = (value, mode) => {
		console.log(value.format("YYYY-MM-DD"), mode);
	};

	const onSelect = (date) => {
		setSelectedDate(date.format("DDMMYYYY"));
	};

	const handleSubmit = async () => {
		try {
			await axios.post("/interview", {
				interviewID: interview._id,
				date: selectedDate,
				slotID: selectedSlot,
				editMode,
			});
			openNotification("success", "Successfully booked your interview");
		} catch (error) {
			console.error(error);
			openNotification(
				"error",
				"There was an error in booking your interview",
				error.message
			);
		}
	};

	return (
		<div>
			{interview === null || (
				<Modal
					title="Schedule your interview"
					visible={isModalOpen || editMode}
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
									slots:
										interview.interviewSlots.filter((slot) => {
											return (
												slot.date.slice(0, 2) === selectedDate.slice(0, 2)
											);
										})[0]?.timeSlots || [],
									setSelectedSlot,
									selectedSlot,
									editMode,
									student,
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
