import React, { useContext, useState } from "react";
import {
	Form,
	Alert,
	Row,
	Col,
	Input,
	Button,
	Typography,
	Layout,
	Card,
	Select,
	Checkbox,
} from "antd";
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
import { skillTags, maxSkillTags, PrimaryText, LightTextStyle } from "../../utils/constants";
import { ThemeContext } from "../../utils/styles";

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
	"Quantitative Finance",
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
	{
		label: "Both",
		value: "BOTH",
	},
];

const isRegistrationClosed = false;

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

	const handleSkillTagChange = (skillValues) => {
		if (skillValues.length > maxSkillTags) {
			skillValues.pop();
		}
	};
	const { darkMode } = useContext(ThemeContext);
	const textStyle = darkMode
		? {
				color: "#f5f5f7",
		  }
		: {};

	return (
		<div style={darkMode ? { width: "100%", background: "#2c2c2e" } : { width: "100%" }}>
			<AuthHeader />
			<Content className="register-form-container" style={{ margin: "auto" }}>
				<img
					src={logo}
					alt="TeamUp Logo"
					style={
						darkMode
							? {
									maxWidth: 150,
									alignSelf: "center",
									margin: "3rem",
									padding: "0.5rem",
									marginTop: "7rem",
									filter: "invert(1)",
							  }
							: {
									maxWidth: 150,
									alignSelf: "center",
									margin: "3rem",
									padding: "0.5rem",
									marginTop: "7rem",
							  }
					}
				/>
				{screen.xs && (
					<Alert
						type="warning"
						banner
						message={
							<span>
								The portal has <strong> stopped </strong> accepting new
								<strong> registrations </strong> and <strong> payments </strong>.
							</span>
						}
						style={{ borderRadius: "1rem", width: "90%" }}
					/>
				)}
				<Card
					className="loginCard"
					title={
						<strong
							style={
								darkMode
									? { color: "#f5f5f7", fontWeight: "bolder", fontSize: "1.5rem" }
									: { fontWeight: "bolder", fontSize: "1.5rem" }
							}
						>
							Register
						</strong>
					}
					style={
						darkMode
							? { borderRadius: "1rem", marginBottom: "5rem", background: "#3a3a3c" }
							: { borderRadius: "1rem", marginBottom: "5rem", background: "#fff" }
					}
					extra={
						screen.lg && (
							<Alert
								type="warning"
								banner
								message={
									<span>
										The portal has <strong> stopped </strong> accepting new
										<strong> registrations </strong> and{" "}
										<strong> payments </strong>.
									</span>
								}
							/>
						)
					}
				>
					<Form
						form={form}
						disabled={isRegistrationClosed}
						name="register"
						size="large"
						layout="vertical"
						validateTrigger="onSubmit"
						onFinish={onFinish}
					>
						<Row gutter={12}>
							<Col xs={12} md={8}>
								<Form.Item
									style={{ marginBottom: 0 }}
									name="roll"
									label={
										<span style={textStyle}>
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
									]}
								>
									<Input disabled={isRegistrationClosed} />
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
										<span
											style={
												darkMode
													? {
															color: "#f5f5f7",
													  }
													: {}
											}
										>
											<KeyOutlined /> LDAP Password
										</span>
									}
								>
									<Input.Password disabled={isRegistrationClosed} />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									style={{ marginBottom: 0 }}
									name="cgpa"
									validateFirst={true}
									label={
										<span style={textStyle}>
											<BookOutlined /> CGPA
										</span>
									}
									// rules={[
									// 	{
									// 		required: true,
									// 		message: "Please input your CGPA!",
									// 	},
									// ]}
								>
									<Input disabled={isRegistrationClosed} />
								</Form.Item>
							</Col>
							<Col style={{ marginBottom: "0.5em" }}>
								<Typography.Text
									type="secondary"
									style={
										darkMode
											? {
													color: "#d2d2d6",
											  }
											: {}
									}
								>
									We do not store your LDAP password. We only check if you&apos;re
									an IITM student by authenticating you against institute records.
									<br />
									1st year students who do not have a CGPA should enter 0 as their
									CGPA.
								</Typography.Text>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									name="phone"
									validateFirst={true}
									label={
										<span style={textStyle}>
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
									]}
								>
									<Input prefix="+91" disabled={isRegistrationClosed} />
								</Form.Item>
							</Col>
							<Col xs={24} md={16}>
								<Form.Item
									name="personalEmail"
									validateFirst={true}
									label={
										<span style={PrimaryText}>
											<MailOutlined /> Personal Mail
										</span>
									}
									rules={[
										{
											required: true,
											type: "email",
											message: "Please input your Personal mail!",
										},
									]}
								>
									<Input disabled={isRegistrationClosed} />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="iddd"
									label={
										<span style={textStyle}>
											<AuditOutlined /> IDDD
										</span>
									}
									rules={[
										{
											required: false,
										},
									]}
								>
									<Select
										placeholder="None"
										allowClear
										disabled={isRegistrationClosed}
									>
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
										<span style={textStyle}>
											<AuditOutlined /> Minor
										</span>
									}
									rules={[
										{
											required: false,
										},
									]}
								>
									<Input placeholder="None" disabled={isRegistrationClosed} />
								</Form.Item>
							</Col>

							<Col xs={24} md={8}>
								<Form.Item
									name="pinCode"
									validateFirst={true}
									label={
										<span style={textStyle}>
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
									]}
								>
									<Input disabled={isRegistrationClosed} />
								</Form.Item>
							</Col>
							<Col xs={24} md={16}>
								<Form.Item
									name="address"
									validateFirst={true}
									label={
										<span style={textStyle}>
											<CompassOutlined /> Hostel Address
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please input your Hostel Address!",
										},
									]}
								>
									<Input disabled={isRegistrationClosed} />
								</Form.Item>
							</Col>

							<Col xs={24} md={12}>
								<Form.Item
									name="preferredLocation"
									label={<span style={textStyle}>Preferred location</span>}
									rules={[
										{
											required: true,
											message: "Please select your preferred location",
										},
									]}
								>
									<Select
										disabled={isRegistrationClosed}
										placeholder="None"
										options={preferredLocations}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="skillTags"
									label={<span style={textStyle}>Skills</span>}
								>
									<Select
										disabled={isRegistrationClosed}
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
							</Col>
						</Row>
						<Row>
							<Col>
								<Checkbox
									disabled={isRegistrationClosed}
									onChange={() => {
										setIsTNCAccepted(!isTNCAccepted);
									}}
									style={textStyle}
								>
									I agree to the{" "}
									<a
										href="https://drive.google.com/file/d/1AqdWvG_RwYLbWkky4GYHnj0XrjIkHbUG/view"
										target="_blank"
										rel="noreferrer"
									>
										terms and conditions
									</a>
								</Checkbox>
							</Col>
						</Row>
						<Row align="bottom">
							<Col span={16}>
								<Typography.Title level={5} style={textStyle}>
									Already have an account? <Link to="/login">Log In</Link>
								</Typography.Title>
							</Col>
							<Col span={8} style={{ textAlign: "right" }}>
								<Form.Item style={{ marginBottom: "0px" }}>
									<Button
										type="primary"
										size="large"
										shape="round"
										htmlType="submit"
										disabled={!isTNCAccepted}
										loading={loading}
									>
										Register
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Card>
			</Content>
		</div>
	);
};

export default RegisterForm;
