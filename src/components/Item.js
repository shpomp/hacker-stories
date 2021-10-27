import styles from "../App.module.css";

const Item = ({ item, onRemoveItem }) => {
	return (
		<li className={styles.item}>
			<span style={{ width: "40%" }}>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
			<span>
				<button
					type="button"
					onClick={() => onRemoveItem(item)}
					className={`${styles.button} ${styles.buttonSmall}`}
				>
					delete
				</button>
			</span>
		</li>
	);
};

export default Item;
