import { useState } from "react";
import Item from "./Item";
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
	COMMENT: (list: Stories): Stories => sortBy(list, "num_comments").reverse(),
	POINT: (list: Stories): Stories => sortBy(list, "points").reverse(),
};

// -------------- COMPONENT --------------

const List = ({ list, onRemoveItem }: ListProps) => {
	const [sort, setSort] = useState<string>("NONE");

	const handleSort = (sortKey: string) => {
		setSort(sortKey);
	};

	// const sortList = (sort: string, list: Stories): Stories => {
	// 	switch (sort) {
	// 		case "NONE":
	// 			return list;
	// 		case "TITLE":
	// 			return sortBy(list, "title");
	// 		case "AUTHOR":
	// 			return orderBy(list, [(item) => item.author.toLowerCase()], ["asc"]);
	// 		case "COMMENT":
	// 			return sortBy(list, "num_comments").reverse();
	// 		case "POINT":
	// 			return sortBy(list, "points").reverse();
	// 		default:
	// 			return list;
	// 	}
	// };
	// const sortedList = sortList(sort, list);

	const sortFunction = SORTS[sort];
	const sortedList = sortFunction(list);

	return (
		<ul className="list">
			<li style={{ display: "flex" }}>
				<span style={{ width: "40%" }}>
					<button type="button" onClick={() => handleSort("TITLE")}>
						Title
					</button>
				</span>
				<span style={{ width: "30%" }}>
					<button type="button" onClick={() => handleSort("AUTHOR")}>
						Author
					</button>
				</span>
				<span style={{ width: "10%" }}>
					<button type="button" onClick={() => handleSort("COMMENT")}>
						Comments
					</button>
				</span>
				<span style={{ width: "10%" }}>
					<button type="button" onClick={() => handleSort("POINT")}>
						Points
					</button>
				</span>
				<span style={{ width: "10%" }}>Actions</span>
			</li>
			{sortedList.map((item: Story) => (
				<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
			))}
		</ul>
	);
};
export default List;
