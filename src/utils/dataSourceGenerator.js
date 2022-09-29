import { ALL, NONE, STIPEND, NUMBER_OF_APPLICANTS } from "./constants";
import sortByStipend from "./sortByStipend";
import sortByNumberOfApplicants from "./sortByNumberOfApplicants";

/**
 * Sorts the project array by date of creation
 * @param {array} profiles - The profiles/ profiles array to be sorted.
 * @param {('ALL'|'APPLIED'|'SELECTED'|'REJECTED'|'ELIGIBLE')} sort - The type of filtering.
 * @param {('LATEST_FIRST'|'OLDEST_FIRST')} sort - The type of sorting.
 */

export const dataSourceGenerator = (profiles, filter, sort) => {
	// console.log(filter, sort);
	const filteredProjects = profiles.filter(({ location }) =>
		filter === ALL ? true : filter === location
	);
	let sortedFilteredProjects = filteredProjects;
	switch (sort) {
		case STIPEND:
			sortedFilteredProjects = sortByStipend(filteredProjects, sort);
			break;
		case NUMBER_OF_APPLICANTS:
			sortedFilteredProjects = sortByNumberOfApplicants(filteredProjects, sort);
			break;
		default:
			break;
	}

	return sortedFilteredProjects;
};
