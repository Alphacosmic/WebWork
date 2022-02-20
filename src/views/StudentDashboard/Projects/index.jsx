import React, { useEffect, useState } from "react";
import {
	Grid,
	List,
	Card,
	Button,
	Typography,
	Row,
	Col,
	Tag,
	Modal,
	Tooltip,
	Upload,
	Radio,
} from "antd";
import {
	ThunderboltOutlined,
	CheckOutlined,
	CompassOutlined,
	TeamOutlined,
	UserOutlined,
	DollarOutlined,
	SolutionOutlined,
	SmileOutlined,
	UploadOutlined,
	LinkOutlined,
} from "@ant-design/icons";
import openNotification from "../../../utils/openAntdNotification";

import Questions from "./QuestionsModal";
import axios from "../../../utils/_axios";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const ALL = "ALL";
const APPLIED = "APPLIED";
const SELECTED = "SELECTED";
// const REJECTED = "REJECTED";

const makeFormdata = async (policy, file) => {
	const fd = new FormData();

	fd.append("x-amz-algorithm", "AWS4-HMAC-SHA256");
	fd.append("acl", policy.bucketAcl);
	fd.append("policy", policy.encodedPolicy);
	fd.append("x-amz-credential", policy.amzCred);
	fd.append("x-amz-date", policy.expirationStrClean);
	fd.append("X-Amz-Signature", policy.sign);

	fd.append("key", file.name);
	fd.append("Content-Type", file.type);

	fd.append("file", file.file);

	return fd;
};
export const upload = async (file) => {
	const res = await axios.get("https://ecell.iitm.ac.in/data/s3-signed-policy/internfair");
	console.log(res.data);
	const S3SignedPolicyObject = { ...res.data };
	const bucketWriteUrl = `https://${S3SignedPolicyObject.bucket}.s3.ap-south-1.amazonaws.com`;

	const { name, roll } = JSON.parse(localStorage.studentData || "{}");
	const filename = `summer-2022/resumes/${name.replace(
		/ /g,
		""
	)}-${roll}-${Date.now()}-CV.${file.name.split(".").pop()}`;

	const fd = await makeFormdata(S3SignedPolicyObject, {
		name: filename,
		type: file.type,
		file,
	});

	await axios.post(bucketWriteUrl, fd, { withCredentials: false });
	const URL = `${bucketWriteUrl}/${filename}`;
	return URL;
};

const Projects = ({ filter = "none" }) => {
	const screen = useBreakpoint();
	const [projects, setProjects] = useState([]);
	const [isFetching, setIsFetching] = useState(true);
	const [questionModal, setQuestionModal] = useState({ visible: false, data: {} });
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedProfile, setselectedProfile] = useState(0);
	const [isCVUploading, setCVUploading] = useState(false);
	const [fileList, updateFileList] = useState([]);
	const [student, setStudent] = useState({});
	const [selectedResume, setselectedResume] = React.useState("");

	const onChange = (e) => {
		setselectedResume(e.target.value);
	};

	useEffect(() => {
		axios.get("/profiles").then((res) => {
			setProjects(res.data);
			setIsFetching(false);
		});
		axios.get("/getStudent").then((res) => {
			console.log(res.data);
			setStudent(res.data);
		});
	}, []);
	const isSelectedInAny = projects.some(({ status }) => status === "SELECTED");
	const hasAppliedMoreThan2 = projects.filter(({ status }) => status === "APPLIED").length >= 2;

	const showModal = () => {
		setIsModalVisible(true);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};
	const handleApply = async () => {
		try {
			await axios.post("/applyToProfile", {
				profileId: selectedProfile._id,
				resumeURL: selectedResume,
			});
			openNotification("success", "Successfully Applied");
			handleCancel();
		} catch (error) {
			const errorMsg = error.response ? error.response.data.msg : error.message;
			openNotification("error", "Already registered for this profile", errorMsg);
		}
	};

	const handleUpload = async () => {
		setCVUploading(true);
		const file = fileList[0].originFileObj;

		try {
			const resumeURL = await upload(file);

			await axios.put(`/resume`, { resumeURL });
			setStudent((old) => ({ ...old, resumeURL: [...old.resumeURL, resumeURL] }));
			setselectedResume(resumeURL);
			handleApply();
			openNotification("success", "Successfully Uploaded Resume");
			updateFileList([]);
		} catch (err) {
			console.log(err);
			const error = err.response ? err.response.data : err;
			const errorMsg = error.response ? error.response.data.msg : error.message;
			openNotification("error", "Error in uploading CV", errorMsg);
		} finally {
			setCVUploading(false);
		}
	};
	const uploadProps = {
		fileList,
		accept: "application/pdf",
		beforeUpload: (file) => {
			if (file.type !== "application/pdf") {
				openNotification(
					"error",
					"Please select a PDF file of size less than 8MB.",
					`${file.name} is not a PDF file`
				);
				return false;
			} else if (fileList.length === 1) {
				openNotification(
					"info",
					"You file was replaced with the newer one.",
					"File replaced."
				);
			}
			const isLt8M = file.size / 1024 / 1024 > 8;
			if (isLt8M) {
				openNotification("error", "The PDF file must be within 8MB.", "Size error");
			}
			return isLt8M;
		},
		onChange: (info) => {
			updateFileList(
				info.fileList.filter(
					(file, index) =>
						index === info.fileList.length - 1 &&
						file.type === "application/pdf" &&
						file.size / 1024 / 1024 < 8
				)
			);
		},
		multiple: false,
	};

	const EmptyList = ({ filter }) => (
		<div style={{ textAlign: "center", marginTop: "3rem" }}>
			{filter === APPLIED ? (
				<>
					<SmileOutlined style={{ fontSize: "3rem" }} />
					<br />
					<Text type="secondary" strong>
						You have not applied for any projects.
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
						No Projects found with the selected filters
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
		<>
			<Questions
				projectData={questionModal.data}
				isVisible={questionModal.visible}
				closeModal={() => setQuestionModal({ visible: false })}
			/>
			<Modal
				footer={null}
				title={selectedProfile.title}
				visible={isModalVisible}
				onCancel={handleCancel}>
				<p>Please Select/Upload the resume you want to send to the company</p>
				{student?.resumeURL?.length < 3 || !student?.resumeURL?.length ? (
					<Col span={24}>
						<Upload {...uploadProps}>
							<Button type="primary">Upload Resume</Button>
						</Upload>
						{fileList && fileList.length > 0 && (
							<Button onClick={handleUpload} loading={isCVUploading}>
								<span>
									<UploadOutlined /> Upload the Selected File and Apply
								</span>
							</Button>
						)}
					</Col>
				) : (
					""
				)}
				<Col style={{ marginTop: "1em" }}>
					{student?.resumeURL?.length > 0 ? (
						<Radio.Group onChange={onChange} value={selectedResume}>
							{student?.resumeURL?.map((url, i) => (
								<>
									<Radio key={i} value={url}>
										Resume {i + 1}{" "}
										<LinkOutlined
											onClick={() => window.open(url, "_blank").focus()}
										/>
									</Radio>
								</>
							))}
						</Radio.Group>
					) : (
						""
					)}
				</Col>

				<Button
					disabled={!selectedResume}
					key={1}
					block
					style={{ marginTop: "1em" }}
					type="primary"
					onClick={() => handleApply()}>
					Apply
				</Button>
			</Modal>
			<List
				size="large"
				itemLayout="horizontal"
				locale={{ emptyText: <EmptyList filter={filter} /> }}
				loading={isFetching}
				grid={{ column: screen.xs ? 1 : 2 }}
				dataSource={projects.filter(({ status }) =>
					filter === ALL ? true : filter === status
				)}
				renderItem={(project) => (
					<List.Item
						style={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "0px" }}>
						<Card
							title={<b style={{ color: "#444" }}>{project.title}</b>}
							actions={[
								<Button
									key={1}
									block
									type="link"
									onClick={() =>
										window.open(project?.jobDescriptionURL, "_blank").focus()
									}>
									Open Job Description
								</Button>,
								project.status === SELECTED ? (
									<Text type="success" strong>
										<CheckOutlined /> Selected
									</Text>
								) : project.status === APPLIED ? (
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
											onClick={() => {
												setselectedProfile(project);
												showModal();
											}}>
											Apply
										</Button>
									</Tooltip>
								),
							]}>
							<Row justify="space-between">
								<Col span={24} style={{ marginBottom: "1rem" }}>
									<UserOutlined />
									<Text strong type="secondary">
										Company :{" "}
									</Text>

									<Typography.Link
										href={`mailto:${project?.company?.email}`}
										key={1}>
										{project.company.name}
									</Typography.Link>
								</Col>
								<Col span={24}>
									<Row>
										<Col flex="auto" md={12} style={{ marginBottom: "1rem" }}>
											<TeamOutlined />
											<Text strong type="secondary">
												Sector
											</Text>
											<br />
											<Text>{project.company.sector}</Text>
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

											{project.type}
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
												{project.stipend.amount > 0
													? project.stipend.currency +
													  " " +
													  project.stipend.amount
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
											<Text>{project.location}</Text>
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
