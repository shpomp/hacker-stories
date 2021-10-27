import styles from "../App.module.css";

import React from "react";
import Item from "./Item";

// -------------- COMPONENT --------------

const List = React.memo(
	({ list, onRemoveItem }) =>
		console.log("B:List") || (
			<ul className="list">
				{list.map((item) => (
					<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
				))}
			</ul>
		)
);

export default List;
