import styles from "./App.module.css";
import styled from "styled-components";
import axios from "axios";
import { useState, useEffect, useReducer, useCallback } from "react";
import List from "./components/List";
import SearchForm from "./components/SearchForm";
import Name from "./components/Name";

// ------- STYLED COMPONENTS -------

const StyledContainer = styled.div`
	height: 100vw;
	padding: 20px;
	background: #83a4d4;
	background: linear-gradient(to left, #b6fbff, #83a4d4);
	color: #171212;
`;
const StyledHeadlinePrimary = styled.h1`
	font-size: 48px;
	font-weight: 300;
	letter-spacing: 2px;
`;

// ------- APP -------

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

	const handleFetchStories = useCallback(async () => {
		dispatchStories({ type: ACTIONS.STORIES_FETCH_INIT });

		try {
			const result = await axios.get(url);

			dispatchStories({
				type: ACTIONS.STORIES_FETCH_SUCCESS,
				payload: result.data.hits,
			});
		} catch {
			dispatchStories({ type: ACTIONS.STORIES_FETCH_FAILURE });
		}
	}, [url]);

	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};
	const handleSearchSubmit = (event) => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);
		event.preventDefault();
	};

	const handleRemoveStory = (item) => {
		dispatchStories({
			type: ACTIONS.REMOVE_STORY,
			payload: item,
		});
	};

	return (
		<StyledContainer>
			<StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
			<SearchForm
				searchTerm={searchTerm}
				onSearchInput={handleSearchInput}
				onSearchSubmit={handleSearchSubmit}
			/>

			{stories.isError && <p>Something went wrong :/</p>}
			{stories.isLoading ? (
				<p>Loading ...</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}
		</StyledContainer>
	);
};

export default App;
