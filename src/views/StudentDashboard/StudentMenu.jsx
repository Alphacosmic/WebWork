import React, { useState } from "react";
import { Button, Typography, Row, Col, Divider, Upload } from "antd";
import { UploadOutlined, FilePdfOutlined, LinkOutlined } from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import axios from "../../utils/_axios";

const { Title, Text } = Typography;

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

const ordinals = ["st", "nd", "rd"];
const transformYear = (year) => `${year}${ordinals[year - 1]} year`;

const StudentMenu = ({ student, updateResume }) => {
	const [fileList, setFileList] = useState();
	const [resumeUploading, setResumeUploading] = useState(false);
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

	return (
		<Row justify="center">
			<Col span={24} style={{ paddingTop: "2em", textAlign: "center" }}>
				<Title level={3} style={{ marginBottom: "0.25rem", width: "100%" }}>
					{student.name}
				</Title>
			</Col>
			<Col span={24} style={{ textAlign: "center" }}>
				<Title level={5} type="secondary" style={{ marginTop: "0", marginBottom: 0 }}>
					{student.roll?.toUpperCase()}
				</Title>
			</Col>
			<Col span={24} style={{ textAlign: "center", marginBottom: "1em" }}>
				<Text level={6} type="secondary" style={{ marginTop: "0" }}>
					{degrees[student.degree] +
						" " +
						transformYear(student.yearOfStudy) +
						", " +
						branches[student.department]}
				</Text>
			</Col>
			<Row gutter={[0, 24]} justify="space-between" style={{ width: "100%" }}>
				<Col span={12}>
					<Text strong>CGPA</Text>
					<br />
					<Text>{student.cgpa}</Text>
				</Col>

				<Col span={12} style={{ textAlign: "right" }}>
					<Text strong>Contact no.</Text>
					<br />
					<Text>{student.phone}</Text>
				</Col>

				<Col span={student.minor ? 12 : 24}>
					<Text strong>Minor</Text>
					<br />
					<Text>{student.minor || "None"}</Text>
				</Col>
				<Col span={!student.iddd || student.iddd === "None" ? 12 : 24}>
					<Text strong>IDDD</Text>
					<br />
					<Text>{student.iddd || "None"}</Text>
				</Col>
				<Col>
					<Text strong>For issues, contact </Text>
					<br />
					<Text>{student.allottedSSManager.name}: </Text>
					<Text style={{ color: "#1890ff" }}>{student.allottedSSManager.phone}</Text>
				</Col>
				<Divider style={{ marginTop: 0, marginBottom: 0 }} />
				<Col span={24}>
					<div style={{ textAlign: "center" }}>
						<Title level={3} style={{ margin: 0 }}>
							Your Resumes
						</Title>
						{student?.resumeURL?.length > 0 ? (
							student?.resumeURL?.map((url, i) => (
								<div key={i} style={{ marginBottom: "1em" }}>
									Resume {i + 1}
									<Button type="link" href={url} target="_blank">
										<u>View</u> <LinkOutlined />
									</Button>
								</div>
							))
						) : (
							<div style={{ paddingBottom: "1em" }}>
								<Text type="secondary">
									{student?.paymentDetails?.captured
										? "You have not uploaded any resumes."
										: "Proceed with the payment to upload resumes"}
								</Text>
							</div>
						)}
						{student?.paymentDetails?.captured && student?.resumeURL?.length < 3 && (
							<>
								<Upload {...uploadProps}>
									<Button>
										<span>
											<FilePdfOutlined /> Select Resume to Upload
										</span>
									</Button>
									<div style={{ textAlign: "center" }}>
										<Typography.Text type="secondary">
											PDF file less than 8MB. You can upload upto 3 resumes.
										</Typography.Text>
									</div>
								</Upload>
								{fileList && fileList.length > 0 && (
									<Button onClick={handleUpload} loading={resumeUploading}>
										<span>
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
	);
};

export default StudentMenu;
