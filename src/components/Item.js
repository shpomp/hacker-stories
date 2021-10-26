const Item = ({ item, onRemoveItem }) => {
	return (
		<li>
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
			<span>
				<button type="button" onClick={() => onRemoveItem(item)}>
					delete
				</button>
			</span>
		</li>
	);
};

export default Item;
