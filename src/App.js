import "./App.css";
import { useState, useEffect, useRef, useReducer } from "react";

const InputWithLabel = ({
	id,
	value,
	type = "text",
	onInputChange,
	isFocused,
	children,
}) => {
	// A
	const inputRef = useRef();
	// C
	useEffect(() => {
		if (isFocused && inputRef.current) {
			// D
			inputRef.current.focus();
		}
	}, [isFocused]);
	return (
		<>
			<label htmlFor={id}>{children}</label>
			&nbsp;
			{/* B */}
			<input
				ref={inputRef}
				id={id}
				type={type}
				value={value}
				onChange={onInputChange}
			/>
		</>
	);
};

const List = ({ list, onRemoveItem }) => (
	<ul className="list">
		{list.map((item) => (
			<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
		))}
	</ul>
);

const Item = ({ item, onRemoveItem }) => {
	return (
		<li>
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
			<span>
				<button type="button" onClick={() => onRemoveItem(item)}>
					delete
				</button>
			</span>
		</li>
	);
};

// ------- ******* ------- . ------- ******* ------- . ------- ******* -------

const ACTIONS = { SET_STORIES: "SET_STORIES", REMOVE_STORY: "REMOVE_STORY" };

const useSemiPersistentState = (key, initialState) => {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);
	useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);
	return [value, setValue];
};

const storiesReducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.SET_STORIES:
			return action.payload;
		case ACTIONS.REMOVE_STORY:
			return state.filter(
				(story) => action.payload.objectID !== story.objectID
			);
		default:
			throw new Error();
	}
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
	const [stories, dispatchStories] = useReducer(storiesReducer, []);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");

	useEffect(() => {
		setIsLoading(true);
		getAsyncStories()
			.then((result) => {
				dispatchStories({
					type: ACTIONS.SET_STORIES,
					payload: result.data.stories,
				});
				setIsLoading(false);
			})
			.catch(() => setIsError(true));
	}, []);

	const searchedStories = stories.filter((story) =>
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
			{isError && <p>Something went wrong ...</p>}
			{isLoading ? (
				<p>Loading ...</p>
			) : (
				<List list={searchedStories} onRemoveItem={handleRemoveStory} />
			)}
		</div>
	);
};

export default App;
