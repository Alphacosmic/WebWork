import React, { useContext, useState } from "react";
import { Modal, Calendar, Form, ConfigProvider } from "antd";
import AvailableSlots from "./AvailableSlots";
import moment from "moment";
import axios from "../../../utils/_axios";
import openNotification from "../../../utils/openAntdNotification";
import { ThemeContext } from "../../../utils/styles";
import "./InterviewScheduler.css";

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
					closable={false}
					title={<span>Schedule your interview</span>}
					open={isModalOpen || editMode}
					onOk={(e) => {
						e.preventDefault();
						handleSubmit();
						handleOk();
					}}
					cancelButtonProps={{ size: "large", shape: "round" }}
					onCancel={handleCancel}
					okButtonProps={{
						disabled: !selectedSlot,
						type: "primary",
						size: "large",
						shape: "round",
					}}
				>
					<Form
						form={form}
						id="schedulingForm"
						initialValues={{ selectedDate: moment(chosenDate, "DDMMYYYY") }}
					>
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
								style={{
									// Outer calendar container
									borderRadius: "12px", // Rounded corners for both modes
									overflow: "hidden", // Ensure content respects rounded corners
									boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Shadow for better visual effect
								}}
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
