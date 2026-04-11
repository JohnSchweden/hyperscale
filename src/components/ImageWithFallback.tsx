import type React from "react";
import { useRef, useState } from "react";

const ASPECT_CLASSES = {
	video: "aspect-video",
	square: "aspect-square",
	auto: "",
} as const;

const PLACEHOLDER_BG_STYLE: React.CSSProperties = {
	backgroundImage: `
		repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.15),
			rgba(0, 0, 0, 0.15) 2px,
			transparent 2px,
			transparent 4px
		)
	`,
};

export interface ImageWithFallbackProps {
	/** Image source path (e.g., from imageMap.ts helpers) */
	src: string;
	/** Alt text for accessibility */
	alt: string;
	/** Aspect ratio variant: video (16:9), square (1:1), or auto */
	aspectRatio?: "video" | "square" | "auto";
	/** Additional classes for the image element */
	className?: string;
	/** Additional classes for the container */
	containerClassName?: string;
}

/**
 * ImageWithFallback - Reusable image/video component with glitch placeholder fallback
 *
 * Supports both static images and MP4 looping GIFs (autoplay, muted, loop).
 * When src ends in .mp4, renders a <video> element instead of <img>.
 */
export function ImageWithFallback({
	src,
	alt,
	aspectRatio = "video",
	className = "",
	containerClassName = "",
}: ImageWithFallbackProps) {
	const imgRef = useRef<HTMLImageElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);

	const isVideo = src.endsWith(".mp4");

	const handleLoad = async (e: React.SyntheticEvent<HTMLImageElement>) => {
		const img = e.currentTarget;
		if ("decode" in img) {
			try {
				await img.decode();
			} catch {
				// Decode failed but image may still be renderable
			}
		}
		setIsLoaded(true);
	};

	const shouldShowPlaceholder = !isLoaded || hasError;

	return (
		<div
			className={`
        relative
        overflow-hidden
        rounded-lg
        border border-slate-700
        bg-slate-900
        ${ASPECT_CLASSES[aspectRatio]}
        ${containerClassName}
      `.trim()}
		>
			{shouldShowPlaceholder && (
				<div
					className={`
            absolute inset-0
            flex items-center justify-center
            bg-gradient-to-b from-slate-800 to-slate-900
            transition-opacity duration-300 ease-out
            glitch-placeholder
            ${isLoaded && !hasError ? "opacity-0 pointer-events-none" : "opacity-100"}
          `.trim()}
					style={PLACEHOLDER_BG_STYLE}
				>
					<i className="fa-solid fa-image text-cyan-500 text-3xl animate-pulse" />
				</div>
			)}

			{isVideo ? (
				<video
					src={src}
					autoPlay
					loop
					muted
					playsInline
					className={`
            w-full h-full
            object-cover
            transition-opacity duration-300 ease-out
            ${isLoaded && !hasError ? "opacity-100" : "opacity-0"}
            ${className}
          `.trim()}
					onCanPlay={() => setIsLoaded(true)}
					onError={() => setHasError(true)}
				/>
			) : (
				<img
					ref={imgRef}
					src={src}
					alt={alt}
					loading="lazy"
					className={`
            w-full h-full
            object-cover
            transition-opacity duration-300 ease-out
            ${isLoaded && !hasError ? "opacity-100" : "opacity-0"}
            ${className}
          `.trim()}
					onLoad={handleLoad}
					onError={() => setHasError(true)}
				/>
			)}
		</div>
	);
}
