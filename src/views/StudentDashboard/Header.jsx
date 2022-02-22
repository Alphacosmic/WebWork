import React from "react";

import { Button, Col, Grid, Layout, Row } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

import ecellLogo from "../../assets/e-cell_logo_hor.png";
import internfairLogo from "../../assets/startup-internfair_logo_hor.png";
import { LogoutOutlined } from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import { useLocation } from "wouter";
import axios from "../../utils/_axios";

const Header = ({ menuVisible, setMenuVisibility }) => {
	const { xs, md } = Grid.useBreakpoint();
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
		<Layout.Header
			style={{
				background: "#fefefe",
				zIndex: 1001,
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
				padding: "4rem !important",
			}}>
			<Row className="header" justify="space-between" align="bottom">
				<Col span={8}>
					<a href="https://ecell.iitm.ac.in" target="_blank" rel="noopener noreferrer">
						<img
							src={xs ? internfairLogo : ecellLogo}
							alt="E-Cell Logo"
							height="100%"
							style={{ padding: "0.85em 0" }}
						/>
					</a>
				</Col>
				{md && (
					<Col span={8} style={{ textAlign: "center" }}>
						<img
							src={internfairLogo}
							alt="E-Cell Logo"
							height="100%"
							style={{ padding: "0.9em" }}
						/>
					</Col>
				)}
				<Col
					xs={12}
					lg={8}
					style={{
						textAlign: "right",
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
					}}>
					<Button
						danger
						icon={<LogoutOutlined style={{ fontSize: "1rem" }} />}
						onClick={handleLogout}
						style={{ marginRight: "1rem" }}>
						{xs ? "" : "LOG OUT"}
					</Button>
					<Button
						type="dashed"
						icon={
							menuVisible ? (
								<CloseOutlined style={{ fontSize: "1.5rem" }} />
							) : (
								<MenuOutlined style={{ fontSize: "1.5rem" }} />
							)
						}
						onClick={() => setMenuVisibility((prevState) => !prevState)}
					/>
				</Col>
			</Row>
		</Layout.Header>
	);
};

export default Header;
