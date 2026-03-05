import { type Card, RoleType } from "../../types";
import { CLEANING_CARDS } from "./cleaning";
import { DEVELOPMENT_CARDS } from "./development";
import { FINANCE_CARDS } from "./finance";
import { HR_CARDS } from "./hr";
import { MANAGEMENT_CARDS } from "./management";
import { MARKETING_CARDS } from "./marketing";

export { CLEANING_CARDS } from "./cleaning";
export { DEVELOPMENT_CARDS } from "./development";
export { FINANCE_CARDS } from "./finance";
export { HR_CARDS } from "./hr";
export { MANAGEMENT_CARDS } from "./management";
export { MARKETING_CARDS } from "./marketing";

export const ROLE_CARDS: Record<RoleType, Card[]> = {
	[RoleType.DEVELOPMENT]: DEVELOPMENT_CARDS,
	[RoleType.MARKETING]: MARKETING_CARDS,
	[RoleType.MANAGEMENT]: MANAGEMENT_CARDS,
	[RoleType.HR]: HR_CARDS,
	[RoleType.FINANCE]: FINANCE_CARDS,
	[RoleType.CLEANING]: CLEANING_CARDS,
};
