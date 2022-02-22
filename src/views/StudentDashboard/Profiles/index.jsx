import React, { Suspense, useEffect, useState } from "react";
import { Grid, Row, Col } from "antd";

import axios from "../../../utils/_axios";
import PaymentPrompt from "../PaymentPrompt";
const AppliedProfileCard = React.lazy(() => import("./AppliedProfileCard"));
const AppliedProfileTable = React.lazy(() => import("./AppliedProfileTable"));

const { useBreakpoint } = Grid;

const ROUNDS = ["RESUME", "TEST", "GROUP_DISCUSSION", "INTERVIEW", "OFFER"];

const ProfileCards = () => {
	const screen = useBreakpoint();

	const [profiles, setProfiles] = useState([]);
	const [paymentDone, setPaymentDone] = useState(true);
	const [isFetching, setIsFetching] = useState(true);

	useEffect(() => {
		axios
			.get("/getAppliedProfiles")
			.then((res) => {
				const formattedData = res.data.appliedProfiles.map((item) => ({
					stipendWithCurrency:
						item.profile.stipend.currency + " " + item.profile.stipend.amount,
					...item.profile,
					studentCurrentRound: item.round,
					...ROUNDS.reduce((previous, current) => {
						return {
							...previous,
							[current]: item.profile.rounds.includes(current) ? "-" : "N/A",
						};
					}, {}),
				}));

				setProfiles(formattedData);
				setIsFetching(false);
			})
			.catch((err) => {
				if (err?.response?.data === "PAYMENT_NOT_DONE") {
					setPaymentDone(false);
					setIsFetching(false);
				}
				console.debug(err.response);
			});
	}, []);

	console.debug(paymentDone);
	if (!paymentDone) {
		return <PaymentPrompt />;
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

	const columns = [
		{
			title: "Company Name",
			dataIndex: ["company", "name"],
		},
		{
			title: "Stipend",
			dataIndex: "stipendWithCurrency",
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
			render: (tag) => <span style={{ color: "#1890FF" }}>{tag}</span>,
		},
		{
			title: "Offer SL",
			dataIndex: "OFFER",
			render: (tag) => <span style={{ color: "#1890FF" }}>{tag}</span>,
		},
	];

	return (
		<Suspense fallback="">
			{screen.xs ? (
				<Row justify="center">
					{profiles.map((profile, index) => (
						<Col key={index} xs={24}>
							<AppliedProfileCard profile={profile} />
						</Col>
					))}
				</Row>
			) : (
				<AppliedProfileTable columns={columns} profiles={profiles} />
			)}
		</Suspense>
	);
};

export default ProfileCards;
