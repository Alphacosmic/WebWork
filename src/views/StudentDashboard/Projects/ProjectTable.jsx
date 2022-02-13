import React, { useEffect, useState } from "react";
import { Button, Typography, Tag, Table, Modal, Space, Grid, Tooltip } from "antd";
import { CheckOutlined } from "@ant-design/icons";

import Questions from "./QuestionsModal";
import axios from "../../../utils/_axios";

const { Text } = Typography;

/**
 * @type { import("antd/lib/table/interface").ColumnsType }
 */

const columns = [
	{
		title: "Title",
		dataIndex: "title",
		key: "title",
		width: 350,
	},
	{
		title: "Guided by",
		dataIndex: "professorName",
		key: "professorName",
		render: (name, { professorID: { email } }) => <a href={`mailto:${email}`}>{name}</a>,
	},
	{
		title: "Department",
		dataIndex: ["professorID", "department"],
		key: "department",
	},
	{
		title: "Areas",
		dataIndex: "area",
		key: "area",
		render: (areas) =>
			areas.map((area) => (
				<Tag style={{ margin: "0.2rem 0.2rem 0 0" }} key={area}>
					{area}
				</Tag>
			)),
	},
];

const ProjectTable = ({ filter }) => {
	const screen = Grid.useBreakpoint();
	const [questionModal, setQuestionModal] = useState({ visible: false, data: {} });
	const [projects, setProjects] = useState([]);
	const [isFetching, setIsFetching] = useState(true);

	useEffect(() => {
		axios.get("/student/projects").then((res) => {
			setProjects(res.data.data);
			setIsFetching(false);
		});
	}, []);

	const showPostDescriptionModal = (title, description) => {
		Modal.info({
			title: <b>{title}</b>,
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
	const isSelectedInAny = projects.some(({ status }) => status === "SELECTED");
	const hasAppliedMoreThan2 = projects.filter(({ status }) => status === "APPLIED").length >= 2;

	return (
		<>
			<Questions
				projectData={questionModal.data}
				isVisible={questionModal.visible}
				closeModal={() => setQuestionModal({ visible: false })}
			/>
			<Table
				loading={isFetching}
				columns={[
					...columns,
					{
						title: "",
						dataIndex: "status",
						key: "status",
						align: "center",
						render: (status, { title, questions, description, _id }) => (
							<>
								<Button
									type="link"
									onClick={() => {
										showPostDescriptionModal(title, description);
									}}>
									View Details
								</Button>

								{status == "SELECTED" ? (
									<Text type="success" strong style={{ textAlign: "centers" }}>
										<CheckOutlined /> Selected
									</Text>
								) : status === "APPLIED" ? (
									<Text strong style={{ color: "#1890ff" }}>
										<CheckOutlined /> Applied
									</Text>
								) : (
									<Space>
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
												onClick={() => {
													setQuestionModal({
														visible: true,
														data: { questions, projectID: _id },
													});
												}}>
												Apply
											</Button>
										</Tooltip>
									</Space>
								)}
							</>
						),
					},
				]}
				dataSource={projects.filter(({ status }) =>
					filter === "ALL" ? true : status === filter
				)}
				rowKey={(row) => row._id}
				pagination={false}
				scroll={{ y: 500 }}
			/>
		</>
	);
};

export default ProjectTable;
