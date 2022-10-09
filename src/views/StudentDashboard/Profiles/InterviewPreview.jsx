import React from "react";
import { Modal, Row, Col } from "antd";
import { EditFilled } from "@ant-design/icons";
import cleanTimeSlot from "../../../utils/cleanTimeSlot";
import cleanDateDisplay from "../../../utils/cleanDateDisplay";

function InterviewPreview(props) {
	const {
		isModalOpen,
		handleOk,
		handleCancel,
		interview,
		chosenSlot,
		chosenDate,
		setEditMode,
		setChosenDate,
	} = props.props;

	const handleEdit = () => {
		setChosenDate(chosenDate);
		setEditMode(true);
	};

	return (
		<Modal
			title="Your booking"
			visible={isModalOpen}
			onOk={handleOk}
			handleCancel={handleCancel}
			closable={false}
			cancelButtonProps={{ style: { display: "none" } }}>
			<Row style={{ display: "flex", justifyContent: "space-between" }}>
				<Col>
					<b>Meet Link: </b>
					<a href={interview.meetLink}>Join meet</a>
				</Col>
				<Col>
					<EditFilled
						style={{ border: "1px solid black", fontSize: "20px" }}
						onClick={(e) => {
							e.preventDefault();
							handleEdit();
						}}
					/>
				</Col>
			</Row>
			<Row>
				<b>Time: </b>
				{cleanTimeSlot(chosenSlot)}
			</Row>
			<Row>
				<b>Date: </b>
				{cleanDateDisplay(chosenDate)}
			</Row>
		</Modal>
	);
}

export default InterviewPreview;
