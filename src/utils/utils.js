const axios = require('axios');

const PRIZE_URL = `http://api.nobelprize.org/v1/prize.json`;
const USER_URL = `http://api.nobelprize.org/v1/laureate.json`;
// const COUNTRY_URL = `http://api.nobelprize.org/v1/country.json`;

// Fetch from local if required
// const PRIZE_URL = `http://localhost:8080/prize`;
// const USER_URL = `http://localhost:8080/laureate`;

const getPrizeData = async (laureatesData) => {
	const response = await axios.get(PRIZE_URL);
	const prizes =  response.data.prizes;
	const laureateIds = Object.keys(laureatesData);
	const searchResults = [];
	prizes.forEach(({ year, category, laureates=[] }) => {
		let match = false;
		let id = null;
		let sharedWith = [];
		laureates.forEach( laureate => {
			if( laureateIds.includes(laureate.id) ) {
				match = true;
				id = laureate.id;
				// Removing the search result from the laureates
			} else {
				sharedWith.push(laureate.firstname + " " + laureate.surname);
			}
		});

		if(match) {
			searchResults.push({
				...laureatesData[id],
				year,
				field: category,
				sharedWith
			});
		}
	});
	return searchResults;
}

const getLaureatesData = async (searchQuery) => {
	const response = await axios.get(USER_URL);
	const laureates =  response.data.laureates;
	const laureatesData = {};
	laureates.forEach(( { id, firstname, surname, bornCountry } ) => {
		if( (firstname + " " + surname).toLowerCase().includes(searchQuery.toLowerCase()) ) {
			laureatesData[id] = {
				name: firstname + " " + surname,
				country: bornCountry
			};
		}
	});
	return laureatesData;
}

const getSearchResults = async (searchQuery) => {
	const laureatesData = await getLaureatesData(searchQuery);
	const searchResults = await getPrizeData(laureatesData);
	return searchResults;
}

module.exports = getSearchResults;