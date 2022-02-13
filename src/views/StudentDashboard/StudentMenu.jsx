import React, { useState } from "react";
import { Upload, Button, Typography, Row, Col, Divider } from "antd";
import {
	UploadOutlined,
	FilePdfOutlined,
	LogoutOutlined,
	CheckCircleTwoTone,
} from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import { useLocation } from "wouter";
import axios from "../../utils/_axios";

const { Title, Text, Link } = Typography;

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
	const res = await axios.get("/s3-signed-policy/teamup-student-cvs");

	const S3SignedPolicyObject = { ...res.data.data };
	const bucketWriteUrl = `https://${S3SignedPolicyObject.bucket}.s3.ap-south-1.amazonaws.com/`;

	const { name, roll } = JSON.parse(localStorage.studentData || "{}");
	const filename = `${name.replace(/ /g, "")}-${roll}-CV.${file.name.split(".").pop()}`;

	const fd = await makeFormdata(S3SignedPolicyObject, {
		name: filename,
		type: file.type,
		file,
	});

	await axios.post(bucketWriteUrl, fd, { withCredentials: false });
	const URL = `${bucketWriteUrl}${filename}`;
	return URL;
};

const StudentMenu = () => {
	const [fileList, updateFileList] = useState([]);
	const studentData = JSON.parse(localStorage.studentData || "{}");

	const [, setLocation] = useLocation();

	const [isCVUploading, setCVUploading] = useState(false);

	const handleLogout = async () => {
		try {
			await axios.get(`/logout/student`);
			localStorage.removeItem("studentData");
			setLocation("/login");
		} catch (err) {
			console.log(err);
			const error = err.response ? err.response.data : err;
			const errorMsg = error.response ? error.response.data.msg : error.message;
			openNotification("error", "Error in logging out", errorMsg);
		}
	};

	const handleUpload = async () => {
		setCVUploading(true);
		const file = fileList[0].originFileObj;

		try {
			const cvURL = await upload(file);

			await axios.put(`/student/cv`, { studentID: studentData._id, cvURL });
			openNotification("success", "Successfully Updated CV");
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
	return (
		<Row justify="center">
			<Col span={24} style={{ paddingTop: "2em", textAlign: "center" }}>
				<Title level={3} style={{ marginBottom: "0.25rem", width: "100%" }}>
					{studentData.name}
				</Title>
			</Col>
			<Col span={24} style={{ textAlign: "center" }}>
				<Title level={5} type="secondary" style={{ marginTop: "0" }}>
					{studentData.email}
				</Title>
			</Col>
			<Row justify="space-between" style={{ width: "100%" }}>
				<Col span={12} style={{ marginBottom: "1rem" }}>
					<Text strong>Roll No.</Text>
					<br />
					<Text>{studentData.roll}</Text>
				</Col>
				{studentData.yearOfStudy && (
					<Col span={12} style={{ marginBottom: "1rem", textAlign: "right" }}>
						<Text strong>Year Of Study</Text>
						<br />
						<Text>{studentData.yearOfStudy}</Text>
					</Col>
				)}
				{studentData.branch && (
					<Col span={12}>
						<Text strong>Branch</Text>
						<br />
						<Text>{studentData.branch}</Text>
					</Col>
				)}
				<Col span={12} style={{ textAlign: "right" }}>
					<Text strong>Contact no.</Text>
					<br />
					<Text>{studentData.phone}</Text>
				</Col>
			</Row>
			<Divider />
			<>
				{studentData.cvUploaded ? (
					<Row style={{ textAlign: "center" }}>
						<Col span={24}>
							<Text type="success" strong>
								CV is uploaded.
							</Text>
							<CheckCircleTwoTone twoToneColor="#52c41a" />
							<Link
								href={studentData.cvURL}
								target="_blank"
								style={{ marginLeft: "1em" }}>
								View your CV
							</Link>
						</Col>
						<Col span={24} style={{ paddingTop: "1em" }}>
							<Upload {...uploadProps}>
								<Button type="primary">Update CV</Button>
							</Upload>
							{fileList && fileList.length > 0 && (
								<Button onClick={handleUpload} loading={isCVUploading}>
									<span>
										<UploadOutlined /> Upload the selected file
									</span>
								</Button>
							)}
						</Col>
					</Row>
				) : (
					<div style={{ textAlign: "center" }}>
						<Upload {...uploadProps}>
							<Button>
								<span>
									<FilePdfOutlined /> Select CV to upload
								</span>
							</Button>
							<div style={{ textAlign: "center" }}>
								<Typography.Text type="secondary">
									PDF file less than 8MB.
								</Typography.Text>
							</div>
						</Upload>
						{fileList && fileList.length > 0 && (
							<Button onClick={handleUpload} loading={isCVUploading}>
								<span>
									<UploadOutlined /> Upload the selected file
								</span>
							</Button>
						)}
					</div>
				)}
			</>
			<Divider />
			<Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
				LOG OUT
			</Button>
		</Row>
	);
};

export default StudentMenu;
