import React, { useState } from "react";
import "../StudentDashboard/Projects/index.css";
import { Form, Layout, Input, Button, Row, Col, Card, Typography } from "antd";
import openNotification from "../../utils/openAntdNotification";
import "./Login.css";
import { Link, useLocation } from "wouter";
import logo from "../../assets/startup-internfair_logo.png";
import { useContext } from "react";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
const { Content } = Layout;
import AuthHeader from "../../common/AuthHeader";
import getCookieToken from "../../utils/getCookieToken";
import axios from "../../utils/_axios";
import { LightTextStyle } from "../../utils/constants";
import { ThemeContext } from "../../utils/styles";

// Convert this to state if they add online students to teamup
const studentType = "iitm";

const Login = () => {
	const screen = useBreakpoint();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [, setLocation] = useLocation();

	const onFinish = async (values) => {
		setIsSubmitting(true);
		try {
			const res = await axios.post("/login", values);
			if (getCookieToken()) {
				localStorage.setItem("studentData", JSON.stringify(res.data));
				setIsSubmitting(false);
				setLocation("/dashboard");
			} else throw new Error("Could not authorize.");
		} catch (error) {
			console.log(error);
			setIsSubmitting(false);
			openNotification("error", "Error occured in logging in.", error.response.data);
		}
	};
	const { darkMode } = useContext(ThemeContext);
	const backgroundStyle = darkMode
		? { backgroundColor: "#2c2c2e", minHeight: "88vh" }
		: { minHeight: "88vh" };
	const imageStyle = darkMode
		? {
				maxWidth: 150,
				alignSelf: "center",
				margin: "0 0 0.5em 0",
				padding: "0.5rem",
				filter: "invert(1)",
				marginTop: "8rem",
		  }
		: {
				maxWidth: 150,
				alignSelf: "center",
				margin: "0 0 0.5em 0",
				padding: "0.5rem",
				marginTop: "8rem",
		  };
	return (
		<div style={backgroundStyle}>
			<AuthHeader />
			<Content className="container">
				<img src={logo} alt="TeamUp Logo" style={imageStyle} />

				<Card
					bordered={true}
					hoverable={!screen.xs}
					style={darkMode ? { backgroundColor: "#3a3a3c" } : { background: "#ffffff" }}
					// title={
					// 	<Radio.Group
					// 		value={studentType}
					// 		onChange={(e) => setStudentType(e.target.value)}>
					// 		<Radio value="online">IITM Online B.Sc Student</Radio>
					// 		<Radio value="iitm">IITM Student</Radio>
					// 	</Radio.Group>
					// }
					title={
						<span
							style={
								darkMode
									? { color: "#f5f5f7", fontSize: "1.5rem", marginBottom: "1rem" }
									: { fontSize: "1.5rem", marginBottom: "1rem" }
							}
						>
							Log In
						</span>
					}
					className="loginCard"
				>
					<Form
						size="large"
						layout="vertical"
						name="Login"
						onFinish={onFinish}
						style={{ marginTop: "-1rem" }}
					>
						<Form.Item
							label={
								<span
									style={
										darkMode
											? { color: "#d1d1d6", fontSize: "1rem" }
											: { fontSize: "1rem" }
									}
								>
									Roll
								</span>
							}
							name="roll"
							rules={[
								{
									required: true,
									message: "Please input your Roll no.!",
								},
								{
									pattern:
										studentType === "online"
											? /^\d{2}[a-z]\d{7}$/i
											: /^[a-z]{2}\d{2}[a-z]\d{3}$/i,
									message: "Invalid roll",
									transform: (val) => (!val ? "" : val.trim()),
								},
							]}
						>
							<Input
								placeholder={
									studentType === "online"
										? "The roll no. provided to you"
										: "LDAP Roll no."
								}
							/>
						</Form.Item>

						<Form.Item
							label={
								<span
									style={
										darkMode
											? { color: "#d1d1d6", fontSize: "1rem" }
											: { fontSize: "1rem" }
									}
								>
									Password
								</span>
							}
							name="password"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}
						>
							<Input.Password
								placeholder={studentType === "online" ? "•••••••" : "LDAP Password"}
							/>
						</Form.Item>

						<Row justify="space-between" align="bottom">
							<Col span={16}>
								<Typography.Title level={5} style={darkMode ? LightTextStyle : {}}>
									New here? <Link to="/register">Register</Link>
								</Typography.Title>
							</Col>
							<Col span={8} style={{ textAlign: "right" }}>
								<Form.Item style={{ marginBottom: "0px" }}>
									<Button
										type="primary"
										size="large"
										htmlType="submit"
										loading={isSubmitting}
										disabled={false}
									>
										Log In
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

export default Login;
