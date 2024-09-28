import { Button, Card, Col, Row, Typography } from "antd";
import React, { useContext } from "react";
import { useState } from "react";
const { Text } = Typography;
import InterviewModal from "./InterviewModal";
import {
	FieldTimeOutlined,
	BankOutlined,
	LinkOutlined,
	EditOutlined,
	CalendarOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "../../../utils/styles";

const roundMap = {
	RESUME: "Resume Shortlisting",
	TEST: "Test",
	GROUP_DISCUSSION: "Group Discussion",
	INTERVIEW: "Interview",
	OFFER: "Offer Received",
};

function AppliedProfileCard({ profile, student }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [interviewID, setInterviewID] = useState(null);
	const darkCardStyle = {
		color: "#f5f5f7",
		border: "1px solid #444",
		borderRadius: "1.5rem",
		backgroundColor: "#3a3a3c",
	};
	const lightModeStyle = {
		border: "1px solid #444",
		borderRadius: "1.5rem",
	};

	const textColor = {
		color: "#f5f5f7",
	};
	const secondaryTextColor = {
		color: "#d1d1d6",
	};

	const cardWrapperStyle = {
		marginBottom: "20px",
	};
	const { darkMode } = useContext(ThemeContext);

	return (
		<>
			<div style={cardWrapperStyle}>
				<Card
					title={<b style={darkMode ? textColor : {}}>{profile.title}</b>}
					style={darkMode ? darkCardStyle : lightModeStyle}
				>
					<Row justify="space-between">
						<Col span={12} style={{ marginBottom: "1.5rem" }}>
							<BankOutlined
								style={darkMode ? { color: "#d1d1d6" } : { color: "black" }}
							/>{" "}
							<Text strong style={darkMode ? secondaryTextColor : ""}>
								Company{" "}
							</Text>{" "}
							<br />
							<Text style={darkMode ? textColor : ""}>{profile.company.name}</Text>
						</Col>
						<Col span={12} style={{ marginBottom: "1.5rem" }}>
							<EditOutlined
								style={darkMode ? { color: "#d1d1d6" } : { color: "black" }}
							/>{" "}
							<Text strong style={darkMode ? secondaryTextColor : ""}>
								Job Description{" "}
							</Text>{" "}
							<br />
							<Typography.Link href={profile.jobDescriptionURL}>
								Tap here <LinkOutlined />
							</Typography.Link>
						</Col>
						<Col span={12} style={{ marginBottom: "1.5rem" }}>
							<FieldTimeOutlined />{" "}
							<Text
								strong
								style={darkMode ? { color: "#d1d1d6" } : { color: "black" }}
							>
								Your Current Round{" "}
							</Text>
							<br />
							<Text style={darkMode ? { color: "#f5f5f7" } : { color: "black" }}>
								<strong>{roundMap[profile.studentCurrentRound]}</strong>
							</Text>
							{/* Button for opening interview modal */}
						</Col>
					</Row>
				</Card>
			</div>
		</>
	);
}

export default AppliedProfileCard;
