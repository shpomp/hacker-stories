import App, { storiesReducer } from "./App";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Item from "./components/Item";

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
