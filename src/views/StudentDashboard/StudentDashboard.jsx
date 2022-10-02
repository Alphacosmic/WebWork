import React, { useState, useEffect, useLayoutEffect } from "react";
import "./StudentDashboard.css";
import StudentMenu from "./StudentMenu";
import { Layout, Typography, Drawer, Tabs, Button, Space, Divider, Popover, Radio } from "antd";
import { InfoCircleOutlined, ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import Header from "./Header";
import AllProfiles from "./Projects";
// const ProjectTable = React.lazy(() => import("./Projects/ProjectTable"));
import AppliedProfilesTable from "./Profiles";
// import ProfileTable from "./Profiles/ProfileTable";
import RulesModal from "./RulesModal";
import axios from "../../utils/_axios";
import {
	ALL,
	NONE,
	STIPEND,
	WFH,
	NUMBER_OF_APPLICANTS,
	SORT_ORDER,
	DESCENDING,
	ASCENDING,
} from "../../utils/constants";

const { Content } = Layout;

const StudentDashboard = () => {
	const [headerHeight, setHeaderHeight] = useState(0);
	const screen = useBreakpoint();
	const [menuVisible, setMenuVisibility] = useState(false);
	const [rulesModalVisible, setRulesModalVisible] = useState(false);
	const [student, setStudent] = useState(null);
	const [statusFilter, setStatusFilter] = useState(ALL);
	const [statusSort, setStatusSort] = useState(NONE);
	const [statusSortOrder, setStatusSortOrder] = useState(NONE);
	const [sortOrderIcon, setSortOrderIcon] = useState(null);
	// const [statusFilter, setStatusFilter] = useState(ALL);
	// const [displayType, setDisplayType] = useState(() => localStorage.displayType || "grid");
	useEffect(() => {
		axios.get("/getStudent").then((res) => {
			setStudent(res.data);
		});
	}, []);

	useEffect(() => {
		if (statusSortOrder === DESCENDING) setSortOrderIcon(<ArrowUpOutlined />);
		else if (statusSortOrder === ASCENDING) setSortOrderIcon(<ArrowDownOutlined />);
		else setSortOrderIcon(null);
	}, [statusSortOrder]);

	useLayoutEffect(() => {
		if (screen.md) {
			setMenuVisibility(true);
		} else {
			setMenuVisibility(false);
		}
	}, [screen.md]);

	useEffect(() => {
		let height = document.getElementsByTagName("header")[0].clientHeight;
		setHeaderHeight(height);
	}, [headerHeight]);

	const updateResume = (newResumeURL) => {
		setStudent((prevState) => {
			return {
				...prevState,
				resumeURL: [...prevState.resumeURL, newResumeURL],
			};
		});
	};

	const updatePaymentInfo = (paymentID) => {
		setStudent((prevState) => {
			return {
				...prevState,
				paymentDetails: {
					paymentID,
					captured: true,
				},
			};
		});
	};

	const Settings = (
		<Space direction={{ xs: "vertical", md: "horizontal" }} align="center">
			{/* <Alert
				type="warning"
				banner
				message={
					!screen.xs ? (
						<span>
							The last date to apply to a profile is{" "}
							<strong>3rd March 9:00 AM</strong>
						</span>
					) : (
						<span>
							Last date to apply:
							<br /> <strong>3rd March 9:00 AM</strong>
						</span>
					)
				}
			/> */}

			<Divider type="vertical" />
			<Button
				type="link"
				onClick={() => setRulesModalVisible(true)}
				icon={<InfoCircleOutlined />}>
				Rules
			</Button>
			<>
				<Divider type="vertical" />
				<Popover
					trigger="click"
					placement="bottom"
					content={
						<>
							<Radio.Group
								value={statusFilter}
								onChange={(val) => {
									setStatusFilter(val.target.value);
								}}>
								<Space direction="vertical">
									<Radio value={WFH}>WFH</Radio>
								</Space>
							</Radio.Group>
							<Divider />
							<Button onClick={() => setStatusFilter(ALL)}>Clear Filters</Button>
						</>
					}>
					<Button>Filters</Button>
				</Popover>
				<Popover
					trigger="click"
					placement="bottom"
					content={
						<>
							<Radio.Group
								value={statusSort}
								onChange={(val) => {
									setStatusSortOrder(NONE);
									setStatusSort(val.target.value);
								}}>
								<Space direction="vertical">
									<Radio value={STIPEND}>Stipend</Radio>
									{statusSort === STIPEND && (
										<Radio.Group
											value={statusSortOrder}
											onChange={(val) => {
												setStatusSortOrder(val.target.value);
											}}>
											<Space
												direction="vertical"
												style={{ marginLeft: "15px" }}>
												<Radio value={DESCENDING}>Descending</Radio>
												<Radio value={ASCENDING}>Ascending</Radio>
											</Space>
										</Radio.Group>
									)}
									<Radio value={NUMBER_OF_APPLICANTS}>Number of applicants</Radio>
									{statusSort === NUMBER_OF_APPLICANTS && (
										<Radio.Group
											value={statusSortOrder}
											onChange={(val) => {
												setStatusSortOrder(val.target.value);
											}}>
											<Space
												direction="vertical"
												style={{ marginLeft: "15px" }}>
												<Radio value={DESCENDING}>Descending</Radio>
												<Radio value={ASCENDING}>Ascending</Radio>
											</Space>
										</Radio.Group>
									)}
								</Space>
							</Radio.Group>
							<Divider />
							<Button
								onClick={() => {
									setStatusSort(NONE);
									setStatusSortOrder(NONE);
								}}>
								Clear Sorting
							</Button>
						</>
					}>
					<Button>Sorting</Button>
				</Popover>
			</>
		</Space>
	);

	return (
		<>
			<Header menuVisible={menuVisible} setMenuVisibility={setMenuVisibility} />

			<RulesModal
				isVisible={rulesModalVisible}
				closeModal={() => setRulesModalVisible(false)}
			/>
			<Content id="student-dashboard-content" style={{ marginTop: headerHeight }}>
				<div id="projects-table-container">
					{screen.xs && Settings}

					<Tabs
						size="large"
						style={{ overflow: "visible" }}
						onChange={(key) => (localStorage.type = key)}
						defaultActiveKey={localStorage.type || 0}
						tabBarExtraContent={screen.md && Settings}>
						<Tabs.TabPane
							tab={<Typography.Title level={3}>All</Typography.Title>}
							key={1}>
							<AllProfiles
								props={{
									student,
									updatePaymentInfo,
									statusFilter,
									statusSort,
									statusSortOrder,
								}}
							/>
						</Tabs.TabPane>
						<Tabs.TabPane
							tab={<Typography.Title level={3}>Applied</Typography.Title>}
							key={2}>
							{student === null || (
								<AppliedProfilesTable props={{ updatePaymentInfo, student }} />
							)}
						</Tabs.TabPane>
					</Tabs>
					<Drawer
						closable={false}
						maskClosable={true}
						width={300}
						visible={menuVisible}
						mask={!screen.md}
						style={{ marginTop: headerHeight - 24 }}>
						{student === null || (
							<StudentMenu
								student={student}
								paymentDone={student?.paymentDetails?.captured}
								updateResume={updateResume}
							/>
						)}
					</Drawer>
				</div>
			</Content>
		</>
	);
};

export default StudentDashboard;
