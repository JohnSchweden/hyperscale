import { RoleType } from "../types";

export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
	[RoleType.DEVELOPMENT]:
		'Where "move fast and break things" meets "break compliance."',
	[RoleType.MARKETING]: "The front line of the misinformation war.",
	[RoleType.MANAGEMENT]: "The art of plausible deniability, professionally.",
	[RoleType.HR]:
		"The human firewall. Or human-shaped liability, depending on the day.",
	[RoleType.FINANCE]:
		"The only department that knows how much you've already lost.",
	[RoleType.CLEANING]:
		"The only person who actually knows where the physical servers are hidden.",
};
