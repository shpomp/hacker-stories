import { useState } from "react";
import Item from "./Item";
import { ReactComponent as ArrowUp } from "../arrowUp.svg";
import { ReactComponent as ArrowDown } from "../arrowDown.svg";

import { sortBy, orderBy } from "lodash";

const SORTS = {
	NONE: (list) => list,
	TITLE: (list) => sortBy(list, "title"),
	AUTHOR: (list) =>
		orderBy(list, [(item) => item.author.toLowerCase()], ["asc"]),
	COMMENT: (list) => sortBy(list, "num_comments"),
	POINT: (list) => sortBy(list, "points"),
};

const List = ({ list, onRemoveItem }) => {
	const [sort, setSort] = useState({
		sortKey: "NONE",
		reverseSort: false,
	});

	const handleSort = (sortKey) => {
		const reverseSort = sort.sortKey === sortKey && !sort.reverseSort;
		setSort({ sortKey, reverseSort });
	};

	const renderSortButton = (key) => {
		return sort.sortKey === key ? (
			sort.reverseSort ? (
				<ArrowDown />
			) : (
				<ArrowUp />
			)
		) : (
			""
		);
	};

	const sortButtonClassName = (key) => {
		return sort.sortKey === key ? "sortButton activeButton" : "sortButton";
	};

	const sortFunction = SORTS[sort.sortKey];
	const sortedList = sort.reverseSort
		? sortFunction(list).reverse()
		: sortFunction(list);

	return (
		<ul className="list">
			<li style={{ display: "flex" }}>
				<span style={{ width: "40%" }}>
					<button
						className={sortButtonClassName("TITLE")}
						type="button"
						onClick={() => handleSort("TITLE")}
					>
						Title {renderSortButton("TITLE")}
					</button>
				</span>
				<span style={{ width: "30%" }}>
					<button
						className={sortButtonClassName("AUTHOR")}
						type="button"
						onClick={() => handleSort("AUTHOR")}
					>
						Author {renderSortButton("AUTHOR")}
					</button>
				</span>
				<span style={{ width: "15%" }}>
					<button
						className={sortButtonClassName("COMMENT")}
						type="button"
						onClick={() => handleSort("COMMENT")}
					>
						Comments {renderSortButton("COMMENT")}
					</button>
				</span>
				<span style={{ width: "10%" }}>
					<button
						className={sortButtonClassName("POINT")}
						type="button"
						onClick={() => handleSort("POINT")}
					>
						Points {renderSortButton("POINT")}
					</button>
				</span>
				<span style={{ width: "10%" }}></span>
			</li>
			{sortedList.map((item) => (
				<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
			))}
		</ul>
	);
};
export default List;
