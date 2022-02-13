import React from "react";

import { Button, Col, Grid, Layout, Row } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

import largeLogo from "../../assets/e-cell_logo_hor.png";
import teamupLogo from "../../assets/teamup-header.png";
import smallTeamupLogo from "../../assets/teamup-header-small.png";

const Header = ({ menuVisibile, setMenuVisibility }) => {
	const { xs, md } = Grid.useBreakpoint();
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
							src={xs ? smallTeamupLogo : largeLogo}
							alt="E-Cell Logo"
							height="100%"
							style={{ padding: "0.85em 0" }}
						/>
					</a>
				</Col>
				{md && (
					<Col span={8} style={{ textAlign: "center" }}>
						<img
							src={teamupLogo}
							alt="E-Cell Logo"
							height="100%"
							style={{ padding: "0.9em" }}
						/>
					</Col>
				)}
				<Col span={8} style={{ textAlign: "right" }}>
					<Button
						type="dashed"
						icon={
							menuVisibile ? (
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
