import { render, screen } from "@testing-library/react";
import App from "./App";

describe("something truthy and falsy", () => {
	test("true to be true", () => {
		expect(true).toBeTruthy();
	});

	test("false to be false", () => {
		expect(false).toBeFalsy();
	});
});
