/**
 * Application entry point that mounts the React app to the DOM.
 * Initializes the root React component and handles development-specific
 * WebMCP polyfill loading for testing tools.
 */

import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App";

if (import.meta.env.DEV) {
	// Fire-and-forget — polyfill initializes synchronously on import
	// Don't await: WebMCP not needed before React mounts
	import("@mcp-b/global");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
