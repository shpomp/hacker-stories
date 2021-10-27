import styled from "styled-components";
import React from "react";

import InputWithLabel from "./InputWithLabel";

// -------------- STYLED COMPONENTS --------------

const StyledButton = styled.button`
	background: transparent;
	border: 1px solid #171212;
	padding: 5px;
	cursor: pointer;
	transition: all 0.1s ease-in;
	&:hover {
		background: #171212;
		color: #ffffff;
	}
`;
const StyledSearchForm = styled.form`
	padding: 10px 0 20px 0;
	display: flex;
	align-items: baseline;
`;
const StyledButtonLarge = styled(StyledButton)`
	padding: 10px;
`;

// -------------- COMPONENT --------------

const SearchForm = React.memo(
	({ searchTerm, onSearchInput, onSearchSubmit }) => {
		console.log("searchFrom");
		return (
			<StyledSearchForm onSubmit={onSearchSubmit}>
				<InputWithLabel
					id="search"
					value={searchTerm}
					isFocused
					onInputChange={onSearchInput}
				>
					<strong>Search:</strong>
				</InputWithLabel>
				<StyledButtonLarge type="submit" disabled={!searchTerm}>
					Submit
				</StyledButtonLarge>
			</StyledSearchForm>
		);
	}
);

export default SearchForm;
