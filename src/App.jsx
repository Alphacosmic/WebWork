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
						name: "Abhijit",
						whatsappNum: "+91 8895219514",
						profileURL: "https://github.com/abhijit-hota",
					},
					{
						name: "Ishaan",
						whatsappNum: "+91 9152363694",
						profileURL: "https://github.com/KlumsyKamikaze",
					},
					{
						name: "Madhav",
						whatsappNum: "+91 8156910582",
						profileURL: "https://github.com/GodOfCoding1",
					},
				]}
			/>
		</Layout>
	);
}

export default App;
