const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.route('/posts/create').post(async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;

	posts[id] = {
		id,
		title,
	};

	try {
		await axios.post('http://event-bus-service:4002/events', {
			type: 'PostCreated',
			data: {
				id,
				title,
			},
		});
	} catch (err) {
		res.status(500);
		console.log(err);
	}

	res.status(201).send(posts[id]);
});

app.route('/events').post((req, res) => {
	console.log(req.body.type);

	res.status(200).json({});
});

app.listen(4000, () => {
	console.log('Listen on port 4000');
});
