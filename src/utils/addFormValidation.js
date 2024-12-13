export const validateForm = (formData) => {
	const errors = {};
	const { username, password, confirmPassword, email } = formData;

	// Check if fields are empty
	if (!username) errors.username = "Username is required.";
	if (!password) errors.password = "Password is required.";
	if (confirmPassword && password !== confirmPassword) {
		errors.confirmPassword = "Passwords do not match.";
	}
	if (email && !/\S+@\S+\.\S+/.test(email)) {
		errors.email = "Invalid email format.";
	}

	return errors;
};
