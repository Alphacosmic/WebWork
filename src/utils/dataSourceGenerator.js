import { ALL, NONE, STIPEND, NUMBER_OF_APPLICANTS } from "./constants";
import sortByStipend from "./sortByStipend";
import sortByNumberOfApplicants from "./sortByNumberOfApplicants";

/**
 * Sorts the project array by date of creation
 * @param {array} profiles - The profiles/ profiles array to be sorted.
 * @param {('ALL'|'APPLIED'|'SELECTED'|'REJECTED'|'ELIGIBLE')} sort - The type of filtering.
 * @param {('STIPEND'|'NUMBER_OF_APPLICANTS')} sort - The type of sorting.
 * @param {('NONE'|'ASCENDING'|'DESCENDING')} order - The order of sorting
 */

export const dataSourceGenerator = (profiles, filter, sort, order) => {
	// console.log(filter, sort);
	const filteredProjects = profiles.filter(({ location }) =>
		filter === ALL ? true : filter === location
	);
	let sortedFilteredProjects = filteredProjects;
	switch (sort) {
		case STIPEND:
			sortedFilteredProjects = sortByStipend(filteredProjects, order);
			break;
		case NUMBER_OF_APPLICANTS:
			sortedFilteredProjects = sortByNumberOfApplicants(filteredProjects, order);
			break;
		default:
			break;
	}

	return sortedFilteredProjects;
};
