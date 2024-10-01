import React, { useContext } from "react";
import { Typography, Modal, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ThemeContext } from "../../utils/styles";
const RulesModal = ({ isVisible, closeModal }) => {
	const { darkMode } = useContext(ThemeContext);
	const headingStyle = darkMode
		? { fontSize: "1.75rem", color: "#d1d1d6" }
		: { fontSize: "1.75rem" };
	const subHeadingStyle = darkMode ? { margin: "auto", color: "#d1d1d6" } : { margin: "auto" };
	return (
		<div style={darkMode ? { background: "#2c2c22" } : {}}>
			<Modal
				closable={false}
				title={
					<>
						<EditOutlined style={headingStyle} />{" "}
						<span style={headingStyle}>Rules & Instructions</span>
					</>
				}
				bodyStyle={{
					maxHeight: 600,
					overflowY: "scroll",
					backgroundColor: darkMode ? "#2c2c2e" : "#fff", // Dark mode background color for modal body
					color: darkMode ? "#d1d1d6" : "#000", // Dark mode text color for modal content
					padding: 0, // Ensure proper padding so content isn't cramped
					margin: 0,
				}}
				open={isVisible}
				onCancel={closeModal}
				cancelText={null}
				footer={
					<Button type="primary" size="large" shape="round" onClick={closeModal}>
						Close
					</Button>
				}
				width={900}
				styles={{
					content: { backgroundColor: darkMode ? "#2c2c2e" : "" },
					body: {
						maxHeight: 600,
						overflowY: "scroll",
						backgroundColor: darkMode ? "#2c2c2e" : "#fff",
						color: darkMode ? "#d1d1d6" : "#000",
						padding: 0,
						margin: 0,
					},
					header: { background: darkMode ? "#2c2c2e" : "" },
				}}
				maskStyle={{
					backgroundColor: darkMode ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.85)", // Dark mode for modal overlay (dimmed background)
					backdropFilter: "blur(2px)",
				}}
			>
				<div style={darkMode ? { color: "#d2d2d6" } : {}}>
					<Typography.Title level={4} style={subHeadingStyle}>
						Student Policies
					</Typography.Title>
					<ul>
						<li>
							Students can apply to a maximum of <b>seven</b> profiles. If you apply
							for more profiles, your account will be permanently blocked. The
							registration fee will not be refunded in such a case.
						</li>
						<li>
							Students must provide accurate information at the time of application or
							while creating the account on the InternFair portal. Any
							misrepresentation of information or hiding information will result in
							blacklisting.
						</li>

						<li>
							Students should <b>not</b> mention contact details in their resume. If
							found, your account will be permanently blocked. The registration fee
							will not be refunded in such a case.
						</li>
						<li>
							The fee is non-refundable and E-Cell IIT Madras will not be responsible
							for any unexpected error during the payment process, the concerned
							payment services should be contacted for that.
						</li>
						<li>
							The student has to show up for all the interviews/tests he/she is
							shortlisted for. If it is not possible to show up, it should be informed
							at least 36 hours in advance. Failure to do so will lead to
							blacklisting.
						</li>
						<li>
							If a student gets multiple offers, he/she can accept only one offer. In
							case only a single offer is received, the student is bound to accept the
							offer.
						</li>
						<li>
							Once a student has accepted an internship from a company, they cannot
							reject the offer.
						</li>
						<li>
							It is your responsibility to carry all documents which will be needed
							during the interview.
						</li>
						<li>
							A student applying through InternFair would not be allowed to approach
							the registered companies outside the portal.
						</li>
						<li>
							Any breach of the above rules will result in permanent blacklisting of
							the student.
						</li>
					</ul>
				</div>
			</Modal>
		</div>
	);
};

export default RulesModal;
