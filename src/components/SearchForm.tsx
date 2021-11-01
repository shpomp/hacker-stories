import React from "react";

import InputWithLabel from "./InputWithLabel";

// -------------- *** TYPES *** --------------

type SearchFormProps = {
	searchTerm: string;
	onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

// -------------- *** *** *** --------------

// -------------- COMPONENT --------------

const SearchForm = React.memo(
	({ searchTerm, onSearchInput, onSearchSubmit }: SearchFormProps) => {
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
