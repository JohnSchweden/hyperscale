import { AppSource } from "../types";

/** Maps each AppSource enum value to its Font Awesome solid icon class */
export const SOURCE_ICONS: Record<AppSource, string> = {
	[AppSource.SLACK]: "fa-hashtag",
	[AppSource.EMAIL]: "fa-envelope",
	[AppSource.TERMINAL]: "fa-terminal",
	[AppSource.IDE]: "fa-terminal",
	[AppSource.JIRA]: "fa-list-check",
	[AppSource.NOTION]: "fa-file-lines",
	[AppSource.MEETING]: "fa-users",
};
