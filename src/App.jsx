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
			<Router base="/teamup/student">
				<Layout>
					<Switch>
						<Route
							exact
							path="/login"
							component={() => {
								if (getCookieToken() == "student") {
									return <Redirect to="/dashboard" />;
								} else {
									return <Login />;
								}
							}}
						/>
						<Route
							exact
							path="/register"
							component={() => {
								if (getCookieToken()) {
									return <Redirect to="/dashboard" />;
								} else {
									return <RegisterForm />;
								}
							}}
						/>
						<Route
							exact
							path="/dashboard"
							component={() => {
								if (getCookieToken()) {
									return <StudentDashboard />;
								} else {
									return <Redirect to="/login" />;
								}
							}}
							redirectTo="/login"
						/>
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
				]}
			/>
		</Layout>
	);
}

export default App;
