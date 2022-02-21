import { Table } from "antd";
import React from "react";

function AppliedProfileTable({ columns, profiles }) {
	return <Table columns={columns} dataSource={profiles} />;
}

export default AppliedProfileTable;
