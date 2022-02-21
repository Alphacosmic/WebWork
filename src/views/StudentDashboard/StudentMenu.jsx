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

const degrees = {
	btech: "B. Tech",
	dualdegree: "Dual Degree",
};

const StudentMenu = () => {
	const studentData = JSON.parse(localStorage.studentData || "{}");

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
			<Row gutter={[0, 24]} justify="space-between" style={{ width: "100%" }}>
				<Col span={12}>
					<Text strong>Roll No.</Text>
					<br />
					<Text>{studentData.roll?.toUpperCase()}</Text>
				</Col>

				<Col span={12} style={{ textAlign: "right" }}>
					<Text strong>Year Of Study</Text>
					<br />
					<Text>{studentData.yearOfStudy}</Text>
				</Col>

				<Col span={12}>
					<Text strong>Branch</Text>
					<br />
					<Text>{branches[studentData.department]}</Text>
				</Col>
				<Col span={12} style={{ textAlign: "right" }}>
					<Text strong>Degree</Text>
					<br />
					<Text>{degrees[studentData.degree]}</Text>
				</Col>
				<Col span={12}>
					<Text strong>CGPA</Text>
					<br />
					<Text>{studentData.cgpa}</Text>
				</Col>

				<Col span={10} style={{ textAlign: "right" }}>
					<Text strong>Contact no.</Text>
					<br />
					<Text>{studentData.phone}</Text>
				</Col>

				<Col span={24}>
					<Text strong>Minor</Text>
					<br />
					<Text>{studentData.minor || "None"}</Text>
				</Col>
				<Col span={24}>
					<Text strong>IDDD</Text>
					<br />
					<Text>{studentData.iddd ? studentData.iddd : "None"}</Text>
				</Col>
			</Row>
			<Divider />
		</Row>
	);
};

export default StudentMenu;
