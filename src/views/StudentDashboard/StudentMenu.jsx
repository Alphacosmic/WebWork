import React, { useState, useContext } from "react";
import { Button, Typography, Row, Col, Divider, Upload, Select, Form, Input } from "antd";
import { UploadOutlined, FilePdfOutlined, LinkOutlined, EditOutlined } from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import axios from "../../utils/_axios";
import { skillTags, maxSkillTags, LightTextStyle } from "../../utils/constants";
import "./StudentMenu.css";
import { isApplicationClosed } from "./Projects";
const { Option } = Select;
const { Title, Text } = Typography;
import { ThemeContext } from "../../utils/styles";
import { ThemeProvider } from "@emotion/react";
import { InfoOutlined } from "@mui/icons-material";
const branches = {
	ae: "Aerospace Engineering",
	am: "Engineering Mechanics",
	be: "Biological Engineering",
	bs: "Biological Sciences",
	ca: "Chemical Engineering",
	ce: "Civil Engineering",
	ch: "Chemical Engineering",
	cs: "Computer Science and Engineering",
	cy: "Chemistry",
	ed: "Engineering Design",
	ee: "Electrical Engineering",
	ep: "Engineering Physics",
	hs: "Humanities and Social Sciences",
	ma: "Mathematics",
	me: "Mechanical Engineering",
	mm: "Metallurgical and Materials Engineering",
	ms: "Management Studies",
	na: "Naval Architecture",
	oe: "Ocean Engineering",
	ph: "Physics",
};

const degrees = {
	btech: "B. Tech",
	dualdegree: "Dual Degree",
	ma: "Masters",
};

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
	const S3SignedPolicyObject = { ...res.data };
	const bucketWriteUrl = `https://${S3SignedPolicyObject.bucket}.s3.ap-south-1.amazonaws.com`;

	const { name, roll } = JSON.parse(localStorage.studentData || "{}");
	// file name is for winters
	const filename = `winter-2022/resumes/${name.replace(
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

const ordinals = ["st", "nd", "rd", "th"];
const transformYear = (year) => `${year}${ordinals[year - 1]} year`;

const StudentMenu = ({ student, updateResume, updateSkillTags }) => {
	const [form] = Form.useForm();
	const [numform] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [fileList, setFileList] = useState();
	const [viewSkillUpdate, setViewSkillUpdate] = useState(false);
	const [viewNumUpdate, setviewNumUpdate] = useState(false);
	const [resumeUploading, setResumeUploading] = useState(false);
	const [numb, setNumb] = useState(student.phone);
	const handleUpload = async () => {
		setResumeUploading(true);
		const file = fileList[0].originFileObj;

		try {
			const resumeURL = await upload(file);

			await axios.put(`/resume`, { resumeURL });
			openNotification("success", "Successfully Uploaded Resume");
			updateResume(resumeURL);
			setFileList([]);
			return resumeURL;
		} catch (err) {
			console.log(err);
			const error = err.response ? err.response.data : err;
			const errorMsg = error.response ? error.response.data.msg : error.message;
			openNotification("error", "Error in uploading CV", errorMsg);
		} finally {
			setResumeUploading(false);
		}
	};
	const toggleNumUpdate = () => {
		viewNumUpdate ? setviewNumUpdate(false) : setviewNumUpdate(true);
		numform.resetFields();
	};
	const toggleSkillUpdate = () => {
		viewSkillUpdate ? setViewSkillUpdate(false) : setViewSkillUpdate(true);
		form.resetFields();
	};

	const handleSkillTagChange = (skillValues) => {
		if (skillValues.length > maxSkillTags) {
			skillValues.pop();
		}
	};

	const onFinish = async () => {
		try {
			setLoading(true);
			const values = await form.validateFields();
			const newSkillTags = values.skillTags;
			await axios.put(`/skill-tags`, { newSkillTags });
			updateSkillTags(newSkillTags);
			setLoading(false);
			toggleSkillUpdate();
			openNotification("success", "Successfully Updated Skills");
		} catch (error) {
			openNotification("error", "Error occured in posting form data.", error.response.data);
			setLoading(false);
		}
	};
	const HandleNumChange = async () => {
		try {
			setLoading(true);
			const values = await numform.validateFields();
			const newnum = values.newnum;
			await axios.put(`/update-number`, { newnum });
			setNumb(newnum);
			setLoading(false);
			toggleNumUpdate();
			openNotification("success", "Successfully Updated Number");
		} catch (error) {
			openNotification("error", "Error occured in posting form data.", error.response.data);
			setLoading(false);
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
			setFileList(
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

	const { darkMode } = useContext(ThemeContext);
	return (
		<div
			style={
				darkMode
					? {
							width: "100%",
							maxWidth: "100%",
							height: "100%",
							padding: "0",
							background: "#333333",
					  }
					: {}
			}
		>
			<Row justify="center" style={{ margin: "2rem", marginTop: "0.5rem" }}>
				<Col span={24} style={{ textAlign: "center" }}>
					<Title
						level={3}
						style={
							darkMode
								? { marginBottom: "0.25rem", width: "100%", color: "#f5f5f7" }
								: { marginBottom: "0.25rem", width: "100%" }
						}
					>
						{student.name}
					</Title>
				</Col>

				<Col span={24} style={{ textAlign: "center" }}>
					<Title
						level={5}
						type="secondary"
						style={darkMode ? { width: "100%", color: "#f5f5f7" } : { width: "100%" }}
					>
						{student.roll?.toUpperCase()}
					</Title>
				</Col>
				<Col span={24} style={{ textAlign: "center", marginBottom: "1em" }}>
					<Text
						level={6}
						type="secondary"
						style={darkMode ? { marginTop: "0", color: "#d1d1d6" } : { marginTop: "0" }}
					>
						{degrees[student.degree] +
							" " +
							transformYear(student.yearOfStudy) +
							", " +
							branches[student.department]}
					</Text>
				</Col>
				<Row gutter={[0, 24]} justify="space-between" style={{ width: "100%" }}>
					<Col span={12}>
						<Text strong style={darkMode ? { color: "#f5f5f7" } : ""}>
							CGPA
						</Text>
						<br />
						<Text style={darkMode ? { color: "#d1d1d6" } : ""}>
							{student.cgpa ? student.cgpa : "N/A"}
						</Text>
					</Col>

					<Col span={12} style={{ textAlign: "right" }}>
						<Text strong style={darkMode ? { color: "#f5f5f7" } : ""}>
							Contact no.
						</Text>
						{viewNumUpdate ? (
							<></>
						) : (
							<Button
								style={{ width: "max-content", margin: "none" }}
								onClick={toggleNumUpdate}
								disabled={isApplicationClosed}
								icon={<EditOutlined />}
								type="link"
							></Button>
						)}
						<br />
						{viewNumUpdate ? (
							<Form form={numform} onFinish={HandleNumChange}>
								<Form.Item
									name="newnum"
									style={{ marginBottom: "5px" }}
									rules={[
										{
											required: true,
											message: "Please enter your phone number!",
										},
										{
											pattern: /^[0-9]+$/,
											message: "Please enter a valid phone number!",
										},
									]}
								>
									<Input placeholder={student.phone} />
								</Form.Item>
								<div style={{ display: "flex", gap: "10px" }}>
									<Button type="primary" htmlType="submit" loading={loading}>
										Done
									</Button>
									<Button onClick={toggleNumUpdate}>Cancel</Button>
								</div>
							</Form>
						) : (
							<Text style={darkMode ? { color: "#d1d1d6" } : ""}>{numb}</Text>
						)}
					</Col>

					<Col span={student.minor ? 12 : 24}>
						<Text strong style={darkMode ? { color: "#f5f5f7" } : ""}>
							Minor
						</Text>
						<br />
						<Text style={darkMode ? { color: "#d1d1d6" } : ""}>
							{student.minor || "None"}
						</Text>
					</Col>
					<Col span={24}>
						<Text strong style={darkMode ? { color: "#f5f5f7" } : ""}>
							Skills{" "}
						</Text>
						{viewSkillUpdate ? (
							<></>
						) : (
							<Button
								style={{ width: "max-content", margin: "none" }}
								onClick={toggleSkillUpdate}
								disabled={isApplicationClosed}
								icon={<EditOutlined />}
								type="link"
							></Button>
						)}
						<br />
						{viewSkillUpdate ? (
							<Form form={form} onFinish={onFinish}>
								<Form.Item name="skillTags" style={{ marginBottom: "5px" }}>
									<Select
										disabled={isApplicationClosed}
										mode="multiple"
										allowClear
										placeholder={`Maximum ${maxSkillTags} skills`}
										onChange={handleSkillTagChange}
									>
										{skillTags.map((value, i) => (
											<Option key={i} value={value}>
												{value}
											</Option>
										))}
									</Select>
								</Form.Item>
								<Button type="primary" htmlType="submit" loading={loading}>
									Done
								</Button>
								<Button onClick={toggleSkillUpdate}>Cancel</Button>
							</Form>
						) : (
							<Text style={darkMode ? { color: "#d1d1d6" } : ""}>
								{student.skillTags ? student.skillTags.join(", ") : "Not Selected"}
							</Text>
						)}
					</Col>

					<Col span={!student.iddd || student.iddd === "None" ? 12 : 24}>
						<Text strong style={darkMode ? { color: "#f5f5f7" } : ""}>
							IDDD
						</Text>
						<br />
						<Text style={darkMode ? { color: "#d1d1d6" } : ""}>
							{student.iddd || "None"}
						</Text>
					</Col>
					<Col>
						<Text strong style={darkMode ? { color: "#f5f5f7" } : ""}>
							For issues, contact{" "}
						</Text>
						<br />
						<Text style={darkMode ? { color: "#d1d1d6" } : ""}>
							{student.allottedSSManager.name}:{" "}
						</Text>
						<Text style={darkMode ? { color: "#1890ff" } : ""}>
							{student.allottedSSManager.phone}
						</Text>
					</Col>
					<Divider style={{ marginTop: 0, marginBottom: 0, backgroundColor: "grey" }} />
					<Col span={24}>
						<div style={{ textAlign: "center" }}>
							<Title
								level={3}
								style={
									darkMode ? { margin: "0", color: "#f5f5f7" } : { margin: "0" }
								}
							>
								Your Resumes
							</Title>
							{student?.resumeURL?.length > 0 ? (
								student?.resumeURL?.map((url, i) => (
									<div
										key={i}
										style={
											darkMode
												? { marginBottom: "1rem", color: "#d1d1d6" }
												: { marginBottom: "1rem" }
										}
									>
										Resume {i + 1}
										<Button type="link" href={url} target="_blank">
											<u>View</u> <LinkOutlined />
										</Button>
									</div>
								))
							) : (
								<div style={{ paddingBottom: "1em" }}>
									<Text
										type="secondary"
										style={darkMode ? { color: "#d1d1d6" } : ""}
									>
										{student?.paymentDetails?.captured
											? "You have not uploaded any resumes."
											: "Proceed with the payment to upload resumes"}
									</Text>
								</div>
							)}
							{student?.paymentDetails?.captured && student?.resumeURL?.length < 3 && (
								<>
									<Upload {...uploadProps}>
										<Button
											type="primary"
											size="large"
											shape="round"
											style={{ marginBottom: "0.75rem" }}
										>
											<span>
												<FilePdfOutlined /> Select Resume to Upload
											</span>
										</Button>
										<div style={{ textAlign: "center" }}>
											<Typography.Text
												type="secondary"
												style={darkMode ? { color: "#d2d2d6" } : ""}
											>
												PDF file less than 8MB. You can upload upto 3
												resumes.
											</Typography.Text>
										</div>
									</Upload>
									{fileList && fileList.length > 0 && (
										<Button onClick={handleUpload} loading={resumeUploading}>
											<span style={darkMode ? { color: "#d1d1d6" } : ""}>
												<UploadOutlined /> Upload the selected file
											</span>
										</Button>
									)}
								</>
							)}
						</div>
					</Col>
				</Row>
				<Divider />
			</Row>
		</div>
	);
};

export default StudentMenu;
