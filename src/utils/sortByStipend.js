import { DESCENDING } from "./constants";

/**
 *
 * @param {array} profiles all profiles set by companies
 * @param {('DESCENDING'|'ASCENDING'|'NONE')}  sort the type of sorting
 * @returns {array}
 */

const sortByStipend = (profiles, order) => {
	return [...profiles].sort((profile_1, profile_2) => {
		const stipend_1 =
			profile_1.stipend.range.length !== 0
				? profile_1.stipend.range[0]
				: profile_1.stipend.amount;
		const stipend_2 =
			profile_2.stipend.range.length !== 0
				? profile_2.stipend.range[0]
				: profile_2.stipend.amount;
		return order === DESCENDING ? stipend_2 - stipend_1 : stipend_1 - stipend_2;
	});
};

export default sortByStipend;
