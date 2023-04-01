const createValidRange = (date) => {
	const day = parseInt(date[0] + date[1]);
	const month = parseInt(date[2] + date[3]);
	const year = parseInt(date[4] + date[5] + date[6] + date[7]);

	return new Date(year, month, day);
};

export default createValidRange;
