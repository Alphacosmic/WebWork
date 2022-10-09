import { Button, Card, Col, Row, Typography, Popconfirm } from "antd";
import React from "react";
const { Text } = Typography;
import { FieldTimeOutlined, BankOutlined, LinkOutlined, EditOutlined } from "@ant-design/icons";

const roundMap = {
	RESUME: "Resume Shortlisting",
	TEST: "Test",
	GROUP_DISCUSSION: "Group Discussion",
	INTERVIEW: "Interview",
	OFFER: "Offer Received",
};

function AppliedProfileCard({ profile, deregister }) {
	return (
		<Card title={<b style={{ color: "#444" }}>{profile.title}</b>}>
			<Row justify="space-between">
				<Col span={12} style={{ marginBottom: "1rem" }}>
					<BankOutlined />{" "}
					<Text strong type="secondary">
						Company{" "}
					</Text>{" "}
					<br />
					<Text>{profile.company.name}</Text>
				</Col>
				<Col span={12}>
					<EditOutlined />{" "}
					<Text strong type="secondary">
						Job Description{" "}
					</Text>{" "}
					<br />
					<Typography.Link href={profile.jobDescriptionURL}>
						Tap here <LinkOutlined />
					</Typography.Link>
				</Col>
				<Col span={12} style={{ marginBottom: "1rem" }}>
					<FieldTimeOutlined />{" "}
					<Text strong type="secondary">
						Your Current Round{" "}
					</Text>
					<br />
					<Text>
						<strong>{roundMap[profile.studentCurrentRound]}</strong>
					</Text>
				</Col>
				{/* <Col
					span={12}
					style={{
						display: "flex",
						marginBottom: "1rem",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Popconfirm
						title="Are you sure you want to deregister ?"
						onConfirm={() => deregister(profile._id)}
						okText="Yes"
						cancelText="No">
						<Button>Deregister</Button>
					</Popconfirm>
				</Col> */}
			</Row>
		</Card>
	);
}

export default AppliedProfileCard;
