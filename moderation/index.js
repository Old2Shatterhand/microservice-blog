const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.route('/events').post(async (req, res) => {
	const { type, data } = req.body;

	if (type === 'CommentCreated') {
		const status = data.content.includes('shit') ? 'rejected' : 'approved';

		try {
			await axios.post('http://event-bus-service:4002/events', {
				type: 'CommentModerated',
				data: {
					id: data.id,
					postID: data.postID,
					status,
					content: data.content,
				},
			});
		} catch (err) {
			res.status(500);
			console.log(err);
		}
	}

	res.send('');
});

app.listen(4004, () => {
	console.log('Listen on port 4004');
});
