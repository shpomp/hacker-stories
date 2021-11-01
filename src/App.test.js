import { render, screen } from "@testing-library/react";
import App, { storiesReducer } from "./App";

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
