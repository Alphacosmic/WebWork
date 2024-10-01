import React, { useRef, useState, useEffect, useLayoutEffect, useContext } from "react";
import "./StudentDashboard.css";
import StudentMenu from "./StudentMenu";
import {
	Layout,
	Typography,
	Drawer,
	Tabs,
	Button,
	Space,
	Divider,
	Popover,
	Radio,
	Alert,
	Select,
	Progress,
	Modal,
	Tooltip,
	Tour,
} from "antd";
import { ThemeContext } from "../../utils/styles";
import {
	InfoCircleOutlined,
	ArrowDownOutlined,
	ArrowUpOutlined,
	QuestionOutlined,
} from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import Header from "./Header";
import AllProfiles from "./Projects";
import AppliedProfilesTable from "./Profiles";
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
	FILTEROPTIONS,
	PrimaryText,
} from "../../utils/constants";
import { QuestionAnswer } from "@mui/icons-material";

const { Content } = Layout;
const options = [];

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
	const [closeIdea, setcloseIdea] = useState(false);
	const [Selected, SetSelected] = useState(null);
	// for filtering
	const [FieldFilter, setFieldfilter] = useState([]);
	const ref1 = useRef(null);
	const ref2 = useRef(null);
	const ref3 = useRef(null);
	const ref4 = useRef(null);

	const [open, setOpen] = useState(false);
	const { xs } = useBreakpoint();
	const steps = [
		{
			title: "This is how you sort profiles",
			target: () => ref1.current,
		},
		{
			title: "options for filtering profiles",
			target: () => ref3.current,
		},
		{
			title: "This shows No. of Profiles Applied to",
			target: () => ref2.current,
		},
	];
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
		setStudent((prevState) => ({
			...prevState,
			resumeURL: [...prevState.resumeURL, newResumeURL],
		}));
	};
	const handleField = (value) => {
		setFieldfilter(value);
		SetSelected(value);
	};

	const updatePaymentInfo = (paymentID) => {
		setStudent((prevState) => ({
			...prevState,
			paymentDetails: {
				paymentID,
				captured: true,
			},
		}));
	};

	const updateSkillTags = (skillvalues) => {
		setStudent((prevState) => ({
			...prevState,
			skillTags: skillvalues,
		}));
	};
	const { darkMode } = useContext(ThemeContext);

	const Settings = (
		<Space
			direction={{ xs: "vertical", md: "horizontal" }}
			align="center"
			justify="center"
			style={{ width: "100%", marginTop: "1rem" }} // Ensure the space takes full width
		>
			<Divider type="vertical" />
			<Button
				type="link"
				onClick={() => setRulesModalVisible(true)}
				icon={<InfoCircleOutlined style={{ fontSize: "1rem" }} />}
				style={darkMode ? { color: "#E5B8F4" } : ""}
			>
				Rules
			</Button>
			<Button
				onClick={() => {
					setOpen(true);
				}}
				type="primary"
				shape="round"
				size="large"
				icon={<QuestionOutlined />}
			></Button>
			<Popover
				style={{ marginRight: "0" }}
				trigger="click"
				placement="bottom"
				content={
					<>
						<Radio.Group
							value={statusFilter}
							onChange={(val) => {
								setStatusFilter(val.target.value);
							}}
						>
							<Space direction="vertical">
								<Radio.Button value={WFH}>WFH</Radio.Button>
							</Space>
						</Radio.Group>
						<Divider />
						<Select
							style={{
								minWidth: "50px",
								width: "100%",
								maxWidth: "10rem",
								marginBottom: "1rem",
							}}
							mode="multiple"
							placeholder="select the field"
							onChange={handleField}
							optionLabelProp="label"
							options={FILTEROPTIONS}
							allowClear
							value={Selected}
						/>
						<Button
							onClick={() => {
								setStatusFilter(ALL);
								handleField([]);
								SetSelected(null);
							}}
						>
							Clear Filters
						</Button>
					</>
				}
			>
				<Button type="primary" shape="round" size="large" ref={ref3}>
					Filters
				</Button>
			</Popover>

			<Popover
				trigger="click"
				placement="bottom"
				style={{
					marginLeft: "0",
				}}
				content={
					<>
						<Radio.Group
							value={statusSort}
							onChange={(val) => {
								setStatusSortOrder(NONE);
								setStatusSort(val.target.value);
							}}
						>
							<Space direction="vertical">
								<Radio value={STIPEND}>Stipend</Radio>
								{statusSort === STIPEND && (
									<Radio.Group
										value={statusSortOrder}
										onChange={(val) => {
											setStatusSortOrder(val.target.value);
										}}
									>
										<Space direction="vertical" style={{ marginLeft: "15px" }}>
											<Radio value={DESCENDING}>Descending</Radio>
											<Radio value={ASCENDING}>Ascending</Radio>
										</Space>
									</Radio.Group>
								)}
								<Radio
									disabled={!student?.paymentDetails?.captured}
									value={NUMBER_OF_APPLICANTS}
								>
									Number of applicants
								</Radio>
								{statusSort === NUMBER_OF_APPLICANTS && (
									<Radio.Group
										value={statusSortOrder}
										onChange={(val) => {
											setStatusSortOrder(val.target.value);
										}}
									>
										<Space direction="vertical" style={{ marginLeft: "15px" }}>
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
							}}
						>
							Clear Sorting
						</Button>
					</>
				}
			>
				<Button type="primary" shape="round" size="large" ref={ref1}>
					Sorting
				</Button>
			</Popover>
		</Space>
	);

	return (
		<div
			className="shit"
			style={
				darkMode
					? {
							backgroundColor: "#1c1c1e",
							minHeight: "100vh",
							minwidth: "110%",
							margin: "0",
							padding: "0",
					  }
					: {
							minHeight: "100vh",
							minwidth: "110%",
							margin: "0",
							padding: "0",
					  }
			}
		>
			<Header menuVisible={menuVisible} ref={ref4} setMenuVisibility={setMenuVisibility} />
			<RulesModal
				isVisible={rulesModalVisible}
				closeModal={() => setRulesModalVisible(false)}
			/>
			<Divider type="horizontal"></Divider>
			{student && (
				<div className="progress-bar">
					<Tooltip title="No. of Applied Profiles">
						<Progress
							percent={(student.appliedProfiles.length * 100) / 7}
							ref={ref2}
							format={() => (
								<span style={{ color: "#007aff" }}>
									{student.appliedProfiles.length}/7
								</span>
							)}
							style={{
								margin: "1.5em",

								width: "40%",
								minWidth: "90%",
								marginTop: "1rem",
								float: "middle",
								fontSize: "1.5rem",
								justifyContent: "center",
								borderRadius: "0.5rem",
								top: "20px",
								paddingLeft: "0.5rem",
							}}
							strokeColor="#007aff"
						/>
					</Tooltip>
				</div>
			)}
			<Content id="student-dashboard-content" style={{ marginTop: headerHeight }}>
				<div id="projects-table-container">
					{screen.xs && Settings}

					<Tabs
						size="large"
						style={{ overflow: "visible" }}
						onChange={(key) => (localStorage.type = key)}
						defaultActiveKey={localStorage.type || 0}
						tabBarExtraContent={screen.md && Settings}
					>
						<Tabs.TabPane
							tab={
								<Typography.Title
									level={3}
									style={darkMode ? { color: "#f5f5f7" } : ""}
								>
									All
								</Typography.Title>
							}
							key={1}
						>
							<AllProfiles
								props={{
									student,
									updatePaymentInfo,
									statusFilter,
									statusSort,
									statusSortOrder,
									FieldFilter,
								}}
							/>
						</Tabs.TabPane>
						<Tabs.TabPane
							tab={
								<Typography.Title
									level={3}
									style={darkMode ? { color: "#f5f5f7" } : ""}
								>
									Applied
								</Typography.Title>
							}
							key={2}
						>
							{student === null || (
								<AppliedProfilesTable props={{ updatePaymentInfo, student }} />
							)}
						</Tabs.TabPane>
					</Tabs>
					<Drawer
						closable={false}
						maskClosable={true}
						width={300}
						open={menuVisible}
						mask={!screen.md}
						style={{ marginTop: headerHeight - 24 }}
					>
						{student === null || (
							<StudentMenu
								student={student}
								updateSkillTags={updateSkillTags}
								paymentDone={student?.paymentDetails?.captured}
								updateResume={updateResume}
							/>
						)}
					</Drawer>
				</div>
			</Content>
			<Tour open={open} onClose={() => setOpen(false)} steps={steps} />
		</div>
	);
};

export default StudentDashboard;
