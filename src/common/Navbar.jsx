import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="navbar">
			<Link to="/">Home</Link>
			<Link to="/properties">Properties</Link>
			<Link to="/login">Login</Link>
			<Link to="/register">Register</Link>
		</nav>
	);
};

export default Navbar;
