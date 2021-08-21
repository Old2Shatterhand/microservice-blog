const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const events = [];

app.route('/events').post(async (req, res) => {
	try {
		const event = req.body;

		events.push(event);

		await axios.post('http://posts-service:4000/events', event); // posts
		await axios.post('http://comments-service:4001/events', event); // comments
		await axios.post('http://query-service:4003/events', event); // query
		await axios.post('http://moderation-service:4004/events', event); // moderation

		res.status(201).json({
			status: 'OK',
		});
	} catch (err) {
		res.status(500);
		console.log(err);
	}
});

app.route('/events').get((req, res) => {
	res.send(events);
});

app.listen(4002, () => {
	console.log('Listen on port 4002');
});
