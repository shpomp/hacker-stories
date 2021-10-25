import "./App.css";
import { useState, useEffect } from "react";

const InputWithLabel = ({ id, label, value, type = "text", onInputChange }) => (
	<>
		<label htmlFor={id}>{label}</label>
		<input id={id} type={type} value={value} onChange={onInputChange} />
	</>
);

const List = ({ list }) => (
	<ul className="list">
		{list.map((item) => (
			<Item key={item.objectID} item={item} />
		))}
	</ul>
);

const Item = ({ item }) => (
	<li>
		<span>
			<a href={item.url}>{item.title}</a>
		</span>
		<span>{item.author}</span>
		<span>{item.num_comments}</span>
		<span>{item.points}</span>
	</li>
);

// ------- ******* ------- . ------- ******* ------- . ------- ******* -------
const useSemiPersistentState = (key, initialState) => {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);
	useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);
	return [value, setValue];
};

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

	const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");

	const searchedStories = stories.filter((story) =>
		story.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div className="App">
			<h1>My Hacker Stories</h1>

			<InputWithLabel
				id="search"
				label="Search"
				value={searchTerm}
				onInputChange={handleSearch}
			/>

			<hr />

			<List list={searchedStories} />
		</div>
	);
};

export default App;
