const cleanTimeSlot = (timeSlot) => {
	let startTime = `${timeSlot.startTime.slice(0, 2)}:${timeSlot.startTime.slice(2)}`;
	let endTime = `${timeSlot.endTime.slice(0, 2)}:${timeSlot.endTime.slice(2)}`;
	return `${startTime}-${endTime}`;
};

export default cleanTimeSlot;
