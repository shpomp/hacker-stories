import Item from "./Item";
import type { Story } from "../App";

type Stories = Array<Story>;

type ListProps = {
	list: Stories;
	onRemoveItem: (item: Story) => void;
};

// -------------- COMPONENT --------------

const List = ({ list, onRemoveItem }: ListProps) => (
	<ul className="list">
		{list.map((item) => (
			<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
		))}
	</ul>
);
export default List;
