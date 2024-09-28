import { Table } from "antd";
import React, { useEffect, useContext } from "react";
import "./AppliedProfileTableStyles.css";
import { ThemeContext } from "../../../utils/styles";

function AppliedProfileTable({ columns, profiles }) {
	const { darkMode } = useContext(ThemeContext);
	const rowStyle = darkMode
		? { backgroundColor: "#1c1c1e", color: "#f5f5f7" }
		: { backgroundColor: "#fff", color: "#000" };

	const headerStyle = darkMode
		? { backgroundColor: "#333", color: "#fff" }
		: { backgroundColor: "#f0f0f0", color: "#000" };

	const cellStyle = darkMode
		? { backgroundColor: "#2c2c2e", color: "#f5f5f7" }
		: { backgroundColor: "#fff", color: "#000" };
	const components = {
		header: {
			cell: (props) => (
				<th {...props} style={{ ...headerStyle, ...props.style }}>
					{props.children}
				</th>
			),
		},
		body: {
			row: (props) => (
				<tr {...props} style={{ ...rowStyle, ...props.style }}>
					{props.children}
				</tr>
			),
			cell: (props) => (
				<td {...props} style={{ ...cellStyle, ...props.style }}>
					{props.children}
				</td>
			),
		},
	};

	return (
		<div>
			<Table
				pagination={false}
				rowKey={"_id"}
				columns={columns}
				dataSource={profiles}
				className="your-table"
				components={components}
			/>
		</div>
	);
}

export default AppliedProfileTable;
