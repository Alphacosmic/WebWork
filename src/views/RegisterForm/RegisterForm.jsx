import React, { useState } from "react";
import { Form, Row, Col, Input, Button, Typography, Layout, Card, Select, Checkbox } from "antd";
import {
	NumberOutlined,
	PhoneOutlined,
	KeyOutlined,
	CompassOutlined,
	BookOutlined,
	AuditOutlined,
	MailOutlined,
} from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import "./RegisterForm.css";

import AuthHeader from "../../common/AuthHeader";
import { Link, useLocation } from "wouter";
import logo from "../../assets/startup-internfair_logo.png";

import axios from "../../utils/_axios";

const { Option } = Select;
const { Content } = Layout;

const idddList = [
	"None",
	"Advanced Materials and Nanotechnology",
	"Automotive Engineering",
	"Bio-Medical Engineering",
	"Complex Systems and Dynamics",
	"Computational Engineering",
	"Cyber Physical Systems",
	"Data Science",
	"Electric Vehicles",
	"Energy Systems",
	"Quantum Science & Technology",
	"Robotics",
	"Tech MBA",
];

const preferredLocations = [
	{
		label: "Work from home",
		value: "WFH",
	},
	{
		label: "In person",
		value: "IN_PERSON",
	},
];

const RegisterForm = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [isTNCAccepted, setIsTNCAccepted] = useState(false);

	const [, setLocation] = useLocation();

	const handleSuccess = () => {
		setLocation("/dashboard");
	};

	const onFinish = async () => {
		try {
			setLoading(true);
			const values = await form.validateFields();
			const res = await axios.post("/register", values);
			localStorage.setItem("studentData", JSON.stringify(res.data));

			handleSuccess();
		} catch (error) {
			openNotification("error", "Error occured in posting form data.", error.response.data);
			setLoading(false);
		}
	};

	return (
		<>
			<AuthHeader />
			<Content className="register-form-container">
				<img
					src={logo}
					alt="TeamUp Logo"
					style={{
						maxWidth: 150,
						alignSelf: "center",
						margin: "0 0 0.5em 0",
						padding: "0.5rem",
					}}
				/>
				{/* {screen.xs && (
					<Alert
						type="warning"
						banner
						message={
							<span>
								The portal has <strong> stopped </strong> accepting new payments.
							</span>
						}
						style={{ borderRadius: "1rem", width: "90%" }}
					/>
				)} */}
				<Card
					className="loginCard"
					title={<strong>Register</strong>}
					// extra={
					// 	screen.lg && (
					// 		<Alert
					// 			type="warning"
					// 			banner
					// 			message={
					// 				<span>
					// 					The portal has <strong> stopped </strong> accepting new
					// 					payments.
					// 				</span>
					// 			}
					// 			style={{ borderRadius: "1rem" }}
					// 		/>
					// 	)
					// }
				>
					<Form
						form={form}
						name="register"
						size="large"
						layout="vertical"
						validateTrigger="onSubmit"
						onFinish={onFinish}>
						<Row gutter={12}>
							<Col xs={12} md={8}>
								<Form.Item
									style={{ marginBottom: 0 }}
									name="roll"
									label={
										<span>
											<NumberOutlined /> LDAP Roll No.
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please enter your Roll No.",
										},
										{
											pattern: /^[a-z]{2}\d{2}[a-z]\d{3}$/i,
											message: "Invalid roll",
											transform: (val) => (!val ? "" : val.trim()),
										},
									]}>
									<Input />
								</Form.Item>
							</Col>

							<Col xs={12} md={8}>
								<Form.Item
									style={{ marginBottom: 0 }}
									name="password"
									rules={[
										{
											required: true,
											message: "Please input your password.",
										},
										{
											min: 6,
											message: "Please input at least 6 characters.",
										},
									]}
									label={
										<span>
											<KeyOutlined /> LDAP Password
										</span>
									}>
									<Input.Password />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									style={{ marginBottom: 0 }}
									name="cgpa"
									validateFirst={true}
									label={
										<span>
											<BookOutlined /> CGPA
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please input your CGPA!",
										},
									]}>
									<Input />
								</Form.Item>
							</Col>
							<Col style={{ marginBottom: "0.5em" }}>
								<Typography.Text type="secondary">
									We do not store your LDAP password. We only check if you&apos;re
									an IITM student by authenticating you against institute records.
								</Typography.Text>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									name="phone"
									validateFirst={true}
									label={
										<span>
											<PhoneOutlined /> Phone number
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please input your phone number!",
										},
										{
											pattern: /^[0-9]{10}$/,
											message: "Please enter a valid phone number.",
										},
									]}>
									<Input prefix="+91" />
								</Form.Item>
							</Col>
							<Col xs={24} md={16}>
								<Form.Item
									name="personalEmail"
									validateFirst={true}
									label={
										<span>
											<MailOutlined /> Personal Mail
										</span>
									}
									rules={[
										{
											required: true,
											type: "email",
											message: "Please input your Personal mail!",
										},
									]}>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="iddd"
									label={
										<span>
											<AuditOutlined /> IDDD
										</span>
									}
									rules={[
										{
											required: false,
										},
									]}>
									<Select placeholder="None" allowClear>
										{idddList.map((value, i) => (
											<Option key={i} value={value}>
												{value}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="minor"
									label={
										<span>
											<AuditOutlined /> Minor
										</span>
									}
									rules={[
										{
											required: false,
										},
									]}>
									<Input placeholder="None" />
								</Form.Item>
							</Col>

							<Col xs={24} md={8}>
								<Form.Item
									name="pinCode"
									validateFirst={true}
									label={
										<span>
											<CompassOutlined /> Residential Pincode
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please input your Pincode!",
										},
										{
											pattern: /^[0-9]{6}$/,
											message: "Please enter a PIN Code.",
										},
									]}>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} md={16}>
								<Form.Item
									name="address"
									validateFirst={true}
									label={
										<span>
											<CompassOutlined /> Hostel Address
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please input your Hostel Address!",
										},
									]}>
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Form.Item
									name="preferredLocation"
									label={<span>Preferred location</span>}
									rules={[
										{
											required: true,
										},
									]}>
									<Select placeholder="None" options={preferredLocations} />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col>
								<Checkbox
									onChange={() => {
										setIsTNCAccepted(!isTNCAccepted);
									}}>
									I agree to the{" "}
									<a
										href="https://drive.google.com/file/d/1q5WXJrOBQkWPkHpVWXQ5f5UHRyCNnnxu/view"
										target="_blank"
										rel="noreferrer">
										terms and conditions
									</a>
								</Checkbox>
							</Col>
						</Row>
						<Row align="bottom">
							<Col span={16}>
								<Typography.Title level={5} style={{ margin: "0px" }}>
									Already have an account? <Link to="/login">Log In</Link>
								</Typography.Title>
							</Col>
							<Col span={8} style={{ textAlign: "right" }}>
								<Form.Item style={{ marginBottom: "0px" }}>
									<Button
										type="primary"
										size="large"
										htmlType="submit"
										disabled={!isTNCAccepted}
										loading={loading}>
										Register
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Card>
			</Content>
		</>
	);
};

export default RegisterForm;
