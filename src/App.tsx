import axios from "axios";
import { useState, useEffect, useReducer, useCallback, useRef } from "react";
import List from "./components/List";
import SearchForm from "./components/SearchForm";
import "./App.css";

// const tryFetch = async () =>
// 	await fetch("//hn.algolia.com/api/v1/search?query=react&page=7")
// 		.then((response) => response.json())
// 		.then((data) => console.log(data.hits[7]));

// -------------- *** TYPES *** --------------

export type Story = {
	objectID: string;
	url: string;
	title: string;
	author: string;
	num_comments: number;
	points: number;
	page: number;
};

export type Stories = Array<Story>;

type StoriesState = {
	data: Stories;
	isLoading: boolean;
	isError: boolean;
};

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
	page: number;
	//page: result.data.page,
}
interface StoriesFetchFailureAction {
	type: "STORIES_FETCH_FAILURE";
}
interface StoriesRemoveAction {
	type: "REMOVE_STORY";
	payload: Story;
}

type lastSearchesProps = {
	lastSearches: Array<string>;
	onLastSearch: (searchTerm: string) => void;
};

/*


const App = () => {
	const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
	const [urls, setUrls] = useState<Array<string>>([getUrl(searchTerm)]);

	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	});

	const handleFetchStories = useCallback(async () => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });

		try {
			const lastUrl = urls[urls.length - 1];
			const result = await axios.get(lastUrl);

			dispatchStories({
				type: "STORIES_FETCH_SUCCESS",
				payload: result.data.hits,
				page: result.data.page,
			});
		} catch {
			dispatchStories({ type: "STORIES_FETCH_FAILURE" });
		}
	}, [urls]);

	// If the App component re-renders, it always creates a new version of this callback handler as a new function.
	// Earlier, we used React’s useCallback Hook to prevent this behavior, by creating a function only on a re-render
	// (if one of its dependencies has changed):
	const handleRemoveStory = (item: Story) => {
		dispatchStories({
			type: "REMOVE_STORY",
			payload: item,
		});
	};

	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const url = getUrl(searchTerm);
		setUrls(urls.concat(url));
		event.preventDefault();
	};

	const handleSearch = (searchTerm: string) => {
		const url = getUrl(searchTerm);
		setUrls(urls.concat(url));
	};
	// --------------------- last searches ---------------------

	// https://hn.algolia.com/api/v1/search?query=1

	const getLastSearches = (urls: Array<string>) =>
		urls.slice(-6, -1).map((url) => extractSearchTerm(url));

	const handleLastSearch = (searchTerm: string) => {
		setSearchTerm(searchTerm);
		handleSearch(searchTerm);
	};

	const lastSearchesSet = new Set(getLastSearches(urls));
	const lastSearchesArray: Array<string> = [...lastSearchesSet];
	console.log(urls);
	console.log(lastSearchesSet);

	const LastSearches = ({ lastSearches, onLastSearch }: lastSearchesProps) => (
		<>
			{lastSearches.map((searchTerm: string, index: number) => (
				<button
					key={searchTerm + index}
					type="button"
					onClick={() => onLastSearch(searchTerm)}
				>
					{searchTerm}
				</button>
			))}
		</>
	);

	// --------------------- ******* ---------------------

	//We can tell React to only run a function if one of its dependencies has changed.
	//If no dependency changed, the result of the function stays the same. React’s useMemo Hook helps us here:
	// const getSumComments = (stories: Stories) => {
	// 	return stories.reduce(
	// 		(result, value): number => result + value.num_comments,
	// 		0
	// 	);
	// };
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
			<div className="lastSearchButtons">
				<LastSearches
					lastSearches={lastSearchesArray}
					onLastSearch={handleLastSearch}
				/>
			</div>

			{stories.isError && <p>Something went wrong :/</p>}
			{stories.isLoading ? (
				<p>Loading ...</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}
		</div>
	);
};

*/

const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

const getUrl = (searchTerm: string, page: number) =>
	`${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const extractSearchTerm = (url: string) =>
	url
		.substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
		.replace(PARAM_SEARCH, "");

const getLastSearches = (urls: Array<string>) =>
	urls
		.reduce((result, url, index) => {
			const searchTerm = extractSearchTerm(url);

			if (index === 0) {
				return result.concat(searchTerm);
			}

			//([] as string[]).concat('foo')

			const previousSearchTerm = result[result.length - 1];

			if (searchTerm === previousSearchTerm) {
				return result;
			} else {
				return result.concat(searchTerm);
			}
		}, [])
		.slice(-6)
		.slice(0, -1);

const useSemiPersistentState = (
	key: string,
	initialState: string
): [string, (newValue: string) => void] => {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);

	useEffect(() => {
		localStorage.setItem(key, value);
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
				data:
					action.payload.page === 0
						? action.payload.list
						: state.data.concat(action.payload.list),
				page: action.payload.page,
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

	const [urls, setUrls] = useState([getUrl(searchTerm, 0)]);

	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		page: 0,
		isLoading: false,
		isError: false,
	});

	const handleFetchStories = useCallback(async () => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });

		try {
			const lastUrl = urls[urls.length - 1];
			const result = await axios.get(lastUrl);

			dispatchStories({
				type: "STORIES_FETCH_SUCCESS",
				payload: {
					list: result.data.hits,
					page: result.data.page,
				},
			});
		} catch {
			dispatchStories({ type: "STORIES_FETCH_FAILURE" });
		}
	}, [urls]);

	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	const handleRemoveStory = (item: Story) => {
		dispatchStories({
			type: "REMOVE_STORY",
			payload: item,
		});
	};

	const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		handleSearch(searchTerm, 0);

		event.preventDefault();
	};

	const handleLastSearch = (searchTerm: string) => {
		setSearchTerm(searchTerm);

		handleSearch(searchTerm, 0);
	};

	const handleMore = () => {
		const lastUrl = urls[urls.length - 1];
		const searchTerm = extractSearchTerm(lastUrl);
		handleSearch(searchTerm, stories.page + 1);
	};

	const handleSearch = (searchTerm: string, page: number) => {
		const url = getUrl(searchTerm, page);
		setUrls(urls.concat(url));
	};

	const lastSearches = getLastSearches(urls);

	return (
		<div>
			<h1>My Hacker Stories</h1>

			<SearchForm
				searchTerm={searchTerm}
				onSearchInput={handleSearchInput}
				onSearchSubmit={handleSearchSubmit}
			/>

			<LastSearches
				lastSearches={lastSearches}
				onLastSearch={handleLastSearch}
			/>

			<hr />

			{stories.isError && <p>Something went wrong ...</p>}

			<List list={stories.data} onRemoveItem={handleRemoveStory} />

			{stories.isLoading ? (
				<p>Loading ...</p>
			) : (
				<button type="button" onClick={handleMore}>
					More
				</button>
			)}
		</div>
	);
};

const LastSearches = ({ lastSearches, onLastSearch }: lastSearchesProps) => (
	<>
		{lastSearches.map((searchTerm, index) => (
			<button
				key={searchTerm + index}
				type="button"
				onClick={() => onLastSearch(searchTerm)}
			>
				{searchTerm}
			</button>
		))}
	</>
);

export default App;
