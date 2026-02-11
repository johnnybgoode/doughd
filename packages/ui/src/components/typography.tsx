import type {
	ElementType,
	HTMLAttributes,
	PropsWithChildren,
	ReactElement,
} from "react";

type HeadingProps = PropsWithChildren<{ level: "1" | "2" | "3" | "4" }>;

export function Heading({ children, level }: HeadingProps) {
	const Tag: ElementType<HTMLAttributes<HTMLHeadingElement>> = `h${level}`;
	const classes = {
		"1": "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
		"2": "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
		"3": "scroll-m-20 text-2xl font-semibold tracking-tight",
		"4": "scroll-m-20 text-xl font-semibold tracking-tight",
	};

	return <Tag className={classes[level]}>{children}</Tag>;
}

export function P({ children }: PropsWithChildren) {
	return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function Blockquote({ children }: PropsWithChildren) {
	return (
		<blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
	);
}

type ListProps = { items: ReactElement[] };
export function List({ items }: ListProps) {
	return (
		<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
			{items.map((item, i) => (
				<li key={i}>{item}</li>
			))}
		</ul>
	);
}
