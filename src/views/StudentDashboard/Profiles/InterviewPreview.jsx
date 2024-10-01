import React, { useContext } from "react";
import { Modal, Row, Col } from "antd";
import { EditFilled } from "@ant-design/icons";
import cleanTimeSlot from "../../../utils/cleanTimeSlot";
import cleanDateDisplay from "../../../utils/cleanDateDisplay";
import { ThemeContext } from "../../../utils/styles";

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
	const { darkMode } = useContext(ThemeContext);
	const textStyles = darkMode ? { color: "#f5f5f7" } : {};
	const linkStyles = darkMode ? { color: "#4d90fe" } : { color: "#1890ff" };

	return (
		<Modal
			title={<strong style={textStyles}>Your booking</strong>}
			open={isModalOpen}
			onOk={handleOk}
			handleCancel={handleCancel}
			closable={false}
			styles={{
				content: { backgroundColor: darkMode ? "#2c2c2e" : "" },
				body: {
					maxHeight: 600,
					overflowY: "scroll",
					backgroundColor: darkMode ? "#2c2c2e" : "#fff",
					color: darkMode ? "#d1d1d6" : "#000",
					padding: 0,
					margin: 0,
				},
				header: { background: darkMode ? "#2c2c2e" : "" },
			}}
			cancelButtonProps={{ style: { display: "none" } }}
		>
			<Row style={{ display: "flex", justifyContent: "space-between" }}>
				<Col>
					<b style={textStyles}>Meet Link: </b>
					<a href={interview.meetLink} style={linkStyles}>
						Join meet
					</a>
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
				<b style={darkMode ? { color: "#f5f5f7" } : {}}>Time: </b>
				{cleanTimeSlot(chosenSlot)}
			</Row>
			<Row>
				<b style={darkMode ? { color: "#f5f5f7" } : {}}>Date: </b>
				{cleanDateDisplay(chosenDate)}
			</Row>
		</Modal>
	);
}

export default InterviewPreview;
