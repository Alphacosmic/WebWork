import React from "react";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer-content">
				<p>&copy; 2024 Property Listing Website. All rights reserved.</p>
				<p>
					<a href="/privacy-policy">Privacy Policy</a> |{" "}
					<a href="/terms">Terms of Service</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
