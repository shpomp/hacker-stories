import Item from "./Item";

// -------------- COMPONENT --------------

const List = ({ list, onRemoveItem }) => (
	<ul className="list">
		{list.map((item) => (
			<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
		))}
	</ul>
);
export default List;