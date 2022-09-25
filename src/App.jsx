import React from "react";
import { Router, Redirect, Route, Switch } from "wouter";
import { Layout } from "antd";

import "./App.css";
import StudentDashboard from "./views/StudentDashboard/StudentDashboard";
import Login from "./views/Login/Login";
import RegisterForm from "./views/RegisterForm/RegisterForm";
import ECellFooter from "./common/ECellFooter";
import getCookieToken from "./utils/getCookieToken";

function App() {
	return (
		<Layout className="App">
			<Router base="/internfair/student">
				<Layout>
					<Switch>
						<Route
							exact
							path="/login"
							component={() =>
								getCookieToken() === "student" ? (
									<Redirect to="/dashboard" />
								) : (
									<Login />
								)
							}
						/>
						<Route
							exact
							path="/register"
							component={() =>
								getCookieToken() === "student" ? (
									<Redirect to="/dashboard" />
								) : (
									<RegisterForm />
								)
							}
						/>
						<Route
							exact
							path="/dashboard"
							component={() =>
								getCookieToken() === "student" ? (
									<StudentDashboard />
								) : (
									<Redirect to="/login" />
								)
							}
						/>
						<Route path="/*" component={() => <Redirect to="/" />} />
					</Switch>
				</Layout>
			</Router>

			<ECellFooter
				developers={[
					{
						name: "Ishaan",
						whatsappNum: "+91 9152363694",
						profileURL: "https://github.com/KlumsyKamikaze",
					},
					{
						name: "Aditya",
						whatsappNum: "+91 9560667329",
						profileURL: "https://github.com/spartacus5329/",
					},
				]}
			/>
		</Layout>
	);
}

export default App;
