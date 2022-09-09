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
const { useBreakpoint } = Grid;

const ROUNDS = ["RESUME", "TEST", "GROUP_DISCUSSION", "INTERVIEW", "OFFER"];

const ProfilesTable = ({ updatePaymentInfo }) => {
	const screen = useBreakpoint();

	const [profiles, setProfiles] = useState([]);
	const [paymentDone, setPaymentDone] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		axios
			.get("/getAppliedProfiles")
			.then((res) => {
				console.log(res.data);
				const formattedData = res.data.appliedProfiles.map((item) => ({
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
	// const showConfirmation = (profileID, profileTitle, startup) => {
	// 	Modal.confirm({
	// 		title: (
	// 			<span>
	// 				Confirm your application <SmileOutlined />
	// 			</span>
	// 		),
	// 		icon: null,
	// 		content: (
	// 			<span>
	// 				You are applying for <strong>{profileTitle}</strong> at{" "}
	// 				<strong>{startup}</strong>. Your CV will be made accessible to the Startup.
	// 				<br />
	// 				<Text type="secondary">
	// 					Note that once applied, you cannot revert your action.
	// 				</Text>
	// 			</span>
	// 		),
	// 		onOk: async () => {
	// 			try {
	// 				await axios.post("/student/apply/profile", { profileID });
	// 				setProfiles((profiles) =>
	// 					profiles.map((profile) =>
	// 						profile._id !== profileID ? profile : { ...profile, status: "APPLIED" }
	// 					)
	// 				);
	// 				openAntdNotification(
	// 					"success",
	// 					`Successfully applied to profile: ${profileTitle}, ${startup}`,
	// 					<span>
	// 						Keep an eye on the <strong>Selected</strong> tab!
	// 					</span>
	// 				);
	// 			} catch (error) {
	// 				openAntdNotification(
	// 					"error",
	// 					"An error occured in applying",
	// 					error?.response?.data?.msg ?? error.message
	// 				);
	// 			}
	// 		},
	// 		centered: true,
	// 	});
	// };

	// const showAlertToUploadCV = () => {
	// 	Modal.info({
	// 		title: "Please upload your CV",
	// 		icon: <FileDoneOutlined />,
	// 		content:
	// 			"You need to upload your CV from the menu in order to apply to profiles by startups.",
	// 		centered: true,
	// 	});
	// };

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
		console.log("Reaching");
		setIsModalOpen(true);
	};

	const handleOk = () => {
		console.log("Reaching");
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		console.log("Reaching");
		setIsModalOpen(false);
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
			render: (tag) => (
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<span style={{ color: "#1890FF" }}>{tag}</span>
					<CalendarOutlined
						style={{ fontSize: "15px", color: "#1890FF" }}
						onClick={openSchedulingModal}
					/>
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
			<InterviewScheduler props={{ isModalOpen, handleOk, handleCancel }} />
		</div>
	);
};

export default ProfilesTable;
