import React, { useEffect, useState } from "react";
import { Grid, List, Card, Button, Typography, Row, Col, Tag, Modal, Tooltip } from "antd";
import {
	ThunderboltOutlined,
	CheckOutlined,
	ClockCircleOutlined,
	TeamOutlined,
	UserOutlined,
	SmileOutlined,
	GlobalOutlined,
	PhoneOutlined,
	MailOutlined,
	FileDoneOutlined,
} from "@ant-design/icons";

import axios from "../../../utils/_axios";
import openAntdNotification from "../../../utils/openAntdNotification";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const ALL = "ALL";
const APPLIED = "APPLIED";
const SELECTED = "SELECTED";
// const REJECTED = "REJECTED";

const ProfileCards = ({ filter }) => {
	const screen = useBreakpoint();

	const [profiles, setProfiles] = useState([]);
	const [isFetching, setIsFetching] = useState(true);
	const { cvUploaded } = JSON.parse(localStorage.studentData || "{}");

	useEffect(() => {
		axios.get("/student/profiles").then((res) => {
			setProfiles(res.data.profiles);
			setIsFetching(false);
		});
	}, []);

	const isSelectedInAny = profiles.some(({ status }) => status === "SELECTED");
	const hasAppliedMoreThan2 = profiles.filter(({ status }) => status === "APPLIED").length >= 2;

	const showConfirmation = (profileID, profileTitle, startup) => {
		Modal.confirm({
			title: (
				<span>
					Confirm your application <SmileOutlined />
				</span>
			),
			icon: null,
			content: (
				<span>
					You are applying for <strong>{profileTitle}</strong> at{" "}
					<strong>{startup}</strong>. Your CV will be made accessible to the Startup.
					<br />
					<Text type="secondary">
						Note that once applied, you cannot revert your action.
					</Text>
				</span>
			),
			onOk: async () => {
				try {
					await axios.post("/student/apply/profile", { profileID });
					setProfiles((profiles) =>
						profiles.map((profile) =>
							profile._id !== profileID ? profile : { ...profile, status: "APPLIED" }
						)
					);
					openAntdNotification(
						"success",
						`Successfully applied to profile: ${profileTitle}, ${startup}`,
						<span>
							Keep an eye on the <strong>Selected</strong> tab!
						</span>
					);
				} catch (error) {
					openAntdNotification(
						"error",
						"An error occured in applying",
						error?.response?.data?.msg ?? error.message
					);
				}
			},
			centered: true,
		});
	};

	const showAlertToUploadCV = () => {
		Modal.info({
			title: "Please upload your CV",
			icon: <FileDoneOutlined />,
			content:
				"You need to upload your CV from the menu in order to apply to profiles by startups.",
			centered: true,
		});
	};

	const handleApply = (profileID, title, startup) => {
		if (cvUploaded) {
			showConfirmation(profileID, title, startup);
		} else {
			showAlertToUploadCV();
		}
	};

	const showPostDescriptionModal = (
		target,
		title,
		description,
		{ name, briefDescription, websiteURL, email, contact }
	) => {
		Modal.info({
			// Magic numbers: 200 and 500. Felt clever, might change later
			content: (
				<div
					style={{
						maxHeight: !screen.md ? window.innerHeight - 200 : 500,
						overflowY: "auto",
					}}>
					<Typography.Title level={5} type="secondary" style={{ margin: 0 }}>
						The Startup{" "}
					</Typography.Title>
					<Typography.Title level={3} style={{ marginTop: 0 }}>
						{name}{" "}
					</Typography.Title>
					<Typography.Text>{briefDescription} </Typography.Text>
					<Row style={{ margin: "1em 0 2em 0" }}>
						<Col span={8}>
							<PhoneOutlined /> Contact
							<br />
							{contact ?? "NA"}
						</Col>
						<Col span={8}>
							<MailOutlined /> Email
							<br />
							{email}
						</Col>
						{websiteURL && (
							<Col span={8}>
								<a href={websiteURL}>
									<GlobalOutlined /> Website
								</a>
							</Col>
						)}
					</Row>

					<Typography.Title level={5} type="secondary" style={{ marginBottom: 0 }}>
						The Profile
					</Typography.Title>
					<Typography.Title level={3} style={{ marginTop: 0 }}>
						{title}{" "}
					</Typography.Title>
					<Typography.Text>{description} </Typography.Text>
				</div>
			),
			icon: null,
			width: !screen.md ? window.innerWidth : 768,
			zIndex: 1010,
			okText: "Close",
			centered: true,
			maskClosable: true,
		});
	};
	const EmptyList = ({ filter }) => (
		<div style={{ textAlign: "center", marginTop: "3rem" }}>
			{filter === APPLIED ? (
				<>
					<SmileOutlined style={{ fontSize: "3rem" }} />
					<br />
					<Text type="secondary" strong>
						You have not applied for any profiles.
					</Text>
					<br />
					<Text type="secondary">
						Apply now from the <strong>All</strong> tab.
					</Text>
				</>
			) : filter === SELECTED ? (
				<>
					<TeamOutlined style={{ fontSize: "3rem" }} />
					<br />
					<Text type="secondary" strong>
						No selections yet.
					</Text>
					<br />
					<Text type="secondary"> Please check back later!</Text>
				</>
			) : (
				<>
					<ThunderboltOutlined style={{ fontSize: "3rem" }} />
					<br />
					<Text type="secondary" strong>
						No profiles found
					</Text>
					<br />
					<Text type="secondary">
						Keep an eye on the <strong>Selected</strong> tab
					</Text>
				</>
			)}
		</div>
	);

	return (
		<List
			size="large"
			itemLayout="horizontal"
			locale={{ emptyText: <EmptyList filter={filter} /> }}
			loading={isFetching}
			grid={{ gutter: 4, column: screen.xs ? 1 : 2 }}
			dataSource={profiles.filter(({ status }) =>
				filter === ALL ? true : filter === status
			)}
			renderItem={(profile) => (
				<List.Item style={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "0px" }}>
					<Card
						title={profile.title}
						actions={[
							<Button
								key={1}
								block
								type="link"
								onClick={(e) =>
									showPostDescriptionModal(
										e.target,
										profile.title,
										profile.description,
										profile.startupID
									)
								}>
								View Details
							</Button>,
							profile.status === SELECTED ? (
								<Text type="success" strong>
									<CheckOutlined /> Selected
								</Text>
							) : profile.status === APPLIED ? (
								<Text strong style={{ color: "#1890ff" }}>
									<CheckOutlined /> Applied
								</Text>
							) : (
								<Tooltip
									title={
										hasAppliedMoreThan2
											? "You cannot apply in more than two projects at once"
											: isSelectedInAny
											? "You are already selected in a project"
											: undefined
									}>
									<Button
										disabled={isSelectedInAny || hasAppliedMoreThan2}
										type="link"
										block
										onClick={() =>
											handleApply(
												profile._id,
												profile.title,
												profile.startupName
											)
										}>
										Apply
									</Button>
								</Tooltip>
							),
						]}>
						<Row justify="center">
							<Col xs={12} md={8} style={{ marginBottom: "1rem" }}>
								<UserOutlined /> <Text strong>Startup</Text>
								<br />
								<Text>{profile.startupName}</Text>
							</Col>
							<Col xs={12} md={8} style={{ marginBottom: "1rem" }}>
								<TeamOutlined /> <Text strong>Sector</Text>
								<br />
								<Text>{profile.startupID.startupSector}</Text>
							</Col>
							<Col flex="auto" style={{ marginBottom: "1rem" }}>
								<TeamOutlined /> <Text strong>Vacancy</Text>
								<br />
								<Text> {profile.vacancy} </Text>
							</Col>
							<Col
								xs={profile?.duration?.length > 30 ? 24 : 12}
								md={profile?.duration?.length > 30 ? 24 : 8}
								style={{ marginBottom: "1rem" }}>
								<ClockCircleOutlined /> <Text strong>Duration</Text>
								<br />
								<Text> {profile.duration} </Text>
							</Col>

							<Col
								xs={24}
								md={profile?.duration?.length > 30 ? 24 : 16}
								style={!screen.md && { marginBottom: "1rem" }}>
								<ThunderboltOutlined />{" "}
								<Typography.Text strong>Required Skills</Typography.Text>
								<br />
								{profile.skillsRequired.map((skill) => (
									<Tag
										style={{
											margin: "0.2rem 0 0 0.2rem",
											whiteSpace: "pre-wrap",
										}}
										key={skill}>
										{skill}
									</Tag>
								))}
							</Col>
						</Row>
					</Card>
				</List.Item>
			)}
		/>
	);
};

export default ProfileCards;
