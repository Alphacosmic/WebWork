import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PropertyList = () => {
	const [properties, setProperties] = useState([]);

	useEffect(() => {
		// This would ideally be an API call to get the properties
		const mockProperties = [
			{ id: 1, name: "Beach House", location: "California", price: 500000 },
			{ id: 2, name: "Mountain Cabin", location: "Colorado", price: 300000 },
			{ id: 3, name: "City Apartment", location: "New York", price: 750000 },
		];
		setProperties(mockProperties);
	}, []);

	return (
		<div className="property-list">
			<h1>Property Listings</h1>
			<div className="property-grid">
				{properties.map((property) => (
					<div key={property.id} className="property-card">
						<Link to={`/properties/${property.id}`}>
							<h3>{property.name}</h3>
							<p>{property.location}</p>
							<p>Price: ${property.price}</p>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default PropertyList;
