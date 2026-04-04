// Re-export from submodules

// Re-export initial state from main file
export { initialGameState } from "../useGameState";
export {
	createGameOverState,
	type DeathResolution,
	getRoleDeck,
	getUnlockedEndings,
	resolveDeathType,
} from "./deathResolver";
export {
	getDebugState,
	getHydratedState,
	getPlayingState,
	getRoleSelectState,
	getSavedState,
	type HydratedStateData,
} from "./hydration";
