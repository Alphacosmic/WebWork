import React, { useContext, useEffect, useState } from "react";
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
	ExportOutlined,
} from "@ant-design/icons";
import openNotification from "../../../utils/openAntdNotification";
import PaymentPrompt from "../PaymentPrompt";
import axios from "../../../utils/_axios";
import { dataSourceGenerator } from "../../../utils/dataSourceGenerator";
import blurredText from "../../../assets/blur_text.png";
import "./index.css";
const { useBreakpoint } = Grid;
const { Text } = Typography;

import { LightTextStyle, PrimaryText } from "../../../utils/constants"
import { ThemeContext } from "../../../utils/styles";



export const isApplicationClosed = false;

const AllProfiles = (props) => {
	const { student, updatePaymentInfo, statusFilter, statusSort, statusSortOrder, FieldFilter } =
		props.props;
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
	const filteredProjects1 = projects.filter((profile) => {
		let matchesField =
			FieldFilter.length === 0 || FieldFilter.includes(profile.type.toLowerCase());

		return matchesField;
	});
	const filteredProjects2 = filteredProjects1.filter((profile) => {
		if (statusFilter === "WFH") {
			return profile.location === "WFH";
		} else {
			return true;
		}
	});
	const { darkMode } = useContext(ThemeContext);

	return (
		<>
			<Modal
				footer={null}
				title={
					<strong style={darkMode ? { color: "#f5f5f7" } : {}}>
						{selectedProfile.title}
					</strong>
				}
				open={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
				}}
			>
				{student?.resumeURL?.length > 0 ? (
					<p style={LightTextStyle}>
						<strong>Select</strong> the previously uploaded resume that you want to send
						to the company
					</p>
				) : (
					<p style={LightTextStyle}>
						<strong>Upload</strong> a resume that you want to send to the company
					</p>
				)}
				<Col style={{ marginBottom: "1em" }}>
					{student?.resumeURL?.length > 0 ? (
						<Radio.Group
							onChange={(e) => {
								setSelectedResume(e.target.value);
							}}
							value={selectedResume}
						>
							{student?.resumeURL?.map((url, i) => (
								<div key={i}>
									<Radio value={url} style={LightTextStyle}>
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
				{student?.resumeURL?.length < 3 || !student?.resumeURL?.length ? (
					<span style={darkMode ? { color: "#d1d1d6" } : {}}>
						or Upload a new resume from the sidebar
					</span>
				) : (
					""
				)}
				{/* <Tooltip
					visible={isApplicationClosed}
					key={2}
					mouseEnterDelay={0}
					mouseLeaveDelay={0}
					title="The application window has been closed"> */}
				{/* <Popover content={<div>The application window has been closed</div>}> */}
				<Button
					disabled={!paymentDone || !selectedResume || isApplicationClosed}
					key={2}
					block
					style={{ marginTop: "1em" }}
					type="primary"
					loading={isApplying}
					onClick={handleApply}
				>
					Apply
				</Button>
				{/* </Popover> */}
				{/* </Tooltip> */}
			</Modal>
			{/* {!paymentDone && !isFetching && (
				<div style={{ textAlign: "center" }}>
					<WarningOutlined style={{ fontSize: "3rem", marginBottom: "1rem" }} />
					<Typography.Title level={3} type="secondary" style={{ marginBottom: 0 }}>
						The payments for the InternFair 2022 have been closed
					</Typography.Title>
					<Typography.Title level={5} type="secondary" style={{ marginTop: 0 }}>
						You have not made the payment for E-Cell Internfair.
					</Typography.Title>
				</div>
			)} */}
			{!paymentDone && !isFetching && student !== null && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
						marginTop: "1em",
						marginLeft: "-3rem",
					}}
				>
					<PaymentPrompt props={{ updatePaymentInfo, student }} />
				</div>
			)}
			<List
				size="large"
				itemLayout="horizontal"
				style={{ marginTop: "1em", width: screen.md ? "90vw" : "auto" }}
				locale={{ emptyText: <EmptyList /> }}
				loading={isFetching}
				grid={{ column: screen.xs ? 1 : 2 }}
				dataSource={dataSourceGenerator(filteredProjects2)}
				renderItem={(profile) => (
					<List.Item
						style={{
							paddingTop: "8px",
							paddingBottom: "8px",
							paddingLeft: "0px",
							marginBottom: "0px",
							marginTop: "0px	",
						}}
					>
						<Card
							className="ProfileCard"
							style={
								darkMode
									? {
											minHeight: "400px",
											background: "#2c2c2e",
											borderColor: "#3a3a3c",
									  }
									: {
											minHeight: "400px",
											borderColor: "#E1E1E1",
									  }
							}
							title={
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<b
										style={
											darkMode
												? {
														marginBottom: "0",
														color: "#ececec",
														fontSize: "1.5rem",
												  }
												: { marginBottom: "0", fontSize: "1.5rem" }
										}
									>
										{profile.title}
									</b>
									{(profile.company.isFromIITMResearchPark ||
										/nirmaan/i.test(profile.company.incubatorName)) && (
										<Popover content={<div>Institute based startup</div>}>
											<StarFilled
												style={
													darkMode
														? { color: "#cac9e7" }
														: { color: "#FFD700" }
												}
											/>
										</Popover>
									)}
								</div>
							}
						>
							<Row justify="space-between">
								<Col span={12} style={{ marginBottom: "1rem" }}>
									<UserOutlined style={darkMode ? { color: "#d1d1d6" } : {}} />
									<Text
										strong
										type="secondary"
										style={darkMode ? { color: "#d1d1d6" } : {}}
									>
										Company{" "}
									</Text>

									<br />
									<Typography.Text
										key={1}
										style={darkMode ? { color: "#f5f5f7" } : {}}
									>
										{profile.company.name}{" "}
										<a
											href={profile.company.websiteURL}
											target="_blank"
											rel="noreferrer"
										>
											<Popover content={<div>Company Website</div>}>
												<ExportOutlined />
											</Popover>
										</a>
									</Typography.Text>
								</Col>
								<Col span={12} style={{ marginBottom: "1rem" }}>
									<UsergroupAddOutlined
										style={darkMode ? { color: "#d1d1d6" } : {}}
									/>
									<Text
										strong
										type="secondary"
										style={darkMode ? { color: "#d1d1d6" } : {}}
									>
										Number of Applicants
									</Text>
									<br />
									<Typography.Text
										key={2}
										style={darkMode ? { color: "#f5f5f7" } : {}}
									>
										{paymentDone ? (
											profile.applicants.length
										) : (
											<Popover
												placement="top"
												content={
													<div
														style={darkMode ? { color: "#d1d1d6" } : {}}
													>
														Make the payment to view number of
														applicants
													</div>
												}
											>
												<img
													src={blurredText}
													alt="Locked"
													width="50rem"
													height="30rem"
												/>
											</Popover>
										)}
									</Typography.Text>
								</Col>
								<Col span={24}>
									<Row>
										<Col flex="auto" md={12} style={{ marginBottom: "1rem" }}>
											<TeamOutlined
												style={darkMode ? { color: "#d1d1d6" } : {}}
											/>
											<Text
												strong
												type="secondary"
												style={darkMode ? { color: "#d1d1d6" } : {}}
											>
												Sector
											</Text>
											<br />
											<Text style={darkMode ? { color: "#f5f5f7" } : {}}>
												{profile.company.sector}
											</Text>
										</Col>
										<Col
											flex="auto"
											md={12}
											style={!screen.md && { marginBottom: "1rem" }}
										>
											<SolutionOutlined
												style={darkMode ? { color: "#d1d1d6" } : {}}
											/>
											<Typography.Text
												strong
												type="secondary"
												style={darkMode ? { color: "#d1d1d6" } : {}}
											>
												{" "}
												Field
											</Typography.Text>
											<br />
											<Text style={darkMode ? { color: "#f5f5f7" } : {}}>
												{profile.type}
											</Text>
										</Col>
									</Row>
									<Row>
										<Col flex="auto" md={12} style={{ marginBottom: "1rem" }}>
											<DollarOutlined
												style={darkMode ? { color: "#d1d1d6" } : {}}
											/>
											<Text
												strong
												type="secondary"
												style={darkMode ? { color: "#d1d1d6" } : {}}
											>
												{" "}
												Stipend
											</Text>
											<br />
											<Text style={darkMode ? { color: "#f5f5f7" } : {}}>
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
										<Col flex="auto" md={12} style={{ marginBottom: "2rem" }}>
											<CompassOutlined
												style={darkMode ? { color: "#d1d1d6" } : {}}
											/>
											<Text
												strong
												type="secondary"
												style={darkMode ? { color: "#d1d1d6" } : {}}
											>
												{" "}
												Work Location
											</Text>
											<br />
											<Text style={darkMode ? { color: "#f5f5f7" } : {}}>
												{profile.location}
											</Text>
										</Col>
									</Row>
								</Col>
								<div
									className="button-group"
									style={{
										position: "absolute",
										bottom: "10px",
										right: "10px",
										display: "flex",
										gap: "10px",
									}}
								>
									<Button
										style={{
											borderRadius: "05rem",
											backgroundColor: "#007aff",
										}}
										type="primary"
										size="large"
										onClick={() =>
											window
												.open(profile?.jobDescriptionURL, "_blank")
												.focus()
										}
										icon={<LinkOutlined />}
									>
										Job Description
									</Button>
									<Button
										size="large"
										type="primary"
										shape="round"
										style={{ backgroundColor: "#007aff" }}
										disabled={!paymentDone || isApplicationClosed}
										onClick={() => {
											if (paymentDone) {
												setSelectedProfile(profile);
												setIsModalVisible(true);
											}
										}}
									>
										Apply Now
									</Button>
								</div>
							</Row>
						</Card>
					</List.Item>
				)}
			/>
		</>
	);
};

export default AllProfiles;
