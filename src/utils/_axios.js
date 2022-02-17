import Axios from "axios";
const baseURL = import.meta.env.PROD
	? "https://ecell.iitm.ac.in/internfair-api/student"
	: "http://localhost:5300/internfair-api/student";
const axios = Axios.create({
	baseURL,
	withCredentials: true,
});

export default axios;
