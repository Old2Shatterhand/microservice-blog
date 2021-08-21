const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostID = {};

app.route('/posts/:id/comments')
	.post(async (req, res) => {
		const commentID = randomBytes(4).toString('hex');

		const { content } = req.body;

		const comments = commentsByPostID[req.params.id] || [];

		comments.push({ id: commentID, content, status: 'pending' });

		commentsByPostID[req.params.id] = comments;

		try {
			await axios.post('http://event-bus-service:4002/events', {
				type: 'CommentCreated',
				data: {
					id: commentID,
					content,
					postID: req.params.id,
					status: 'pending',
				},
			});

			res.status(201).send(comments);
		} catch (err) {
			res.status(500);
			console.log(err);
		}
	})
	.get((req, res) => {
		res.send(commentsByPostID[req.params.id] || []);
	});

app.route('/events').post(async (req, res) => {
	console.log(req.body.type);

	const { type, data } = req.body;

	if (type === 'CommentModerated') {
		const { id, postID, status, content } = data;

		const comments = commentsByPostID[postID];

		const comment = comments.find(comment => comment.id === id);

		comment.status = status;
		comment.content = content;

		try {
			await axios.post('http://query-service:4003/events', {
				type: 'CommentUpdated',
				data: {
					id,
					status,
					postID,
					content,
				},
			});
		} catch (err) {
			res.status(500);
			console.log(err);
		}
	}

	res.status(200).json({});
});

app.listen(4001, () => {
	console.log('Listen on port 4001');
});
