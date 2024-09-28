import React, { useContext } from "react";
import { Row, Col, Grid, Layout, Button, Switch } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Logo from "../assets/e-cell_logo_blank.png";
import internfairLogo from "../assets/Internfair.png";
import { ThemeContext } from "../utils/styles";
const { useBreakpoint } = Grid;
const { Header } = Layout;

const AuthHeader = ({ title }) => {
	const { xs, md } = Grid.useBreakpoint();
	// 	return (
	// 		<Header
	// 			style={{
	// 				backgroundColor: "white",
	// 				boxShadow: "0px 1px 20px rgba(85, 85, 85, 0.2)",
	// 				height: "auto",
	// 			}}
	// 		>
	// 			<Row justify="space-between">
	// 				<Col>
	// 					<Button
	// 						href="http://ecell.iitm.ac.in/internfair"
	// 						icon={<HomeOutlined />}
	// 						size="large"
	// 					>
	// 						{!isMobile && "Home"}
	// 					</Button>
	// 				</Col>
	// 				<Col style={{ fontWeight: "bolder", fontSize: "1.5rem", textAlign: "center" }}>
	// 					<span style={{ color: "#444" }}>{title ?? "E-Cell IITM"}</span>
	// 				</Col>
	// 				<Col span={isMobile ? 4 : 1}>
	// 					<a href="https://ecell.iitm.ac.in">
	// 						<img width="100%" src={Logo} alt="E-Cell, IITM Logo" />
	// 					</a>
	// 				</Col>
	// 			</Row>
	// 		</Header>
	// 	);
	//
	const { darkMode, toggleDarkMode } = useContext(ThemeContext);
	const headerStyle = darkMode
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
		  };
	return (
		<Layout.Header style={headerStyle}>
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
					<Col
						span={8}
						style={{
							textAlign: "center",
							color: "white",
							fontSize: "2rem",
							fontFamily: "Montserrat, serrif",
						}}
					>
						E-Cell Winternfair
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
					></Switch>
				</Col>
			</Row>
		</Layout.Header>
	);
};
export default AuthHeader;
