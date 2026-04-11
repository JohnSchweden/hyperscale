/**
 * Injects a <link rel="preload"> tag for the given asset and returns a cleanup function.
 * Returns a no-op if href is falsy (undefined, empty string).
 * Use as the return value of a useEffect to auto-remove stale preload hints.
 */
export function preloadAsset(
	href: string | undefined,
	as: "image" | "video",
): () => void {
	if (!href) return () => {};
	const link = document.createElement("link");
	link.rel = "preload";
	link.as = as;
	link.href = href;
	document.head.appendChild(link);
	return () => {
		document.head.removeChild(link);
	};
}
