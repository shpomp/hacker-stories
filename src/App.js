import "./App.css";
import { useState, useEffect, useReducer, useCallback } from "react";
import InputWithLabel from "./components/InputWithLabel";
import List from "./components/List";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useSemiPersistentState = (key, initialState) => {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);
	useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);
	return [value, setValue];
};

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

const App = () => {
	const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
	const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	});

	const handleFetchStories = useCallback(() => {
		if (!searchTerm) return;

		dispatchStories({ type: ACTIONS.STORIES_FETCH_INIT });

		fetch(url)
			.then((response) => response.json())
			.then((result) => {
				dispatchStories({
					type: ACTIONS.STORIES_FETCH_SUCCESS,
					payload: result.hits,
				});
			})
			.catch(() => dispatchStories({ type: ACTIONS.STORIES_FETCH_FAILURE }));
	}, [url]);

	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};
	const handleSearchSubmit = () => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);
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
				onInputChange={handleSearchInput}
			>
				Search:
			</InputWithLabel>

			<button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
				Submit
			</button>

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
