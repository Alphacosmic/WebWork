import { Table } from "antd";
import React from "react";
import "./AppliedProfileTableStyles.css";

function AppliedProfileTable({ columns, profiles }) {
	return <Table rowKey={"_id"} columns={columns} dataSource={profiles} className="your-table" />;
}

export default AppliedProfileTable;
