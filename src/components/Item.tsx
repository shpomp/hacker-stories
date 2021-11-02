import { ReactComponent as Check } from "../check.svg";
import type { Story } from "../App";

type ItemProps = {
	item: Story;
	onRemoveItem: (item: Story) => void;
};

const Item = ({ item, onRemoveItem }: ItemProps) => (
	<li style={{ display: "flex" }}>
		<span style={{ width: "40%" }}>
			<a href={item.url}>{item.title}</a>
		</span>
		<span style={{ width: "30%" }}>{item.author}</span>
		<span style={{ width: "10%" }}>{item.num_comments}</span>
		<span style={{ width: "10%" }}>{item.points}</span>
		<span style={{ width: "10%" }}>
			<button
				className="button buttonSmall"
				type="button"
				onClick={() => onRemoveItem(item)}
			>
				<Check height="18px" width="18px" />
			</button>
		</span>
	</li>
);

export default Item;
