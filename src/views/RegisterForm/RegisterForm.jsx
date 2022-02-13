import React, { useState } from "react";
import { Form, Row, Col, Input, Button, Typography, Layout, Card } from "antd";
import { UserOutlined, NumberOutlined, PhoneOutlined, KeyOutlined } from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import "./RegisterForm.css";

import AuthHeader from "../../common/AuthHeader";
import { Link, useLocation } from "wouter";
import logo from "../../assets/teamup-logo.png";
import axios from "axios";
const { Content } = Layout;

const studentType = "iitm";

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
			const res = await axios.post("/student/register/" + studentType, values);
			localStorage.setItem("studentData", JSON.stringify(res.data));

			handleSuccess();
		} catch (err) {
			const error = err.response ? err.response.data : err;
			const errorMsg = error.msg ?? error.message;
			handleError(errorMsg);
		}
	};

	return (
		<>
			<AuthHeader />
			<img
				src={logo}
				alt="TeamUp Logo"
				style={{ maxWidth: 200, alignSelf: "center", marginTop: "2em" }}
			/>
			<Content className="register-form-container">
				<Card
					className="loginCard"
					// title={
					// 	<Radio.Group
					// 		value={studentType}
					// 		onChange={(e) => setStudentType(e.target.value)}>
					// 		<Radio value="online">IITM Online B.Sc Student</Radio>
					// 		<Radio value="iitm">IITM Student</Radio>
					// 	</Radio.Group>
					// }
					title={<strong>Register</strong>}>
					<Form
						form={form}
						name="register"
						size="large"
						layout="vertical"
						validateTrigger="onSubmit"
						onFinish={onFinish}>
						<Row gutter={24}>
							{studentType === "online" && (
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
							)}
							<Col span={studentType === "online" ? 16 : 24}>
								<Form.Item
									name="roll"
									label={
										<span>
											<NumberOutlined />{" "}
											{studentType === "online" ? "Email" : "LDAP Roll No."}
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please enter your Roll No.",
										},
										{
											pattern:
												studentType === "online"
													? /^\d{2}[a-z]\d{7}$/i
													: /^[a-z]{2}\d{2}[a-z]\d{3}$/i,
											message: "Invalid roll",
											transform: (val) => (!val ? "" : val.trim()),
										},
									]}>
									<Input
										onFocus={() => setIsRollFocused(true)}
										onBlur={() => setIsRollFocused(false)}
										addonAfter={
											studentType === "online" && (
												<div
													style={{
														width: isRollFocused ? 50 : "auto",
														textOverflow: "ellipsis",
														overflow: "clip",
													}}>
													@student.onlinedegree.iitm.ac.in
												</div>
											)
										}
									/>
								</Form.Item>
							</Col>

							<Col span={studentType === "online" ? 8 : 24}>
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
							<Col xs={24} md={studentType === "online" ? 12 : 24}>
								<Form.Item
									name="password"
									rules={[
										{
											required: true,
											message: "Please input your password.",
										},
										studentType === "online"
											? {
													min: 6,
													message: "Please input at least 6 characters.",
											  }
											: {},
									]}
									label={
										<span>
											<KeyOutlined />{" "}
											{studentType === "online"
												? "Create Password"
												: "LDAP Password"}
										</span>
									}
									extra="We do not store your LDAP password. We only check if you're an IITM student by authenticating you against institute records.">
									<Input.Password />
								</Form.Item>
							</Col>
							{studentType === "online" && (
								<Col xs={24} md={12}>
									<Form.Item
										dependencies={["password"]}
										name="confirm"
										hasFeedback
										validateTrigger="onChange"
										rules={[
											{
												required: true,
												message: "Please confirm your password.",
											},
											({ getFieldValue }) => ({
												validator(rule, value) {
													if (
														!value ||
														getFieldValue("password") === value
													) {
														return Promise.resolve();
													}
													return Promise.reject("");
												},
											}),
										]}
										label={
											<span>
												<KeyOutlined /> Confirm Password
											</span>
										}>
										<Input.Password />
									</Form.Item>
								</Col>
							)}
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
