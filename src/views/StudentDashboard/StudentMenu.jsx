import React from "react";
import { Button, Typography, Row, Col, Divider } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import { useLocation } from "wouter";
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

const programs = {
	btech: "B. Tech",
	phd: "Ph. D",
	msc: "M. Sc",
	mtech: "M. Tech",
	bsc: "B. Sc",
};

const StudentMenu = () => {
	const studentData = JSON.parse(localStorage.studentData || "{}");

	const [, setLocation] = useLocation();

	const handleLogout = async () => {
		try {
			await axios.get(`/logout`);
			localStorage.removeItem("studentData");
			setLocation("/login");
		} catch (err) {
			console.log(err);
			const error = err.response ? err.response.data : err;
			const errorMsg = error.response ? error.response.data.msg : error.message;
			openNotification("error", "Error in logging out", errorMsg);
		}
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
						<Text>{branches[studentData.branch]}</Text>
					</Col>
				)}
				<Col span={12} style={{ textAlign: "right" }}>
					<Text strong>Contact no.</Text>
					<br />
					<Text>{studentData.phone}</Text>
				</Col>
				<Col span={12} style={{ textAlign: "left" }}>
					<Text strong>Personal Email</Text>
					<br />
					<Text>{studentData.personalEmail}</Text>
				</Col>
				<Col span={12} style={{ textAlign: "right" }}>
					<Text strong>CGPA</Text>
					<br />
					<Text>{studentData.cgpa}</Text>
				</Col>

				<Col span={12}>
					<Text strong>Hostel Address</Text>
					<br />
					<Text>{studentData.address}</Text>
				</Col>

				<Col span={12} style={{ textAlign: "right" }}>
					<Text strong>Residential Pincode</Text>
					<br />
					<Text>{studentData.pincode}</Text>
				</Col>
				{studentData.minor && (
					<Col span={12}>
						<Text strong>Minor</Text>
						<br />
						<Text>{studentData.minor}</Text>
					</Col>
				)}
				{studentData.iddd && (
					<Col span={12} style={{ textAlign: "right" }}>
						<Text strong>IDDD</Text>
						<br />
						<Text>{studentData.iddd ? studentData.iddd : "None"}</Text>
					</Col>
				)}
			</Row>
			<Divider />
			<Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
				LOG OUT
			</Button>
		</Row>
	);
};

export default StudentMenu;
