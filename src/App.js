import "./App.css";
import { useState } from "react";

const Search = ({ search, onSearch }) => {
	return (
		<div>
			<label htmlFor="search">Search: </label>
			<input id="search" type="text" value={search} onChange={onSearch} />
		</div>
	);
};

const List = ({ list }) => (
	<ul>
		{list.map(({ objectID, ...item }) => (
			<Item key={objectID} {...item} />
		))}
	</ul>
);

const Item = ({ title, url, author, num_comments, points }) => (
	<li>
		<span>
			<a href={url}>{title}</a>
		</span>
		<span>{author}</span>
		<span>{num_comments}</span>
		<span>{points}</span>
	</li>
);

// ------- ******* ------- . ------- ******* ------- . ------- ******* -------

const App = () => {
	const stories = [
		{
			title: "React",
			url: "https://reactjs.org/",
			author: "Jordan Walke",
			num_comments: 3,
			points: 4,
			objectID: 0,
		},
		{
			title: "Redux",
			url: "https://redux.js.org/",
			author: "Dan Abramov, Andrew Clark",
			num_comments: 2,
			points: 5,
			objectID: 1,
		},
	];

	const [searchTerm, setSearchTerm] = useState("");
	const searchedStories = stories.filter((story) =>
		story.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div className="App">
			<h1>My Hacker Stories</h1>

			<Search search={searchTerm} onSearch={handleSearch} />
			<hr />

			<List list={searchedStories} />
		</div>
	);
};

export default App;