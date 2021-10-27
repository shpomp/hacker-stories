import styles from "../App.module.css";
import cs from "classnames";

import InputWithLabel from "./InputWithLabel";

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
	return (
		<form onSubmit={onSearchSubmit} className={styles.searchForm}>
			<InputWithLabel
				id="search"
				value={searchTerm}
				isFocused
				onInputChange={onSearchInput}
			>
				<strong>Search:</strong>
			</InputWithLabel>
			<button
				type="submit"
				disabled={!searchTerm}
				className={cs(styles.button, styles.buttonLarge)}
			>
				Submit
			</button>
		</form>
	);
};

export default SearchForm;
