import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const history = useHistory();

	const handleLogin = (e) => {
		e.preventDefault();
		// Mock authentication (you can replace this with real auth logic later)
		if (username === "user" && password === "password") {
			history.push("/"); // Redirect to the home page on successful login
		} else {
			setError("Invalid username or password");
		}
	};

	return (
		<div className="login-container">
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p className="error">{error}</p>}
				<button type="submit">Login</button>
			</form>
			<p>
				Dont have an account? <a href="/register">Register</a>
			</p>
		</div>
	);
};

export default Login;
