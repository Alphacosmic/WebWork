import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/teamup/student/",
	server: {
		port: 3030,
	},
});
