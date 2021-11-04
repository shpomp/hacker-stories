import { useEffect, useRef } from "react";

const InputWithLabel = ({
	id,
	value,
	type = "text",
	onInputChange,
	isFocused,
	children,
}) => {
	const inputRef = useRef("");

	useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isFocused]);
	return (
		<>
			<label className="label" htmlFor={id}>
				{children}
			</label>
			&nbsp;
			<input
				ref={inputRef}
				id={id}
				type={type}
				value={value}
				onChange={onInputChange}
				className="input"
			/>
		</>
	);
};

export default InputWithLabel;
