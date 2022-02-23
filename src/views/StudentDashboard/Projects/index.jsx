import React, { useEffect, useState } from "react";
import { Grid, List, Card, Button, Typography, Row, Col, Modal, Radio, Tooltip } from "antd";
import {
	CompassOutlined,
	TeamOutlined,
	UserOutlined,
	DollarOutlined,
	SolutionOutlined,
	SmileOutlined,
	LinkOutlined,
} from "@ant-design/icons";
import openNotification from "../../../utils/openAntdNotification";

import axios from "../../../utils/_axios";
import PaymentPrompt from "../PaymentPrompt";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Projects = ({ student, updatePaymentInfo }) => {
	const paymentDone = student?.paymentDetails?.captured;

	const screen = useBreakpoint();

	const [projects, setProjects] = useState([]);
	const [isFetching, setIsFetching] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(0);
	const [isApplying, setIsApplying] = useState(false);
	const [selectedResume, setSelectedResume] = React.useState("");

	useEffect(() => {
		axios
			.get("/profiles")
			.then((res) => {
				setProjects(res.data);
				setIsFetching(false);
			})
			.finally(() => {
				setIsFetching(false);
			});
	}, []);

	const handleApply = async () => {
		try {
			setIsApplying(true);
			await axios.post("/applyToProfile", {
				profileId: selectedProfile._id,
				resumeURL: selectedResume,
			});
			openNotification("success", "Successfully Applied");
			setIsModalVisible(false);
		} catch (error) {
			console.log(error);
			const errorMsg = error.response ? error.response.data : error.message;
			openNotification("error", "Error in Applying", errorMsg);
		} finally {
			setIsApplying(false);
		}
	};

	const EmptyList = () => (
		<div style={{ textAlign: "center", marginTop: "3rem" }}>
			<SmileOutlined style={{ fontSize: "3rem" }} />
			<br />
			<Text type="secondary" strong>
				There are no new profiles currently.
			</Text>
			<br />
			<Text type="secondary">Please wait.</Text>
		</div>
	);

	return (
		<>
			<Modal
				footer={null}
				title={selectedProfile.title}
				visible={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
				}}>
				{student?.resumeURL?.length > 0 ? (
					<p>
						<strong>Select</strong> the previously uploaded resume that you want to send
						to the company
					</p>
				) : (
					<p>
						<strong>Upload</strong> a resume that you want to send to the company
					</p>
				)}
				<Col style={{ marginBottom: "1em" }}>
					{student?.resumeURL?.length > 0 ? (
						<Radio.Group
							onChange={(e) => {
								setSelectedResume(e.target.value);
							}}
							value={selectedResume}>
							{student?.resumeURL?.map((url, i) => (
								<>
									<Radio key={i} value={url}>
										Resume {i + 1}
										<Button type="link" href={url} target="_blank">
											<u>View</u> <LinkOutlined />
										</Button>
									</Radio>
								</>
							))}
						</Radio.Group>
					) : (
						""
					)}
				</Col>
				{student?.resumeURL?.length < 3 || !student?.resumeURL?.length
					? "or Upload a new resume from the sidebar"
					: ""}

				<Button
					disabled={!selectedResume}
					key={1}
					block
					style={{ marginTop: "1em" }}
					type="primary"
					loading={isApplying}
					onClick={handleApply}>
					Apply
				</Button>
			</Modal>
			{!paymentDone && !isFetching && <PaymentPrompt updatePaymentInfo={updatePaymentInfo} />}
			<List
				size="large"
				itemLayout="horizontal"
				style={{ marginTop: "1em" }}
				locale={{ emptyText: <EmptyList /> }}
				loading={isFetching}
				grid={{ column: screen.xs ? 1 : 2 }}
				dataSource={projects}
				renderItem={(profile) => (
					<List.Item
						style={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "0px" }}>
						<Card
							title={<b style={{ color: "#444" }}>{profile.title}</b>}
							actions={[
								<Button
									key={1}
									block
									type="link"
									onClick={() =>
										window.open(profile?.jobDescriptionURL, "_blank").focus()
									}>
									Open Job Description
								</Button>,
								<Tooltip
									key={2}
									title="You have not made the payment for E-Cell Internfair.">
									<Button
										type="link"
										block
										disabled={!paymentDone}
										onClick={() => {
											if (paymentDone) {
												setSelectedProfile(profile);
												setIsModalVisible(true);
											}
										}}>
										Apply
									</Button>
								</Tooltip>,
							]}>
							<Row justify="space-between">
								<Col span={24} style={{ marginBottom: "1rem" }}>
									<UserOutlined />
									<Text strong type="secondary">
										Company:{" "}
									</Text>

									<Typography.Text key={1}>
										{profile.company.name}
									</Typography.Text>
								</Col>
								<Col span={24}>
									<Row>
										<Col flex="auto" md={12} style={{ marginBottom: "1rem" }}>
											<TeamOutlined />
											<Text strong type="secondary">
												Sector
											</Text>
											<br />
											<Text>{profile.company.sector}</Text>
										</Col>
										<Col
											flex="auto"
											md={12}
											style={!screen.md && { marginBottom: "1rem" }}>
											<SolutionOutlined />
											<Typography.Text strong type="secondary">
												{" "}
												Field
											</Typography.Text>
											<br />

											{profile.type}
										</Col>
									</Row>
									<Row>
										<Col flex="auto" md={12} style={{ marginBottom: "1rem" }}>
											<DollarOutlined />
											<Text strong type="secondary">
												{" "}
												Stipend
											</Text>
											<br />
											<Text>
												{profile.stipend.amount > 0
													? profile.stipend.currency +
													  " " +
													  profile.stipend.amount +
													  " per month"
													: "Unpaid"}
											</Text>
										</Col>
										<Col flex="auto" md={12} style={{ marginBottom: "1rem" }}>
											<CompassOutlined />
											<Text strong type="secondary">
												{" "}
												Work Location
											</Text>
											<br />
											<Text>{profile.location}</Text>
										</Col>
									</Row>
								</Col>
							</Row>
						</Card>
					</List.Item>
				)}
			/>
		</>
	);
};

export default Projects;
