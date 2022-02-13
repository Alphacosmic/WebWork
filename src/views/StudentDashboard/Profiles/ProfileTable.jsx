import React, { useEffect, useState } from "react";
import { Button, Typography, Tag, Table, Modal, Space, Grid, Row, Col, Tooltip } from "antd";
import {
	CheckOutlined,
	PhoneOutlined,
	MailOutlined,
	GlobalOutlined,
	TeamOutlined,
	ClockCircleOutlined,
	SmileOutlined,
	FileDoneOutlined,
} from "@ant-design/icons";

import openAntdNotification from "../../../utils/openAntdNotification";
import axios from "../../../utils/_axios";
const { Text } = Typography;

/**
 * @type { import("antd/lib/table/interface").ColumnsType }
 */

const columns = [
	{
		title: "Title",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "Startup",
		dataIndex: "startupName",
		key: "startupName",
		render: (name, { startupID: { email } }) => <a href={`mailto:${email}`}>{name}</a>,
		width: 150,
	},
	{
		title: "Sector",
		dataIndex: ["startupID", "startupSector"],
		key: "sector",
		width: 150,
	},
	{
		title: "Skills Required",
		dataIndex: "skillsRequired",
		key: "skillsRequired",
		render: (skills) =>
			skills.map((skill) => (
				<Tag style={{ margin: "0.2rem 0.2rem 0 0" }} key={skill}>
					{skill}
				</Tag>
			)),
	},
];

const ProfileTable = ({ filter }) => {
	const screen = Grid.useBreakpoint();
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

	const showPostDescriptionModal = (profile) => {
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
					<Typography.Text>{profile.startupID?.briefDescription} </Typography.Text>
					<Row style={{ margin: "1em 0 2em 0" }}>
						<Col span={8}>
							<PhoneOutlined /> Contact
							<br />
							{profile.startupID?.contact ?? "NA"}
						</Col>
						<Col span={8}>
							<MailOutlined /> Email
							<br />
							{profile.startupID?.email}
						</Col>
						{profile.startupID?.websiteURL && (
							<Col span={8}>
								<a href={profile.startupID?.websiteURL}>
									<GlobalOutlined /> Website
								</a>
							</Col>
						)}
					</Row>

					<Typography.Title level={5} type="secondary" style={{ marginBottom: 0 }}>
						The Profile
					</Typography.Title>
					<Typography.Title level={3} style={{ marginTop: 0 }}>
						{profile.title}{" "}
					</Typography.Title>
					<Typography.Text>{profile.description} </Typography.Text>
					<Row style={{ margin: "1em 0 2em 0" }}>
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
					</Row>
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

	return (
		<>
			<Table
				loading={isFetching}
				columns={[
					...columns,
					{
						title: "",
						dataIndex: "status",
						key: "status",
						align: "center",
						render: (status, profile) => (
							<>
								<Button
									type="link"
									onClick={() => {
										showPostDescriptionModal(profile);
									}}>
									View Details
								</Button>

								{status == "SELECTED" ? (
									<Text type="success" strong style={{ textAlign: "centers" }}>
										<CheckOutlined /> Selected
									</Text>
								) : status === "APPLIED" ? (
									<Text strong style={{ color: "#1890ff" }}>
										<CheckOutlined /> Applied
									</Text>
								) : (
									<Space>
										<Tooltip
											title={
												isSelectedInAny
													? "You are already selected in a profile"
													: undefined
											}>
											<Button
												disabled={isSelectedInAny}
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
									</Space>
								)}
							</>
						),
					},
				]}
				dataSource={profiles.filter(({ status }) =>
					filter === "ALL" ? true : status === filter
				)}
				rowKey={(row) => row._id}
				pagination={false}
				scroll={{ y: 500 }}
			/>
		</>
	);
};

export default ProfileTable;
