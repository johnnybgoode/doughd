import { useMediaQuery } from "../hooks/useMediaQuery";

const PREFERRED_IMAGE_WIDTH = 384;
const MOBILE_PADDING = 16;
const ASPECT_RATIO_WIDTH = 16;
const ASPECT_RATIO_HEIGHT = 9;

type ImageProps = {
	alt: string;
	src: string;
	width?: number;
};

export function Image({ alt, src, width }: ImageProps) {
	const isTabletAndUp = useMediaQuery("(min-width: 600px)");

	const imageWidth = Math.min(
		width || PREFERRED_IMAGE_WIDTH,
		window.innerWidth - MOBILE_PADDING,
	);
	const imageHeight = imageWidth / (ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT);

	return (
		<img
			alt={alt}
			decoding={isTabletAndUp ? "sync" : "async"}
			height={imageHeight}
			loading={isTabletAndUp ? "eager" : "lazy"}
			src={`${src}&w=${imageWidth * window.devicePixelRatio}`}
			width={imageWidth}
		/>
	);
}
