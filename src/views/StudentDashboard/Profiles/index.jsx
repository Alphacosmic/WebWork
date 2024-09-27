import React, { Suspense, useEffect, useState } from "react";
import { Grid, Row, Col, Popover } from "antd";
import { CalendarOutlined, WhatsAppOutlined } from "@ant-design/icons";
import axios from "../../../utils/_axios";
import PaymentPrompt from "../PaymentPrompt";
const AppliedProfileCard = React.lazy(() => import("./AppliedProfileCard"));
const AppliedProfileTable = React.lazy(() => import("./AppliedProfileTable"));
import openNotification from "../../../utils/openAntdNotification";
import numberWithCommas from "../../../utils/numberWithCommas";
import InterviewModal from "./InterviewModal";
const { useBreakpoint } = Grid;

const ROUNDS = ["RESUME", "TEST", "GROUP_DISCUSSION", "INTERVIEW", "OFFER"];

const BLACKLISTED_COMPANIES = [
	"Rackbank Datacenters",
	"ZECH INNOVATION",
	"SalaryBox",
	"Periwinkle Technologies Pvt Ltd",
	"SEASHORE TECHNOLOGIES PTE. LTD.",
	"Automaxis",
	"Avaz Inc",
	"mewt account private limited",
	"Institute of Diabetes Endocrinology And Adiposity Private Limited",
	"Lokaci",
	"The Impactional Games",
	"Kabra Global Products Pvt Ltd",
	"Pacify Medical Technologies Private Limited",
	"Spoonshot",
	"BIOWAVE TECHNOLOGY",
];

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
											item.profile.rounds.indexOf(item.round) ||
									  BLACKLISTED_COMPANIES.includes(item.profile.company.name)
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
					if (profile.currentRound === "OFFER") {
						let status = profile.OFFER;
						delete profile.OFFER;
						let [applicant] = profile.applicants.filter((applicant) => {
							return applicant.applicant === student._id;
						});
						//console.log(applicant);
						profile.OFFER = {
							status,
							offerLetter: applicant.offerLetter,
						};
					}
					return profile;
				});
				//console.log(formattedData);

				setProfiles(formattedData);
			})
			.catch((err) => {
				if (err?.response?.data === "PAYMENT_NOT_DONE") {
					setPaymentDone(false);
				}
				console.debug(err.response);
			});
	}, []);

	// if (!paymentDone) {
	// 	return <PaymentPrompt props={{ updatePaymentInfo, student }} />;
	// }

	const deregister = (id) => {
		//console.log(id);
		axios
			.put("/deregister", { profileId: id })
			.then((res) => {
				//console.log(res.data);
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
			dataIndex: ["RESUME"],
			render: (tag, profile) => (
				<>
					<span style={{ color: "#1890FF" }}>{tag}</span>
					<br />
					{tag === "Yes" || tag === "N/A" ? (
						profile.whatsappLink === "" ? (
							<></>
						) : (
							<Popover
								content={
									<div>Join the WhatsApp group for further communication.</div>
								}>
								<span
									onClick={() =>
										window.open(profile.whatsappLink, "_blank").focus()
									}
									style={{ cursor: "pointer", color: "#1890FF" }}>
									<WhatsAppOutlined /> Join
								</span>
							</Popover>
						)
					) : (
						<div></div>
					)}
				</>
			),
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
			render: (interview, profile) => (
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<span style={{ color: "#1890FF" }}>{interview.status || "-"}</span>
					{interview.status === "-" &&
						(profile.interview ? (
							<CalendarOutlined
								style={{ fontSize: "15px", color: "#1890FF" }}
								onClick={(e) => {
									e.preventDefault();
									setInterviewID(interview.profileID);
									openSchedulingModal();
								}}
							/>
						) : (
							<></>
						))}
				</div>
			),
		},
		{
			title: "Offer SL",
			dataIndex: "OFFER",
			render: (offer) => (
				<span style={{ color: "#1890FF" }}>
					{offer === "-" && <span style={{ color: "#1890FF" }}>-</span>}
					{offer.status === "No" && <span style={{ color: "#1890FF" }}>No</span>}
					{offer.status === "Yes" && (
						<a href={offer.offerLetter} target="_blank" rel="noreferrer">
							Offer Letter
						</a>
					)}
				</span>
			),
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
					props={{
						isModalOpen,
						handleOk,
						handleCancel,
						interviewID,
						student,
					}}
				/>
			)}
		</div>
	);
};

export default AppliedProfilesTable;
