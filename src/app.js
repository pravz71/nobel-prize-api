const express = require('express');
const axios = require('axios');
const app = express();

const getSearchResults = require('./utils/utils');
const laureateJSON = require('./data/laureate.json');
const prizeJSON = require('./data/prize.json');

app.use(express.json());

const port = process.env.PORT || 8080;

app.get('/search', async (req, res) => {
	const { searchQuery } = req.query;
	try {
		const searchResults  = await getSearchResults(searchQuery);
		res.status(200).send(searchResults);
	} catch (error) {
		res.status(400).send(error);
	}
});

// Serve laureate and prize data  locally as well

app.get('/laureate', async (req, res) => {
	res.status(200).json(laureateJSON);
});

app.get('/prize', async (req, res) => {
	res.status(200).json(prizeJSON);
});

app.listen(port, () => {
	console.log("App is running on port: ", port);
});