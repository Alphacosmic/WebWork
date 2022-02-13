import React, { useEffect, useState } from "react";
import { Grid, List, Card, Button, Typography, Row, Col, Tag, Modal, Tooltip } from "antd";
import {
	ThunderboltOutlined,
	CheckOutlined,
	TeamOutlined,
	UserOutlined,
	SolutionOutlined,
	SmileOutlined,
} from "@ant-design/icons";

import Questions from "./QuestionsModal";
import axios from "../../../utils/_axios";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const ALL = "ALL";
const APPLIED = "APPLIED";
const SELECTED = "SELECTED";
// const REJECTED = "REJECTED";

const Projects = ({ filter = "none" }) => {
	const screen = useBreakpoint();
	const [projects, setProjects] = useState([]);
	const [isFetching, setIsFetching] = useState(true);
	const [questionModal, setQuestionModal] = useState({ visible: false, data: {} });

	useEffect(() => {
		axios.get("/student/projects").then((res) => {
			setProjects(res.data.data);
			setIsFetching(false);
		});
	}, []);
	const isSelectedInAny = projects.some(({ status }) => status === "SELECTED");
	const hasAppliedMoreThan2 = projects.filter(({ status }) => status === "APPLIED").length >= 2;

	const showPostDescriptionModal = (target, title, description) => {
		Modal.info({
			title,
			// Magic numbers: 200 and 500. Felt clever, might change later
			content: (
				<div
					style={{
						maxHeight: !screen.md ? window.innerHeight - 200 : 500,
						overflowY: "auto",
					}}>
					{description}
				</div>
			),
			icon: null,
			width: !screen.md ? window.innerWidth : 768,
			zIndex: 1010,
			okText: "Close",
			centered: true,
			maskClosable: true,
		});
	};
	const EmptyList = ({ filter }) => (
		<div style={{ textAlign: "center", marginTop: "3rem" }}>
			{filter === APPLIED ? (
				<>
					<SmileOutlined style={{ fontSize: "3rem" }} />
					<br />
					<Text type="secondary" strong>
						You have not applied for any projects.
					</Text>
					<br />
					<Text type="secondary">
						Apply now from the <strong>All</strong> tab.
					</Text>
				</>
			) : filter === SELECTED ? (
				<>
					<TeamOutlined style={{ fontSize: "3rem" }} />
					<br />
					<Text type="secondary" strong>
						No selections yet.
					</Text>
					<br />
					<Text type="secondary"> Please check back later!</Text>
				</>
			) : (
				<>
					<ThunderboltOutlined style={{ fontSize: "3rem" }} />
					<br />
					<Text type="secondary" strong>
						No Projects found with the selected filters
					</Text>
					<br />
					<Text type="secondary">
						Keep an eye on the <strong>Selected</strong> tab
					</Text>
				</>
			)}
		</div>
	);

	return (
		<>
			<Questions
				projectData={questionModal.data}
				isVisible={questionModal.visible}
				closeModal={() => setQuestionModal({ visible: false })}
			/>
			<List
				size="large"
				itemLayout="horizontal"
				locale={{ emptyText: <EmptyList filter={filter} /> }}
				loading={isFetching}
				grid={{ column: screen.xs ? 1 : 2 }}
				dataSource={projects.filter(({ status }) =>
					filter === ALL ? true : filter === status
				)}
				renderItem={(project) => (
					<List.Item
						style={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "0px" }}>
						<Card
							title={<b style={{ color: "#444" }}>{project.title}</b>}
							actions={[
								<Button
									key={1}
									block
									type="link"
									onClick={(e) =>
										showPostDescriptionModal(
											e.target,
											project.title,
											project.description
										)
									}>
									View Details
								</Button>,
								project.status === SELECTED ? (
									<Text type="success" strong>
										<CheckOutlined /> Selected
									</Text>
								) : project.status === APPLIED ? (
									<Text strong style={{ color: "#1890ff" }}>
										<CheckOutlined /> Applied
									</Text>
								) : (
									<Tooltip
										title={
											hasAppliedMoreThan2
												? "You cannot apply in more than two projects at once"
												: isSelectedInAny
												? "You are already selected in a project"
												: undefined
										}>
										<Button
											disabled={isSelectedInAny || hasAppliedMoreThan2}
											type="link"
											block
											onClick={() => {
												setQuestionModal({
													visible: true,
													data: {
														questions: project.questions,
														projectID: project._id,
													},
												});
											}}>
											Apply
										</Button>
									</Tooltip>
								),
							]}>
							<Row justify="space-between">
								<Col
									xs={{ span: 24 }}
									md={{ span: 12 }}
									style={{ marginBottom: "1rem" }}>
									<UserOutlined />{" "}
									<Text strong type="secondary">
										Guided by
									</Text>
									<br />
									<Typography.Link
										href={`mailto:${project?.professorID?.email}`}
										key={1}>
										Prof. {project.professorName}
									</Typography.Link>
								</Col>
								<Col flex="auto" md={12} style={{ marginBottom: "1rem" }}>
									<TeamOutlined />{" "}
									<Text strong type="secondary">
										Department
									</Text>
									<br />
									<Text>{project.professorID.department}</Text>
								</Col>
								<Col span={24} style={!screen.md && { marginBottom: "1rem" }}>
									<SolutionOutlined />{" "}
									<Typography.Text strong type="secondary">
										Areas
									</Typography.Text>
									<br />
									{project.area.map((area) => (
										<Tag style={{ margin: "0.2rem 0.2rem 0 0" }} key={area}>
											{area}
										</Tag>
									))}
								</Col>
							</Row>
						</Card>
					</List.Item>
				)}
			/>
		</>
	);
};

export default Projects;
