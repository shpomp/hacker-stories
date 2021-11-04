import React from "react";

import InputWithLabel from "./InputWithLabel";

const SearchForm = React.memo(
	({ searchTerm, onSearchInput, onSearchSubmit }) => {
		return (
			<form className="searchForm" onSubmit={onSearchSubmit}>
				<InputWithLabel
					id="search"
					value={searchTerm}
					isFocused
					onInputChange={onSearchInput}
				>
					<strong>Search:</strong>
				</InputWithLabel>
				<button
					className="button buttonLarge"
					type="submit"
					disabled={!searchTerm}
				>
					Submit
				</button>
			</form>
		);
	}
);

export default SearchForm;
