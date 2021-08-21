import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';

const App = () => {
	return (
		<div className="container">
			<h1>Create Post</h1>
			<PostCreate></PostCreate>
			<hr></hr>
			<h1>Post List</h1>
			<PostList></PostList>
		</div>
	);
};

export default App;
