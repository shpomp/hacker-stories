import App, { storiesReducer } from "./App";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Item from "./components/Item";
import SearchForm from "./components/SearchForm";
import axios from "axios";

describe("something truthy and falsy", () => {
	test("true to be true", () => {
		expect(true).toBeTruthy();
	});

	test("false to be false", () => {
		expect(false).toBeFalsy();
	});
});

const storyOne = {
	title: "React",
	url: "https://reactjs.org/",
	author: "Jordan Walke",
	num_comments: 3,
	points: 4,
	objectID: 0,
};

const storyTwo = {
	title: "Redux",
	url: "https://redux.js.org/",
	author: "Dan Abramov, Andrew Clark",
	num_comments: 2,
	points: 5,
	objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("storiesReducer", () => {
	test("removes a story from all stories", () => {
		const action = { type: "REMOVE_STORY", payload: storyOne };
		const state = { data: stories, isLoading: false, isError: false };
		const newState = storiesReducer(state, action);
		const expectedState = {
			data: [storyTwo],
			isLoading: false,
			isError: false,
		};
		expect(newState).toStrictEqual(expectedState);
	});
});

// UNIT

describe("Item", () => {
	test("renders all properties", () => {
		render(<Item item={storyOne} />);
		// screen.debug(); // The function gives a useful overview of what is rendered and informs the best way to proceed with testing.
		expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
		expect(screen.getByText("React")).toHaveAttribute(
			"href",
			"https://reactjs.org/"
		);
	});

	test("renders a clickable dismiss button", () => {
		render(<Item item={storyOne} />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	test("clicking the dismiss button calls the callback handler", () => {
		const handleRemoveItem = jest.fn();
		render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
		fireEvent.click(screen.getByRole("button"));
		expect(handleRemoveItem).toHaveBeenCalledTimes(1);
	});
});

describe("SearchForm", () => {
	const searchFormProps = {
		searchTerm: "React",
		onSearchInput: jest.fn(),
		onSearchSubmit: jest.fn(),
	};
	test("renders the input field with its value", () => {
		render(<SearchForm {...searchFormProps} />);
		expect(screen.getByDisplayValue("React")).toBeInTheDocument();
	});

	test("renders the correct label", () => {
		render(<SearchForm {...searchFormProps} />);
		expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
	});

	test("calls onSearchInput on input field change", () => {
		render(<SearchForm {...searchFormProps} />);
		fireEvent.change(screen.getByDisplayValue("React"), {
			target: { value: "Redux" },
		});
		expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
	});
	test("calls onSearchSubmit on button submit click", () => {
		render(<SearchForm {...searchFormProps} />);
		fireEvent.submit(screen.getByRole("button"));
		expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
	});
});

// mock axios
jest.mock("axios");

describe("App", () => {
	test("succeeds fetching data", async () => {
		const promise = Promise.resolve({
			data: {
				hits: stories,
			},
		});
		axios.get.mockImplementationOnce(() => promise);
		render(<App />);
		expect(screen.queryByText(/Loading/)).toBeInTheDocument();
		await act(() => promise);
		expect(screen.queryByText(/Loading/)).toBeNull(); // Using getByText in this instance would produce an error,
		// because the element can’t be found; but with queryByText the value just returns null.
		expect(screen.getByText("React")).toBeInTheDocument();
		expect(screen.getByText("Redux")).toBeInTheDocument();
	});

	test("fails fetching data", async () => {
		const promise = Promise.reject();
		axios.get.mockImplementationOnce(() => promise);
		render(<App />);
		expect(screen.getByText(/Loading/)).toBeInTheDocument();
		try {
			await act(() => promise);
		} catch (error) {
			expect(screen.queryByText(/Loading/)).toBeNull();
			expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
		}
	});

	test("removes a story", async () => {
		const promise = Promise.resolve({
			data: {
				hits: stories,
			},
		});
		axios.get.mockImplementationOnce(() => promise);
		render(<App />);
		await act(() => promise);
		expect(screen.getAllByText(/dismiss/).length).toBe(2);
		expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
		fireEvent.click(screen.getAllByText(/dismiss/)[0]);
		expect(screen.getAllByText(/dismiss/).length).toBe(1);
		expect(screen.queryByText("Jordan Walke")).toBeNull();
	});

	test("removes a story", async () => {
		const promise = Promise.resolve({
			data: {
				hits: stories,
			},
		});
		axios.get.mockImplementationOnce(() => promise);
		render(<App />);
		await act(() => promise);
		expect(screen.getAllByText(/dismiss/).length).toBe(2);
		expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
		fireEvent.click(screen.getAllByText(/dismiss/)[0]);
		expect(screen.getAllByText(/dismiss/).length).toBe(1);
		expect(screen.queryByText("Jordan Walke")).toBeNull();
	});

	test("searches for specific stories", async () => {
		const reactPromise = Promise.resolve({
			data: {
				hits: stories,
			},
		});
		const anotherStory = {
			title: "JavaScript",
			url: "https://en.wikipedia.org/wiki/JavaScript",
			author: "Brendan Eich",
			num_comments: 15,
			points: 10,
			objectID: 3,
		};
		const javascriptPromise = Promise.resolve({
			data: {
				hits: [anotherStory],
			},
		});
		axios.get.mockImplementation((url) => {
			if (url.includes("React")) {
				return reactPromise;
			}
			if (url.includes("JavaScript")) {
				return javascriptPromise;
			}
			throw Error();
		});
		// Initial Render
		render(<App />);

		// First Data Fetching
		await act(() => reactPromise);
		expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
		expect(screen.queryByDisplayValue("JavaScript")).toBeNull();
		expect(screen.queryByText("Jordan Walke")).toBeInTheDocument();
		expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeInTheDocument();
		expect(screen.queryByText("Brendan Eich")).toBeNull();

		// User Interaction -> Search
		fireEvent.change(screen.queryByDisplayValue("React"), {
			target: {
				value: "JavaScript",
			},
		});
		expect(screen.queryByDisplayValue("React")).toBeNull();
		expect(screen.queryByDisplayValue("JavaScript")).toBeInTheDocument();

		fireEvent.submit(screen.queryByText("Submit"));

		// Second Data Fetching
		await act(() => javascriptPromise);
		expect(screen.queryByText("Jordan Walke")).toBeNull();
		expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeNull();
		expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
	});
});
