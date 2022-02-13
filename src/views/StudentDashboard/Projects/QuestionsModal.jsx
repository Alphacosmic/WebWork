import React from "react";
import { Form, Input, Typography, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import openAntdNotification from "../../../utils/openAntdNotification";
import axios from "../../../utils/_axios";

const Questions = ({ projectData, isVisible, closeModal }) => {
	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		try {
			await form.validateFields();
			const answers = Object.entries(values).map(([question, answer]) => ({
				question,
				answer,
			}));
			const res = await axios.post(`/student/apply/project`, {
				projectID: projectData.projectID,
				answers,
			});
			const { studentID } = res.data;
			// dispatch(updateProjectSuccess({ studentID, projectID, status: "APPLIED" }));
			closeModal();
		} catch (err) {
			console.log(err);
			openAntdNotification(
				"error",
				"An error occured in applying",
				err?.response?.data?.msg ?? err.message
			);
		}
	};

	return (
		<Modal
			title={
				<>
					<EditOutlined /> Application Questionnaire
				</>
			}
			bodyStyle={{
				maxHeight: 600,
				overflowY: "scroll",
			}}
			visible={isVisible}
			onCancel={closeModal}
			okText="Submit"
			onOk={form.submit}
			width={900}>
			<Form onFinish={handleSubmit} form={form} layout="vertical" style={{ margin: 0 }}>
				<Typography.Text type="secondary">
					The following questions are mandatory to fill in order to apply to projects by
					professors. Please note that if you log out or reload the page, these answers
					will be lost. We recommend writing them somewhere else and then pasting them
					here.
				</Typography.Text>
				{projectData?.questions?.map((question) => (
					<Form.Item
						key={question}
						name={question}
						label={question}
						validateFirst
						rules={[
							{
								required: true,
								message: "Please answer this question",
								transform: (val) => (!val ? "" : val.trim()),
							},
							{
								validator: (rule, value) => {
									if (value === undefined) {
										return Promise.resolve();
									}
									if (value.split(/\s+/).length < 20) {
										return Promise.reject(
											new Error("Must be more than 20 words")
										);
									}
									return Promise.resolve();
								},
							},
						]}>
						<Input.TextArea
							autoSize={{ minRows: 3 }}
							rows={3}
							placeholder="Questions for students"
						/>
					</Form.Item>
				))}
			</Form>
		</Modal>
	);
};

export default Questions;
