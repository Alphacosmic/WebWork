import React, { useState, useEffect, useLayoutEffect } from "react";
import "./StudentDashboard.css";
import StudentMenu from "./StudentMenu";
import { Layout, Typography, Drawer, Tabs, Button, Popover, Radio, Space, Divider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import Header from "./Header";
import Projects from "./Projects";
// const ProjectTable = React.lazy(() => import("./Projects/ProjectTable"));
import ProfileCards from "./Profiles";
// import ProfileTable from "./Profiles/ProfileTable";
import RulesModal from "./RulesModal";

const { Content } = Layout;
const ALL = "ALL";
// const APPLIED = "APPLIED";
// const SELECTED = "SELECTED";
// const REJECTED = "REJECTED";

const StudentDashboard = () => {
	const [headerHeight, setHeaderHeight] = useState(0);
	const screen = useBreakpoint();
	const [menuVisibile, setMenuVisibility] = useState(false);
	const [rulesModalVisible, setRulesModalVisible] = useState(false);
	const [statusFilter, setStatusFilter] = useState(ALL);
	const [displayType, setDisplayType] = useState(() => localStorage.displayType || "grid");
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

	const Settings = (
		<Space>
			<Button
				type="link"
				onClick={() => setRulesModalVisible(true)}
				icon={<InfoCircleOutlined />}>
				Rules
			</Button>

			<Divider type="vertical" />

			{/* {screen.md && (
				<>
					<Radio.Group
						buttonStyle="solid"
						value={displayType}
						onChange={(e) => {
							setDisplayType(e.target.value);
							localStorage.displayType = e.target.value;
						}}>
						<Radio.Button value="table">Table</Radio.Button>
						<Radio.Button value="grid">Grid</Radio.Button>
					</Radio.Group>
					<Divider type="vertical" />
				</>
			)} */}
			{/* <Popover
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
								<Radio value={APPLIED}>Applied</Radio>
								<Radio value={SELECTED}>Selected</Radio>
								<Radio value={REJECTED}>Rejected</Radio>
							</Space>
						</Radio.Group>
						<Divider />
						<Button onClick={() => setStatusFilter(ALL)}>Clear Filters</Button>
					</>
				}>
				<Button>Filters</Button>
			</Popover> */}
		</Space>
	);

	return (
		<>
			<Header menuVisibile={menuVisibile} setMenuVisibility={setMenuVisibility} />
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
						defaultActiveKey={localStorage.type || 1}
						tabBarExtraContent={screen.md && Settings}>
						<Tabs.TabPane
							tab={<Typography.Title level={3}>All</Typography.Title>}
							key={1}>
							{/* {displayType === "grid" ? (
								<Projects filter={statusFilter} />
							) : (
								<React.Suspense fallback="Loading Table">
									<ProjectTable filter={statusFilter} />
								</React.Suspense>
							)} */}
							<Projects filter={statusFilter} />
						</Tabs.TabPane>
						<Tabs.TabPane
							tab={<Typography.Title level={3}>Applied</Typography.Title>}
							key={2}>
							{/* {displayType === "grid" ? (
								<ProfileCards filter={statusFilter} />
							) : (
								<React.Suspense fallback="Loading Table">
									<ProfileTable filter={statusFilter} />
								</React.Suspense>
							)} */}
							<ProfileCards filter={statusFilter} />
						</Tabs.TabPane>
					</Tabs>
					<Drawer
						closable={false}
						maskClosable={true}
						width={300}
						visible={menuVisibile}
						mask={!screen.md}
						style={{ marginTop: headerHeight - 24 }}>
						<StudentMenu />
					</Drawer>
				</div>
			</Content>
		</>
	);
};

export default StudentDashboard;
