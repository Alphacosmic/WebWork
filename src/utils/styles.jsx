import React, { createContext, useState } from "react";

// Create the context
export const ThemeContext = createContext();

// Create a Provider component to share the state
export const ThemeProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(true);

	// Function to toggle dark mode
	const toggleDarkMode = () => {
		setDarkMode((prevMode) => !prevMode);
	};

	return (
		<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
};
