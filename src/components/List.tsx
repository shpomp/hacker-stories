import { useState } from "react";
import Item from "./Item";
import { ReactComponent as ArrowUp } from "../arrowUp.svg";
import { ReactComponent as ArrowDown } from "../arrowDown.svg";

import { sortBy, orderBy } from "lodash";
import type { Story, Stories } from "../App";

// -------------- TYPES --------------

type ListProps = {
	list: Stories;
	onRemoveItem: (item: Story) => void;
};

type SortsType = {
	[NONE: string]: (list: Stories) => Stories;
	TITLE: (list: Stories) => Stories;
	AUTHOR: (list: Stories) => Stories;
	COMMENT: (list: Stories) => Stories;
	POINT: (list: Stories) => Stories;
};

const SORTS: SortsType = {
	NONE: (list: Stories): Stories => list,
	TITLE: (list: Stories): Stories => sortBy(list, "title"),
	AUTHOR: (list: Stories): Stories =>
		orderBy(list, [(item) => item.author.toLowerCase()], ["asc"]),
	COMMENT: (list: Stories): Stories => sortBy(list, "num_comments"),
	POINT: (list: Stories): Stories => sortBy(list, "points"),
};

type sortState = { sortKey: string; reverseSort: boolean };
// -------------- COMPONENT --------------

const List = ({ list, onRemoveItem }: ListProps) => {
	const [sort, setSort] = useState<sortState>({
		sortKey: "NONE",
		reverseSort: false,
	});

	const handleSort = (sortKey: string) => {
		const reverseSort = sort.sortKey === sortKey && !sort.reverseSort;
		setSort({ sortKey, reverseSort });
	};

	const renderSortButton = (key: string) => {
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

	const sortButtonClassName = (key: string) => {
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
			{sortedList.map((item: Story) => (
				<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
			))}
		</ul>
	);
};
export default List;
