import "./App.css";
import { useState, useEffect } from "react";

const Search = (props) => {
	const [searchTerm, setSearchTerm] = useState("");
	const handleChange = (event) => {
		setSearchTerm(event.target.value);
		props.onSearch(event);
	};

	useEffect(() => {
		console.log("in Search: ", searchTerm);
	});

	return (
		<div>
			<label htmlFor="search">Search: </label>
			<input id="search" type="text" onChange={handleChange} />
			<p>
				Searching for <strong>{searchTerm}</strong>.
			</p>
		</div>
	);
};

const List = (props) => (
	<ul>
		{props.list.map((item) => (
			<Item key={item.objectID} item={item} />
		))}
	</ul>
);

const Item = (props) => (
	<li>
		<span>
			<a href={props.item.url}>{props.item.title}</a>
		</span>
		<span>{props.item.author}</span>
		<span>{props.item.num_comments}</span>
		<span>{props.item.points}</span>
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

	const handleSearch = (event) => {
		const inputValue = event.target.value;
		console.log("inputValue", inputValue);
		console.log("in APP: ", event.target.value);
	};

	return (
		<div className="App">
			<h1>My Hacker Stories</h1>

			<Search onSearch={handleSearch} />

			<hr />

			<List list={stories} />
		</div>
	);
};

export default App;
