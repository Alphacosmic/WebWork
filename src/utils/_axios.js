import Axios from "axios";
const baseURL =
	// eslint-disable-next-line no-undef
	process.env.NODE_ENV === "development"
		? "http://localhost:5000/data/teamup"
		: "https://ecell.iitm.ac.in/data/teamup";
const axios = Axios.create({
	baseURL,
	withCredentials: true,
});

export default axios;
