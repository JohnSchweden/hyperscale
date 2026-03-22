/** Shared layout and card styles for PersonalitySelect and RoleSelect stages. */

export const LAYOUT_SHELL_CLASS = "p-4 pb-12 md:p-6 md:pb-16 !bg-transparent";

export const STAGE_CONTAINER_CLASS = "w-full max-w-4xl mx-auto";

export const STAGE_HEADER_CLASS = "text-center mb-6 md:mb-10";

export const STAGE_GRID_CLASS =
	"grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full px-4 md:px-6";

/** Backdrop blur for selection cards, Game Over, Summary, and debrief panels */
export const GLASS_BACKDROP =
	"backdrop-blur-[min(40vw,280px)] backdrop-saturate-100";

/** Dark frosted fill + shadow (matches role/personality cards; add your own border/radius) */
export const GLASS_FILL_STRONG = `bg-black/65 shadow-lg ${GLASS_BACKDROP}`;

/** Full default glass panel — same visual weight as selection cards */
export const GLASS_PANEL_DEFAULT = `border border-white/10 ${GLASS_FILL_STRONG}`;

/** Per card, no extra grid backdrop */
export const SELECT_CARD_BASE = `group p-6 md:p-10 rounded-lg ${GLASS_PANEL_DEFAULT} focus:outline-none flex flex-col transition-colors w-full`;

export const SELECT_CARD_HOVER = "hover:border-cyan-500/35 hover-shadow";
