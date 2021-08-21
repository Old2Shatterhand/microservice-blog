import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postID }) => {
	const [content, setContent] = useState('');

	const onSubmit = async e => {
		e.preventDefault();

		await axios.post(`http://blog.com/posts/${postID}/comments`, {
			content,
		});

		setContent('');
	};
	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label>Create Comment</label>
					<input className='form-control' onChange={e => setContent(e.target.value)}></input>
					<button className='btn btn-primary'>Submit</button>
				</div>
			</form>
		</div>
	);
};

export default CommentCreate;
