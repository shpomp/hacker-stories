import "./App.css";
import { useState, useEffect, useReducer } from "react";
import InputWithLabel from "./components/InputWithLabel";
import List from "./components/List";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const ACTIONS = {
	SET_STORIES: "SET_STORIES",
	REMOVE_STORY: "REMOVE_STORY",
	STORIES_FETCH_INIT: "STORIES_FETCH_INIT",
	STORIES_FETCH_SUCCESS: "STORIES_FETCH_SUCCESS",
	STORIES_FETCH_FAILURE: "STORIES_FETCH_FAILURE",
};

const storiesReducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.STORIES_FETCH_INIT:
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case ACTIONS.STORIES_FETCH_SUCCESS:
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload,
			};
		case ACTIONS.STORIES_FETCH_FAILURE:
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		case ACTIONS.REMOVE_STORY:
			return {
				...state,
				data: state.data.filter(
					(story) => action.payload.objectID !== story.objectID
				),
			};
		default:
			throw new Error();
	}
};

const useSemiPersistentState = (key, initialState) => {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);
	useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);
	return [value, setValue];
};

const initialStories = [
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

const getAsyncStories = () =>
	new Promise((resolve) =>
		setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
	);

const App = () => {
	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	});

	const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");

	useEffect(() => {
		if (!searchTerm) return;
		dispatchStories({ type: ACTIONS.STORIES_FETCH_INIT });
		fetch(`${API_ENDPOINT}${searchTerm}`)
			.then((response) => response.json())
			.then((result) => {
				dispatchStories({
					type: ACTIONS.STORIES_FETCH_SUCCESS,
					payload: result.hits,
				});
			})
			.catch(() => dispatchStories({ type: ACTIONS.STORIES_FETCH_FAILURE }));
	}, [searchTerm]);

	const searchedStories = stories.data.filter((story) =>
		story.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleRemoveStory = (item) => {
		dispatchStories({
			type: ACTIONS.REMOVE_STORY,
			payload: item,
		});
	};

	return (
		<div className="App">
			<h1>My Hacker Stories</h1>
			<InputWithLabel
				id="search"
				label="Search"
				value={searchTerm}
				isFocused
				onInputChange={handleSearch}
			>
				Search:
			</InputWithLabel>
			<hr />
			{stories.isError && <p>Something went wrong :/</p>}
			{stories.isLoading ? (
				<p>Loading ...</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}
		</div>
	);
};

export default App;
