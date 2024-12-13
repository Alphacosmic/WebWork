import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="home-container">
			<h1>Welcome to the Property Listing Website</h1>
			<p>Find your dream property or list your own!</p>
			<Link to="/properties">View Properties</Link>
			<Link to="/add-property">Add a Property</Link>
		</div>
	);
};

export default Home;
