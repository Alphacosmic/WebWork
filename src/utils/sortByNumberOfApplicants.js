import { DESCENDING } from "./constants";

/**
 *
 * @param {array} profiles the profiles that the companies make
 * @param {('ASCENDING'|'DESCENGING'|'NONE')} order the order of sorting
 * @returns {array}
 */

const sortByNumberOfApplicants = (profiles, order) => {
	return [...profiles].sort((profile_1, profile_2) => {
		return order === DESCENDING
			? profile_2.applicants.length - profile_1.applicants.length
			: profile_1.applicants.length - profile_2.applicants.length;
	});
};

export default sortByNumberOfApplicants;
