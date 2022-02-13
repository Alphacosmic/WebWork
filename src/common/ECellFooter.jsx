import React from "react";
import { Row, Col, Grid, Divider, Popover, Typography, Layout } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Footer } = Layout;

const ECellFooter = ({ developers }) => {
	const screen = useBreakpoint();

	const developerDetails = (
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
		</div>
	);
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
					md={6}
					offset={(screen?.md || screen?.lg) && 3}
					style={!(screen?.lg || screen?.md) && { textAlign: "center" }}>
					<div>
						&copy;Developed by {!(screen?.lg || screen?.md) && <br />}
						<strong>Web Operations | E-Cell | IIT Madras.</strong>
						<br />
						All Rights Reserved.
					</div>
				</Col>

				{!(screen?.lg || screen?.md) && <Divider />}

				<Col
					xs={24}
					md={6}
					offset={(screen?.md || screen?.lg) && 6}
					style={!(screen?.lg || screen?.md) && { textAlign: "center" }}>
					<div>
						<span>For issues related to the website, </span>
						<Popover content={developerDetails}>
							<Typography.Link>contact us.</Typography.Link>
						</Popover>
					</div>
				</Col>
			</Row>
		</Footer>
	);
};

export default ECellFooter;
