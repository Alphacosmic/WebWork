import React, { useState, useEffect } from "react";
import { Modal, Calendar, Form } from "antd";
import AvailableSlots from "./AvailableSlots";
import moment from "moment";
import interviews from "../../../data/db.json";
import axios from "../../../utils/_axios";

function InterviewScheduler(props) {
	const [form] = Form.useForm();
	const { isModalOpen, handleOk, handleCancel, interviewID } = props.props;
	const [interview, setInterview] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [formValues, setFormValues] = useState({});

	useEffect(() => {
		axios
			.get("/interview")
			.then((res) => {
				const interviews = res.data;
				setInterview(interviews[0]);
				setSelectedDate(interviews[0].dateRange[0]);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				console.log("Fetch finished");
			});
		// setInterview(interviews[0]);
	}, []);

	useEffect(() => {
		console.log(formValues);
	}, [formValues]);

	useEffect(() => {
		console.log(interview);
	}, [interview]);

	const onPanelChange = (value, mode) => {
		console.log(value.format("YYYY-MM-DD"), mode);
	};

	const onSelect = (date) => {
		setSelectedDate(date.format("DDMMYYYY"));
	};

	const handleSubmit = () => {
		console.log(selectedDate, selectedSlot, interview.id);
		setFormValues((f) => {
			let temp = { ...f, ...form.getFieldsValue(), selectedSlot };
			return temp;
		});
		console.log(formValues);
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
					onCancel={handleCancel}>
					<Form
						form={form}
						id="schedulingForm"
						initialValues={{ selectedDate: moment("13102022", "DDMMYYYY") }}>
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
