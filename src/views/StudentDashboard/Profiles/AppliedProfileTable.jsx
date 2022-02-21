import { Table } from "antd";
import React from "react";

function AppliedProfileTable({ columns, profiles, onChange }) {
	return <Table columns={columns} dataSource={profiles} onChange={onChange} />;
}

export default AppliedProfileTable;
