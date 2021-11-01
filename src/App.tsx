import axios from "axios";
import {
	useState,
	useEffect,
	useReducer,
	useCallback,
	useRef,
	useMemo,
} from "react";
import List from "./components/List";
import SearchForm from "./components/SearchForm";
import "./App.css";

// -------------- *** TYPES *** --------------

export type Story = {
	objectID: string;
	url: string;
	title: string;
	author: string;
	num_comments: number;
	points: number;
};

type Stories = Array<Story>;

type StoriesState = {
	data: Stories;
	isLoading: boolean;
	isError: boolean;
};

// type StoriesAction = {
// 	type: string;
// 	payload: any;
// };

type StoriesAction =
	| StoriesFetchInitAction
	| StoriesFetchSuccessAction
	| StoriesFetchFailureAction
	| StoriesRemoveAction;

interface StoriesFetchInitAction {
	type: "STORIES_FETCH_INIT";
}
interface StoriesFetchSuccessAction {
	type: "STORIES_FETCH_SUCCESS";
	payload: Stories;
}
interface StoriesFetchFailureAction {
	type: "STORIES_FETCH_FAILURE";
}
interface StoriesRemoveAction {
	type: "REMOVE_STORY";
	payload: Story;
}

// -------------- *** *** *** --------------

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useSemiPersistentState = (
	key: string,
	initialState: string
): [string, (newValue: string) => void] => {
	const isMounted = useRef(false);
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);
	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
		} else {
			localStorage.setItem(key, value);
		}
	}, [value, key]);
	return [value, setValue];
};

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
	switch (action.type) {
		case "STORIES_FETCH_INIT":
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case "STORIES_FETCH_SUCCESS":
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload,
			};
		case "STORIES_FETCH_FAILURE":
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		case "REMOVE_STORY":
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
		dispatchStories({ type: "STORIES_FETCH_INIT" });

		try {
			const result = await axios.get(url);

			dispatchStories({
				type: "STORIES_FETCH_SUCCESS",
				payload: result.data.hits,
			});
		} catch {
			dispatchStories({ type: "STORIES_FETCH_FAILURE" });
		}
	}, [url]);

	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);

		event.preventDefault();
	};

	// If the App component re-renders, it always creates a new version of this callback handler as a new function.
	// Earlier, we used React’s useCallback Hook to prevent this behavior, by creating a function only on a re-render
	// (if one of its dependencies has changed):
	const handleRemoveStory = (item: Story) => {
		dispatchStories({
			type: "REMOVE_STORY",
			payload: item,
		});
	};

	//We can tell React to only run a function if one of its dependencies has changed.
	//If no dependency changed, the result of the function stays the same. React’s useMemo Hook helps us here:
	const getSumComments = (stories: Stories) => {
		return stories.reduce((result, value) => result + value.num_comments, 0);
	};
	//const sumComments = useMemo(() => getSumComments(stories), [stories]);

	return (
		<div className="container">
			<h1 className="headlinePrimary">
				My Hacker Stories with {"sumComments"} comments.
			</h1>
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
		</div>
	);
};

export default App;
