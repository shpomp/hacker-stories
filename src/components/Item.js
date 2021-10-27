import { ReactComponent as Check } from "../check.svg";

// -------------- COMPONENT --------------

const Item = ({ item, onRemoveItem }) => {
	return (
		<li className="item">
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
			<span>
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
};

export default Item;
