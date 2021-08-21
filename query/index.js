const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

const eventHandler = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] };
	}
	if (type === 'CommentCreated') {
		const { id, content, postID, status } = data;

		const post = posts[postID];

		post.comments.push({ id, content, status });
	}
	if (type === 'CommentUpdated') {
		const { id, content, postID, status } = data;

		const post = posts[postID];

		const comment = post.comments.find(comment => comment.id === id);

		comment.status = status;
		comment.content = content;
	}
};

app.route('/posts').get((req, res) => {
	res.send(posts);
});

app.route('/events').post((req, res) => {
	const { type, data } = req.body;

	eventHandler(type, data);

	res.status(201).json({});
});

app.listen(4003, async () => {
	console.log('Listen on port 4003');

	const res = await axios.get('http://event-bus-service:4002/events').catch(err => console.log(err));

	if (res) {
		for (const event of res.data) {
			console.log('Processing: ', event);

			eventHandler(event.type, event.data);
		}
	}
});
