import styles from "../App.module.css";
import cs from "classnames";
import styled from "styled-components";

import InputWithLabel from "./InputWithLabel";

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
const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
	return (
		<StyledSearchForm onSubmit={onSearchSubmit}>
			{" "}
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
};

export default SearchForm;
