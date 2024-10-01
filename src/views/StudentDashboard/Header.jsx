import React, { useContext, useState } from "react";

import { Button, Col, Grid, Layout, Row, Switch } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

import ecellLogo from "../../assets/e-cell_logo_hor.png";
import internfairLogo from "../../assets/Internfair.png";
import { LogoutOutlined } from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import { useLocation } from "wouter";
import axios from "../../utils/_axios";
import { ThemeContext } from "../../utils/styles";
import { darken } from "@mui/material";

const Header = ({ menuVisible, setMenuVisibility, ref }) => {
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
	const { darkMode, toggleDarkMode } = useContext(ThemeContext);

	return (
		<Layout.Header
			style={
				darkMode
					? {
							background: "#3a3a3c",
							zIndex: 1001,
							position: "fixed",
							maxWidth: "100vw",
							top: 0,
							left: 0,
							height: "70px",
							width: "100%",
							boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
							padding: "4rem !important",
							borderBottomLeftRadius: "1rem",
							borderBottomRightRadius: "1rem",
					  }
					: {
							zIndex: 1001,
							position: "fixed",
							maxWidth: "100vw",
							top: 0,
							left: 0,
							height: "70px",
							width: "100%",
							boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
							padding: "4rem !important",
							borderBottomLeftRadius: "1rem",
							borderBottomRightRadius: "1rem",
					  }
			}
		>
			<Row className="header" justify="space-between" align="bottom">
				<Col span={8}>
					<a href="https://ecell.iitm.ac.in" target="_blank" rel="noopener noreferrer">
						<img
							src="../../../public/E-Cell-logo.webp"
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
					span={md ? 8 : 12}
					style={{
						textAlign: "right",
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
					}}
				>
					<Switch
						onChange={() => {
							toggleDarkMode();
						}}
						style={{ marginRight: "1rem" }}
					></Switch>
					<Button
						class="logout"
						size="large"
						shape="round"
						style={
							darkMode
								? {
										backgroundColor: "red",
										marginRight: "1rem",
										color: "#f5f5f7",
										border: "0",
										fontWeight: "bolder",
								  }
								: {
										marginRight: "1rem",
										borderColor: "#ff9a9a",
										background: "transparent",
										fontWeight: "bolder",
										color: "#ff9a9a",
								  }
						}
						onClick={handleLogout}
						icon={<LogoutOutlined style={{ fontSize: "1.5rem" }} />}
					>
						{xs ? "" : "LOG OUT"}
					</Button>
					<Button
						ref={ref}
						style={{ backgroundColor: "transparent", border: "0" }}
						icon={<MenuOutlined style={{ color: "white", fontSize: "2rem" }} />}
						onClick={() => setMenuVisibility((prevState) => !prevState)}
					/>
				</Col>
			</Row>
		</Layout.Header>
	);
};

export default Header;
