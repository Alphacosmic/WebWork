import React from "react";
import { Row, Col, Grid, Divider, Popover, Typography, Layout } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Footer } = Layout;

const ECellFooter = ({ developers }) => {
	const screen = useBreakpoint();

	// const developerDetails = (
	// 	<div>
	// 		{developers.map((developer) => (
	// 			<div key={developer.whatsappNum}>
	// 				<Typography.Link href={developer.profileURL} target="blank">
	// 					{developer.name}
	// 				</Typography.Link>{" "}
	// 				<WhatsAppOutlined /> :{" "}
	// 				<Typography.Text copyable={{ tooltips: false }}>
	// 					{developer.whatsappNum}
	// 				</Typography.Text>
	// 			</div>
	// 		))}
	// 		<Typography.Link>Address</Typography.Link>: E-Cell, IIT Madras, Chennai - 600036
	// 	</div>
	// );
	return (
		<Footer
			style={{
				backgroundColor: "white",
				boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
				padding: "20px",
			}}>
			<Row>
				<Col
					xs={24}
					md={8}
					offset={(screen?.md || screen?.lg) && 3}
					style={!(screen?.lg || screen?.md) && { textAlign: "center" }}>
					<div>
						&copy;Developed by {!(screen?.lg || screen?.md) && <br />}
						<strong>Web Operations | E-Cell | IIT Madras.</strong>
						<br />
						All Rights Reserved.
					</div>
					<Row style={{ fontSize: "0.9rem" }}>
						<Col span={9}>
							<a
								href="https://ecell.iitm.ac.in/internfair-terms-and-conditions"
								target={"_blank"}
								rel="noreferrer">
								Terms & Conditions
							</a>
						</Col>{" "}
						<Col span={6}>
							<a
								href="https://ecell.iitm.ac.in/internfair-privacy-policy"
								target={"_blank"}
								rel="noreferrer">
								Privacy Policy
							</a>
						</Col>
						<Col span={9}>
							<a
								href="https://ecell.iitm.ac.in/internfair-terms-and-conditions#refund-policy"
								target={"_blank"}
								rel="noreferrer">
								Refund/Cancellation Policy
							</a>
						</Col>
					</Row>
				</Col>

				{!(screen?.lg || screen?.md) && <Divider />}

				<Col
					xs={24}
					md={7}
					offset={(screen?.md || screen?.lg) && 6}
					style={!(screen?.lg || screen?.md) && { textAlign: "center" }}>
					<div>
						<span>For issues related to the website, </span>
						{/* <Popover content={developerDetails}>
							<Typography.Link>contact us.</Typography.Link>
						</Popover> */}
						<div>
							{developers.map((developer) => (
								<div key={developer.whatsappNum}>
									<Typography.Link href={developer.profileURL} target="blank">
										{developer.name}
									</Typography.Link>{" "}
									<WhatsAppOutlined /> :{" "}
									<Typography.Text copyable={{ tooltips: false }}>
										{developer.whatsappNum}
									</Typography.Text>
								</div>
							))}
							<Typography.Link>Address</Typography.Link>: E-Cell, IIT Madras, Chennai
							- 600036
							<br />
							<Typography.Link>Email</Typography.Link>:
							services_ecell@smail.iitm.ac.in
						</div>
					</div>
				</Col>
			</Row>
		</Footer>
	);
};

export default ECellFooter;
