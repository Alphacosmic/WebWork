import React, { useContext } from "react";
import { Row, Col, Grid, Divider, Typography, Layout, Tooltip } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import { ThemeContext } from "../utils/styles";

const { useBreakpoint } = Grid;
const { Footer } = Layout;

const ECellFooter = ({ developers }) => {
	const screen = useBreakpoint();
	const { darkMode } = useContext(ThemeContext);
	const footerStyle = darkMode
		? {
				backgroundColor: "#3a3a3c",
				boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
				padding: "20px",
				color: "#d1d1d6",
				fontWeight: "lighter",
		  }
		: {
				boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
				padding: "20px",
				color: "#d1d1d6",
				fontWeight: "lighter",
		  };
	const PrimaryTextStyle = darkMode
		? { color: "#f5f5f7" }
		: { color: "black", fontWeight: "bold" };
	const WhatsapptextStyle = darkMode
		? { color: "#f5f5f7" }
		: { color: "black", fontWeight: "bold" };
	const SecondaryTextStyle = darkMode
		? { color: "#d1d1d6", fontWeight: "lighter !important" }
		: { color: "black" };
	return (
		<Footer style={footerStyle}>
			<Row>
				<Col
					xs={24}
					md={8}
					offset={(screen?.md || screen?.lg) && 3}
					style={!(screen?.lg || screen?.md) && { textAlign: "center" }}
				>
					<div style={SecondaryTextStyle}>
						&copy;Developed by {!(screen?.lg || screen?.md) && <br />}
						<strong style={SecondaryTextStyle}>
							Web Operations | E-Cell | IIT Madras.
						</strong>
						<br />
						All Rights Reserved.
					</div>
					<Row style={{ fontSize: "0.9rem" }}>
						<Col xs={12} md={7}>
							<a
								href="https://ecell.iitm.ac.in/internfair-terms-and-conditions"
								target={"_blank"}
								rel="noreferrer"
								style={SecondaryTextStyle}
							>
								Terms & Conditions
							</a>
						</Col>{" "}
						<Col xs={12} md={6}>
							<a
								href="https://ecell.iitm.ac.in/internfair-privacy-policy"
								target={"_blank"}
								rel="noreferrer"
								style={SecondaryTextStyle}
							>
								Privacy Policy
							</a>
						</Col>
						<Col xs={12} md={8}>
							<a
								href="https://ecell.iitm.ac.in/internfair-terms-and-conditions#refund-policy"
								target={"_blank"}
								rel="noreferrer"
								style={SecondaryTextStyle}
							>
								Refund/Cancellation Policy
							</a>
						</Col>
						<Col xs={12} md={3}>
							<a
								href="https://ecell.iitm.ac.in/internfair"
								target={"_blank"}
								rel="noreferrer"
								style={SecondaryTextStyle}
							>
								About Us
							</a>
						</Col>
					</Row>
				</Col>

				{!(screen?.lg || screen?.md) && <Divider />}

				<Col
					xs={24}
					md={7}
					offset={(screen?.md || screen?.lg) && 6}
					style={!(screen?.lg || screen?.md) && { textAlign: "center" }}
				>
					<div>
						<span style={SecondaryTextStyle}>For issues related to the website, </span>
						<div>
							{developers.map((developer) => (
								<div key={developer.whatsappNum}>
									<Typography.Link
										href={developer.profileURL}
										target="blank"
										style={PrimaryTextStyle}
									>
										{developer.name}
									</Typography.Link>{" "}
									<WhatsAppOutlined style={WhatsapptextStyle} /> :{" "}
									<Typography.Text
										copyable={{ tooltips: false }}
										style={SecondaryTextStyle}
									>
										{developer.whatsappNum}
									</Typography.Text>
								</div>
							))}
							<div style={SecondaryTextStyle}>
								<Typography.Link style={PrimaryTextStyle}>Address</Typography.Link>
								: E-Cell, IIT Madras, Chennai - 600036
								<br />
								<Typography.Link style={PrimaryTextStyle}>Email</Typography.Link>:
								services_ecell@smail.iitm.ac.in
							</div>
						</div>
					</div>
				</Col>
			</Row>
		</Footer>
	);
};

export default ECellFooter;
