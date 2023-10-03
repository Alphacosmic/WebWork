import React from "react";
import { Typography, Button, Modal, Result, Popconfirm } from "antd";
import { WarningOutlined, SmileOutlined } from "@ant-design/icons";
import loadScript from "../../utils/loadScript";
import openNotification from "../../utils/openAntdNotification";
import axios from "../../utils/_axios";
const { Title } = Typography;

const PaymentPrompt = (props) => {
	const { updatePaymentInfo, student } = props.props;
	const studentData = JSON.parse(localStorage.studentData || "{}");
	async function handlePayment() {
		const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

		if (!res) {
			openNotification(
				"error",
				"Payment handler failed to load.",
				"Retry later or contact us if this issue persists."
			);
			return;
		}
		try {
			const res = await axios.get("/order/create");
			const orderOptions = res.data;

			const finalOrderOptions = {
				...orderOptions,
				prefill: {
					name: studentData.name,
					email: studentData.email,
					contact: studentData.phone,
				},

				handler: async function (response) {
					const paymentID = response.razorpay_payment_id;
					if (!paymentID) {
						openNotification("error", "Payment failed");
						return;
					}
					try {
						await axios.put("/order/place", { paymentID });
						Modal.success({
							content: (
								<Result
									icon={<SmileOutlined />}
									title="Yay!"
									subTitle="You have successfully made the payment. Thank you for registering for InternFair."
								/>
							),
							centered: true,
							maskClosable: false,
							keyboard: false,
							okButtonProps: {
								onClick: () => {
									window.location.reload();
								},
							},
							okText: "Ok",
						});
						updatePaymentInfo(paymentID);
					} catch (error) {
						console.log(error);
						openNotification(
							"error",
							"Error occurred in Registering. Contact us if money was deducted from your account."
						);
					}
				},
				theme: { color: "#222222" },
			};
			const paymentObject = new window.Razorpay(finalOrderOptions);
			paymentObject.open();
		} catch (err) {
			console.log(err);
			openNotification("error", "An error occurred in generating your order.");
		}
	}
	return (
		<div style={{ textAlign: "center" }}>
			<WarningOutlined style={{ fontSize: "3rem", marginBottom: "1rem" }} />
			<Title level={3} type="secondary" style={{ marginBottom: 0 }}>
				You have not made the payment for E-Cell Internfair.
				{/* We have stopped accepting new payments. */}
			</Title>
			<Title level={4} type="secondary" style={{ marginTop: 0, opacity: "50%" }}>
				{/* Payments have stopped for this session of InternFair */}
				Please do so to access companies.
				{/* Payments starting soon. */}
			</Title>
			<Popconfirm
				disabled={true}
				title={
					<>
						<span>
							Internfair is only open to the following students. <br /> Please keep
							this in mind before making a payment.
						</span>
						<br />
						<br />
						<strong>B.Tech.: All</strong>
						<br />
						<strong>Dual Degree: All</strong>
						<br />
						<strong>Integrated HS: upto 2022</strong>
					</>
				}
				onConfirm={handlePayment}>
				<Button
					// disabled={!(studentData.roll.toLowerCase() === "rp22t222")}
					// disabled={
					// 	student.roll.slice(2, 4) === "19" &&
					// 	!/^be|bs|ed|ph/i.test(student.roll) &&
					// 	student.iddd === "None"
					// }
					disabled={true}
					size="large"
					type="primary">
					Pay ₹399/-
				</Button>
			</Popconfirm>
		</div>
	);
};
export default PaymentPrompt;
