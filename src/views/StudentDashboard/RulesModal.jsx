import React from "react";
import { Typography, Modal, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

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
			onCancel={ closeModal }
			cancelText={ null }
			footer={<Button onClick={closeModal}>Close</Button>}
			width={900}>
			<div>
				<Typography.Title level={4}>StartUp profiles</Typography.Title>

				<p>
					You can apply to <b>any number of profiles</b> that you want.
				</p>
				<p>
					Once selected for a profile. You will have to accept that and all other
					applications (submitted to other profiles) will be removed automatically.
					Moreover, you won’t be able to apply for any other StartUp profiles till the
					next semester. (You would still be able to apply to Professor projects)
				</p>

				<Typography.Title level={4}>Professor projects</Typography.Title>

				<p>
					You can apply to <b>at most 2 projects</b>.
				</p>
				<p>
					Once selected for a project. You will have to accept that and the application
					submitted for the other project will be removed automatically. Moreover, you
					won’t be able to apply for any other professor projects till the next semester.
					(You would still be able to apply to StartUp profiles)
				</p>

				<Typography.Title level={4}>General Instructions</Typography.Title>

				<ul>
					<li>
						Once a student has been selected for the team, they cannot reject the offer,
						or else it will lead to the blacklisting of the student.
					</li>
					<li>
						Students must provide accurate information at the time of application or
						while creating the account on the TeamUp portal. Any misrepresentation of
						information or hiding information will result in blacklisting.
					</li>
					<li>
						There is no restriction on the resume format. You can use any format for
						your resume.
					</li>
					<li>Students must not mention contact details in their resumes.</li>
					<li>
						The student has to show up for all the interviews/tests he/she is
						shortlisted for. If it is not possible to show up, it should be informed at
						least 36 hours in advance. Failure to do so will lead to blacklisting.
					</li>
					<li>
						It is your responsibility to carry all documents which will be
						needed/demanded during the interview.
					</li>
					<li>
						Any breach of the above rules will result in the permanent blacklisting of
						the student.
					</li>
				</ul>
			</div>
		</Modal>
	);
};

export default RulesModal;
