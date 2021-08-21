import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
	const [posts, setPost] = useState({});

	const fetchPosts = async () => {
		const res = await axios.get('http://blog.com/posts');

		setPost(res.data);
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const renderPosts = Object.values(posts).map(post => {
		return (
			<div className='card' style={{ width: '30%', marginBottom: '20px' }} key={post.id}>
				<div className='card-body'>
					<h3>{post.title}</h3>
				</div>
				<CommentList comments={post.comments}></CommentList>
				<CommentCreate postID={post.id}></CommentCreate>
			</div>
		);
	});

	return <div className='d-flex flex-row flex-wrap justify-content-between'>{renderPosts}</div>;
};

export default PostList;
