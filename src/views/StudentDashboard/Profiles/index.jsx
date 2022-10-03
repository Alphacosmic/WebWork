import React, { Suspense, useEffect, useState } from "react";
import { Grid, Row, Col, Button, Popconfirm } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import axios from "../../../utils/_axios";
import PaymentPrompt from "../PaymentPrompt";
import InterviewScheduler from "./InterviewScheduler";
const AppliedProfileCard = React.lazy(() => import("./AppliedProfileCard"));
const AppliedProfileTable = React.lazy(() => import("./AppliedProfileTable"));
import openNotification from "../../../utils/openAntdNotification";
import numberWithCommas from "../../../utils/numberWithCommas";
import InterviewModal from "./InterviewModal";
const { useBreakpoint } = Grid;

const ROUNDS = ["RESUME", "TEST", "GROUP_DISCUSSION", "INTERVIEW", "OFFER"];

const AppliedProfilesTable = (props) => {
	const { updatePaymentInfo, student } = props.props;
	const screen = useBreakpoint();

	const [profiles, setProfiles] = useState([]);
	const [paymentDone, setPaymentDone] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [interviewID, setInterviewID] = useState(null);
	// const [calendarColor, setCalendarColor] = useState("#1890FF");

	useEffect(() => {
		axios
			.get("/getAppliedProfiles")
			.then((res) => {
				let formattedData = res.data.appliedProfiles.map((item) => ({
					...item.profile,
					studentCurrentRound: item.round,
					...ROUNDS.reduce(
						(previous, current) => ({
							...previous,
							[current]: item.profile.rounds.includes(current)
								? item.profile.currentRound === "OFFER" && item.round === "OFFER"
									? "Yes"
									: item.profile.rounds.indexOf(item.profile.currentRound) >
											item.profile.rounds.indexOf(current) &&
									  item.profile.rounds.indexOf(current) <
											item.profile.rounds.indexOf(item.round)
									? "Yes"
									: item.profile.rounds.indexOf(item.profile.currentRound) >
									  item.profile.rounds.indexOf(item.round)
									? "No"
									: "-"
								: "N/A",
						}),
						{}
					),
				}));
				formattedData = formattedData.map((profile) => {
					if (profile.currentRound === "INTERVIEW") {
						let status = profile.INTERVIEW;
						delete profile.INTERVIEW;
						profile.INTERVIEW = {
							status,
							profileID: profile._id,
						};
					}
					return profile;
				});

				setProfiles(formattedData);
			})
			.catch((err) => {
				if (err?.response?.data === "PAYMENT_NOT_DONE") {
					setPaymentDone(false);
				}
				console.debug(err.response);
			});
	}, []);

	if (!paymentDone) {
		return <PaymentPrompt updatePaymentInfo={updatePaymentInfo} />;
	}

	const deregister = (id) => {
		console.log(id);
		axios
			.put("/deregister", { profileId: id })
			.then((res) => {
				console.log(res.data);
				setProfiles((old) => old.filter((item) => item._id !== res.data.profile._id));
				openNotification(
					"success",
					`You have succesfully deregistered from ${res.data.profile.title}`
				);
			})
			.catch((err) => {
				window.alert("Some Error occured");
				console.debug(err.response);
			});
	};

	const openSchedulingModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
		setInterviewID(null);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setInterviewID(null);
	};

	const columns = [
		{
			title: "Company Name",
			dataIndex: ["company", "name"],
		},

		{
			title: "Job Desc",
			dataIndex: "jobDescriptionURL",
			render: (tag) => (
				<span
					onClick={() => window.open(tag, "_blank").focus()}
					style={{ cursor: "pointer", color: "#1890FF" }}>
					Open
				</span>
			),
		},
		{
			title: "Stipend ( /Month)",
			dataIndex: "stipend",
			render: (stipend) => {
				return (
					<>
						<span>{stipend?.currency}</span>{" "}
						{stipend?.range?.length === 2 ? (
							<span>
								{numberWithCommas(stipend.range[0])} -{" "}
								{numberWithCommas(stipend.range[1])}{" "}
							</span>
						) : stipend.amount ? (
							<>{stipend?.amount}</>
						) : (
							"Unpaid"
						)}
					</>
				);
			},
		},
		{
			title: "Profile Name",
			dataIndex: "title",
		},
		{
			title: "Resume SL",
			dataIndex: "RESUME",
			render: (tag) => <span style={{ color: "#1890FF" }}>{tag}</span>,
		},
		{
			title: "Test SL",
			dataIndex: "TEST",
			render: (tag) => <span style={{ color: "#1890FF" }}>{tag}</span>,
		},
		{
			title: "Group Discussion SL",
			dataIndex: "GROUP_DISCUSSION",
			render: (tag) => <span style={{ color: "#1890FF" }}>{tag}</span>,
		},
		{
			title: "Interview SL",
			dataIndex: "INTERVIEW",
			render: (interview) => (
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<span style={{ color: "#1890FF" }}>{interview.status || "-"}</span>
					{interview.status === "-" && (
						<CalendarOutlined
							style={{ fontSize: "15px", color: "#1890FF" }}
							onClick={(e) => {
								e.preventDefault();
								setInterviewID(interview.profileID);
								openSchedulingModal();
							}}
						/>
					)}
				</div>
			),
		},
		{
			title: "Offer SL",
			dataIndex: "OFFER",
			render: (tag) => <span style={{ color: "#1890FF" }}>{tag}</span>,
		},
	];

	return (
		<div>
			<Suspense fallback="">
				{screen.xs ? (
					<Row justify="center">
						{profiles.map((profile, index) => (
							<Col key={index} xs={24}>
								<AppliedProfileCard deregister={deregister} profile={profile} />
							</Col>
						))}
					</Row>
				) : (
					<AppliedProfileTable columns={columns} profiles={profiles} />
				)}
			</Suspense>
			{interviewID !== null && (
				<InterviewModal
					props={{ isModalOpen, handleOk, handleCancel, interviewID, student }}
				/>
			)}
		</div>
	);
};

export default AppliedProfilesTable;
