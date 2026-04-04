import type { UseWebMCPToolsDeps } from "@/hooks/useWebMCPTools";
import { useWebMCPTools } from "@/hooks/useWebMCPTools";

/**
 * Dev-only component that registers all WebMCP game control tools.
 * Renders null — purely a side-effect hook host.
 * Mounted conditionally via {import.meta.env.DEV && <WebMCPToolsProvider ... />}.
 */
export function WebMCPToolsProvider(deps: UseWebMCPToolsDeps) {
	useWebMCPTools(deps);
	return null;
}
