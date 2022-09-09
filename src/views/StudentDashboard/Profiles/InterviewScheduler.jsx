import React from "react";
import { Modal, Calendar } from "antd";
import AvailableSlots from "./AvailableSlots";
import moment from "moment";

function InterviewScheduler(props) {
	const { isModalOpen, handleOk, handleCancel } = props.props;

	const onPanelChange = (value, mode) => {
		console.log(value.format("YYYY-MM-DD"), mode);
	};

	const onSelect = (date) => {
		console.log("Reaching");
		console.log(date);
	};

	return (
		<div>
			<Modal
				title="Schedule your interview"
				visible={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}>
				<Calendar
					fullscreen={false}
					onPanelChange={onPanelChange}
					onSelect={onSelect}
					validRange={[moment("20221103", "YYYYMMDD"), moment("20221107", "YYYYMMDD")]}
					headerRender={() => null}
				/>
				<AvailableSlots />
			</Modal>
		</div>
	);
}

export default InterviewScheduler;
