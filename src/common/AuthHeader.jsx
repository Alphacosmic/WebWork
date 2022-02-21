import React from "react";
import { Row, Col, Grid, Layout, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Logo from "../assets/e-cell_logo_blank.png";

const { useBreakpoint } = Grid;
const { Header } = Layout;

const AuthHeader = ({ title }) => {
	const { xs: isMobile } = useBreakpoint();
	return (
		<Header
			style={{
				backgroundColor: "white",
				boxShadow: "0px 1px 20px rgba(85, 85, 85, 0.2)",
				height: "auto",
			}}>
			<Row justify="space-between">
				<Col>
					<Button
						href="http://ecell.iitm.ac.in/internfair"
						icon={<HomeOutlined />}
						size="large">
						{!isMobile && "Home"}
					</Button>
				</Col>
				<Col style={{ fontWeight: "bolder", fontSize: "1.5rem", textAlign: "center" }}>
					<span style={{ color: "#444" }}>{title ?? "E-Cell IITM"}</span>
				</Col>
				<Col span={isMobile ? 4 : 1}>
					<a href="https://ecell.iitm.ac.in">
						<img width="100%" src={Logo} alt="E-Cell, IITM Logo" />
					</a>
				</Col>
			</Row>
		</Header>
	);
};

export default AuthHeader;
