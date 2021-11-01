import { useEffect, useRef } from "react";

// -------------- COMPONENT --------------

type InputWithLabelProps = {
	id: string;
	value: string;
	type?: string;
	onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	isFocused?: boolean;
	children: React.ReactNode;
};

const InputWithLabel = ({
	id,
	value,
	type = "text",
	onInputChange,
	isFocused,
	children,
}: InputWithLabelProps) => {
	const inputRef = useRef<HTMLInputElement>(null!);

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
