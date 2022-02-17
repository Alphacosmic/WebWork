import React, { useEffect, useState } from "react";
import { Grid, List, Card, Button, Typography, Row, Col, Tag, Modal, Tooltip, Table } from "antd";
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
const ROUNDS = ["RESUME", "TEST", "GROUP_DISCUSSION", "INTERVIEW", "OFFER"];

const ProfileCards = ({ filter }) => {
	const screen = useBreakpoint();

	const [profiles, setProfiles] = useState([]);
	const [isFetching, setIsFetching] = useState(true);
	const { cvUploaded } = JSON.parse(localStorage.studentData || "{}");

	useEffect(() => {
		axios.get("/profiles").then((res) => {
			console.log(res.data);
			const formattedData = res.data.appliedProfiles.map((item) => ({
				...item._id,
				[item.round]: "yes",
				...ROUNDS.reduce((p, c) => (c == item.round ? { ...p } : { ...p, [c]: "no" }), {}),
			}));
			console.log(formattedData);
			setProfiles(formattedData);
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

	const columns = [
		{
			title: "Company Name",
			dataIndex: ["company", "name"],
			// specify the condition of filtering result
			// here is that finding the name started with `value`
			onFilter: (value, record) => record.name.indexOf(value) === 0,
			sorter: (a, b) => a.name.length - b.name.length,
			sortDirections: ["descend"],
		},
		{
			title: "Stipend",
			dataIndex: "stipend",
			defaultSortOrder: "descend",
			sorter: (a, b) => a.stipend.amount - b.stipend.amount,
		},
		{
			title: "Profile Name",
			dataIndex: "title",

			filters: [
				{
					text: "IT",
					value: "IT",
				},
				{
					text: "Core",
					value: "Core",
				},
			],
			onFilter: (value, record) => record.name.indexOf(value) === 0,
		},
		{
			title: "RESUME",
			dataIndex: "RESUME",
			filters: [
				{
					text: "Yes",
					value: "yes",
				},
				{
					text: "No",
					value: "no",
				},
			],
			onFilter: (value, record) => record.RESUME.indexOf(value) === 0,
		},
		{
			title: "TEST",
			dataIndex: "TEST",
			filters: [
				{
					text: "Yes",
					value: "yes",
				},
				{
					text: "No",
					value: "no",
				},
			],
			onFilter: (value, record) => record.TEST.indexOf(value) === 0,
		},
		{
			title: "GROUP_DISCUSSION",
			dataIndex: "GROUP_DISCUSSION",
			filters: [
				{
					text: "Yes",
					value: "yes",
				},
				{
					text: "No",
					value: "no",
				},
			],
			onFilter: (value, record) => record.GROUP_DISCUSSION.indexOf(value) === 0,
		},
		{
			title: "INTERVIEW",
			dataIndex: "INTERVIEW",
			filters: [
				{
					text: "Yes",
					value: "yes",
				},
				{
					text: "No",
					value: "no",
				},
			],
			onFilter: (value, record) => record.INTERVIEW.indexOf(value) === 0,
		},
		{
			title: "OFFER",
			dataIndex: "OFFER",
			filters: [
				{
					text: "Yes",
					value: "yes",
				},
				{
					text: "No",
					value: "no",
				},
			],
			onFilter: (value, record) => record.OFFER.indexOf(value) === 0,
		},
	];

	const data = [
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
		},
		{
			key: "2",
			name: "Jim Green",
			age: 42,
			address: "London No. 1 Lake Park",
		},
		{
			key: "3",
			name: "Joe Black",
			age: 32,
			address: "Sidney No. 1 Lake Park",
		},
		{
			key: "4",
			name: "Jim Red",
			age: 32,
			address: "London No. 2 Lake Park",
		},
	];

	function onChange(pagination, filters, sorter, extra) {
		console.log("params", pagination, filters, sorter, extra);
	}

	return <Table columns={columns} dataSource={data} onChange={onChange} />;
};

export default ProfileCards;
