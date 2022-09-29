const sortByNumberOfApplicants = (profiles, sort) => {
	return [...profiles].sort((profile_1, profile_2) => {
		return profile_2.applicants.length - profile_1.applicants.length;
	});
};

export default sortByNumberOfApplicants;
