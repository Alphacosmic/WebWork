import React, { useState } from "react";
import { Form, Row, Col, Input, Button, Typography, Layout, Card, Select } from "antd";
import {
	UserOutlined,
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

const OptionsOfIDDD = [
	"Advanced Materials and Nanotechnology",
	"Bio-Medical Engineering",
	"Computational Engineering",
	"Data Science",
	"Energy Systems",
	"Robotics",
	"Quantum Science & Technology",
	"Complex Systems and Dynamics",
	"Cyber Physical Systems",
	"Electric Vehicles",
	"Tech MBA",
];

const RegisterForm = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const [isRollFocused, setIsRollFocused] = useState(false);
	const [, setLocation] = useLocation();

	const handleError = (errorMsg) => {
		openNotification("error", "Error occured in posting form data.", errorMsg);
		setLoading(false);
	};
	const handleSuccess = () => {
		setLocation("/dashboard");
	};
	const onFinish = async () => {
		try {
			setLoading(true);
			const values = await form.validateFields();
			delete values.confirm;
			const res = await axios.post("/register", values);
			localStorage.setItem("studentData", JSON.stringify(res.data));

			handleSuccess();
		} catch (err) {
			const error = err.response ? err.response.data : err;
			const errorMsg = error.msg ?? error.message;
			handleError(errorMsg);
		}
	};
	const onIDDDSelect = (value) => {
		form.setFieldsValue({ IDDD: value });
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
				<Card className="loginCard" title={<strong>Register</strong>}>
					<Form
						form={form}
						name="register"
						size="large"
						layout="vertical"
						validateTrigger="onSubmit"
						onFinish={onFinish}>
						<Row gutter={24}>
							<Col span={24}>
								<Form.Item
									name="name"
									label={
										<span>
											<UserOutlined /> Name
										</span>
									}
									rules={[
										{ required: true, message: "Please enter your name!" },
									]}>
									<Input />
								</Form.Item>
							</Col>

							<Col xs={24} md={12}>
								<Form.Item
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
									<Input
										onFocus={() => setIsRollFocused(true)}
										onBlur={() => setIsRollFocused(false)}
									/>
								</Form.Item>
							</Col>

							<Col xs={24} md={12}>
								<Form.Item
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
											<KeyOutlined />
											LDAP Password
										</span>
									}
									extra="We do not store your LDAP password. We only check if you're an IITM student by authenticating you against institute records.">
									<Input.Password />
								</Form.Item>
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
									name="email"
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
							<Col xs={24} md={6}>
								<Form.Item
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
							<Col xs={24} md={18}>
								<Form.Item
									name="IDDD"
									label={
										<span>
											<AuditOutlined /> IDDD
										</span>
									}
									rules={[
										{
											required: false,
										},
									]}
									extra="Are You an IDDD Student? If not leave blank">
									<Select placeholder="None" onChange={onIDDDSelect} allowClear>
										{OptionsOfIDDD.map((value, i) => (
											<Option key={i} value={value}>
												{value}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
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
									]}
									extra="Do you have Minor? If not leave blank">
									<Input />
								</Form.Item>
							</Col>

							<Col xs={24} md={6}>
								<Form.Item
									name="pincode"
									validateFirst={true}
									label={
										<span>
											<CompassOutlined />
											Residential Pincode
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please input your Pincode!",
										},
									]}>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} md={18}>
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
