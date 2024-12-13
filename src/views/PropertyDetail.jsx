import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PropertyDetail = () => {
	const { id } = useParams();
	const [property, setProperty] = useState(null);

	useEffect(() => {
		// This would ideally be an API call to get property details
		const mockProperty = {
			id,
			name: "Beach House",
			location: "California",
			price: 500000,
			description: "A beautiful beach house with ocean views.",
			amenities: ["Pool", "Garage", "Fireplace"],
			images: [
				"https://via.placeholder.com/600x400/0000FF/808080?Text=Property+Image+1",
				"https://via.placeholder.com/600x400/008000/FFFFFF?Text=Property+Image+2",
				"https://via.placeholder.com/600x400/FF0000/FFFFFF?Text=Property+Image+3",
			],
			contact: {
				name: "John Doe",
				phone: "+1 234 567 890",
			},
			similarProperties: [
				{ id: 2, name: "Mountain Cabin", price: 300000 },
				{ id: 3, name: "City Apartment", price: 750000 },
			],
		};
		setProperty(mockProperty);
	}, [id]);

	if (!property) return <p>Loading...</p>;

	return (
		<div className="property-detail">
			<h1>{property.name}</h1>
			<p>{property.location}</p>
			<p>Price: ${property.price}</p>
			<p>{property.description}</p>

			<div className="property-images">
				{property.images.map((image, idx) => (
					<img key={idx} src={image} alt={`Property ${idx + 1}`} />
				))}
			</div>

			<h3>Amenities:</h3>
			<ul>
				{property.amenities.map((amenity, idx) => (
					<li key={idx}>{amenity}</li>
				))}
			</ul>

			<h3>Contact Information:</h3>
			<p>Contact: {property.contact.name}</p>
			<p>Phone: {property.contact.phone}</p>
			<button className="contact-button">Contact Seller</button>

			<h3>Similar Properties:</h3>
			<div className="similar-properties">
				{property.similarProperties.map((similar) => (
					<div key={similar.id} className="similar-property-card">
						<h4>{similar.name}</h4>
						<p>Price: ${similar.price}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default PropertyDetail;
