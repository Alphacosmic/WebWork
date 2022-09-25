import React from "react";
import { Typography, Modal, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
//
const RulesModal = ({ isVisible, closeModal }) => {
	return (
		<Modal
			title={
				<>
					<EditOutlined /> Rules & Instructions
				</>
			}
			bodyStyle={{
				maxHeight: 600,
				overflowY: "scroll",
			}}
			visible={isVisible}
			onCancel={closeModal}
			cancelText={null}
			footer={<Button onClick={closeModal}>Close</Button>}
			width={900}>
			<div>
				<Typography.Title level={4}>Student Policies</Typography.Title>
				<ul>
					<li>
						Students can apply to a maximum of <b>ten</b> profiles. If you apply for
						more profiles, your account will be permanently blocked. The registration
						fee will not be refunded in such a case.
					</li>
					<li>
						Students must provide accurate information at the time of application or
						while creating the account on the InternFair portal. Any misrepresentation
						of information or hiding information will result in blacklisting.
					</li>

					<li>
						Students should <b>not</b> mention contact details in their resume. If
						found, your account will be permanently blocked. The registration fee will
						not be refunded in such a case.
					</li>
					<li>
						The fee is non-refundable and E-Cell IIT Madras will not be responsible for
						any unexpected error during the payment process, the concerned payment
						services should be contacted for that.
					</li>
					<li>
						The student has to show up for all the interviews/tests he/she is
						shortlisted for. If it is not possible to show up, it should be informed at
						least 36 hours in advance. Failure to do so will lead to blacklisting.
					</li>
					<li>
						If a student gets multiple offers, he/she can accept only one offer. In case
						only a single offer is received, the student is bound to accept the offer.
					</li>
					<li>
						Once a student has accepted an internship from a company, they cannot reject
						the offer.
					</li>
					<li>
						It is your responsibility to carry all documents which will be needed during
						the interview.
					</li>
					<li>
						A student applying through InternFair would not be allowed to approach the
						registered companies outside the portal.
					</li>
					<li>
						Any breach of the above rules will result in permanent blacklisting of the
						student.
					</li>
				</ul>
			</div>
		</Modal>
	);
};

export default RulesModal;
