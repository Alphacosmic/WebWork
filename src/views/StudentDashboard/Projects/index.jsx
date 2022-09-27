import React, { useEffect, useState } from "react";
import {
	Grid,
	List,
	Card,
	Button,
	Typography,
	Row,
	Col,
	Modal,
	Radio,
	Tooltip,
	Popover,
} from "antd";
import {
	CompassOutlined,
	TeamOutlined,
	UserOutlined,
	DollarOutlined,
	SolutionOutlined,
	SmileOutlined,
	WarningOutlined,
	LinkOutlined,
	UsergroupAddOutlined,
	StarFilled,
} from "@ant-design/icons";
import openNotification from "../../../utils/openAntdNotification";
import PaymentPrompt from "../PaymentPrompt";
import axios from "../../../utils/_axios";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const AllProfiles = ({ student, updatePaymentInfo }) => {
	const paymentDone = student?.paymentDetails?.captured;

	const screen = useBreakpoint();

	const [projects, setProjects] = useState([]);
	const [isFetching, setIsFetching] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(0);
	const [isApplying, setIsApplying] = useState(false);
	const [selectedResume, setSelectedResume] = React.useState("");
	const [toolTipVisible, setToolTipVisible] = useState("");

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

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
			setProjects((old) => old.filter((item) => item._id !== selectedProfile._id));
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
								<div key={i}>
									<Radio value={url}>
										Resume {i + 1}
										<Button type="link" href={url} target="_blank">
											<u>View</u> <LinkOutlined />
										</Button>
									</Radio>
								</div>
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
			{/* {!paymentDone && !isFetching && (
				<div style={{ textAlign: "center" }}>
					<WarningOutlined style={{ fontSize: "3rem", marginBottom: "1rem" }} />
					<Title level={3} type="secondary" style={{ marginBottom: 0 }}>
						The payments for the InternFair 2022 have been closed
					</Title>
					<Title level={5} type="secondary" style={{ marginTop: 0 }}>
						You have not made the payment for E-Cell Internfair.
					</Title>
				</div>
			)} */}
			{!paymentDone && !isFetching && <PaymentPrompt updatePaymentInfo={updatePaymentInfo} />}
			<List
				size="large"
				itemLayout="horizontal"
				style={{ marginTop: "1em", width: screen.md ? "90vw" : "auto" }}
				locale={{ emptyText: <EmptyList /> }}
				loading={isFetching}
				grid={{ column: screen.xs ? 1 : 2 }}
				dataSource={projects}
				renderItem={(profile) => (
					<List.Item
						style={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "0px" }}>
						<Card
							title={
								<div style={{ display: "flex", justifyContent: "space-between" }}>
									<b style={{ color: "#444" }}>{profile.title}</b>
									{(profile.company.isFromIITMResearchPark ||
										/nirmaan/i.test(profile.company.incubatorName)) && (
										<Popover
											content={
												<div style={{ color: "gold" }}>Insti startup</div>
											}>
											<StarFilled style={{ color: "gold" }} />
										</Popover>
									)}
								</div>
							}
							actions={[
								<Button
									key={1}
									block
									type="link"
									onClick={() =>
										window.open(profile?.jobDescriptionURL, "_blank").focus()
									}
									icon={<LinkOutlined />}>
									View Job Description
								</Button>,
								<Tooltip
									visible={!paymentDone && toolTipVisible === profile?._id}
									key={2}
									mouseEnterDelay={0}
									mouseLeaveDelay={0}
									title="You have not made the payment for E-Cell Internfair.">
									<Button
										type="link"
										block
										disabled={!paymentDone}
										onMouseEnter={() => setToolTipVisible(profile._id)}
										onMouseLeave={() => setToolTipVisible("")}
										onClick={() => {
											if (paymentDone) {
												setSelectedProfile(profile);
												setIsModalVisible(true);
											}
										}}>
										Apply
									</Button>
								</Tooltip>,
							]}
							bodyStyle={{
								height: screen.xl ? "250px" : screen.lg ? "280px" : "300px",
							}}>
							<Row justify="space-between">
								<Col span={12} style={{ marginBottom: "1rem" }}>
									<UserOutlined />
									<Text strong type="secondary">
										Company
									</Text>
									<br />
									<Typography.Text key={1}>
										{profile.company.name}
									</Typography.Text>
								</Col>
								<Col span={12} style={{ marginBottom: "1rem" }}>
									<UsergroupAddOutlined />
									<Text strong type="secondary">
										Number of Applicants
									</Text>
									<br />
									<Typography.Text key={2}>
										{profile.applicants.length}
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
												<span>{profile.stipend?.currency}</span>{" "}
												{profile.stipend?.range?.length === 2 ? (
													<span>
														{numberWithCommas(
															profile.stipend?.range?.[0]
														)}{" "}
														-{" "}
														{numberWithCommas(
															profile.stipend?.range?.[1]
														)}{" "}
														<span style={{ opacity: "70%" }}>
															/month
														</span>
													</span>
												) : profile.stipend.amount ? (
													<>
														{profile.stipend?.amount}
														<span style={{ opacity: "70%" }}>
															{" "}
															/month
														</span>
													</>
												) : (
													"Unpaid"
												)}
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

export default AllProfiles;
