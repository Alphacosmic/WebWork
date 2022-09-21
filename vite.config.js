import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/internfair/student/",
	server: {
		port: 3030,
		host: true,
	},
});
