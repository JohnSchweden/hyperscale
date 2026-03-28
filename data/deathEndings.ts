import { DeathType } from "../types";

interface DeathEnding {
	title: string;
	description: string;
	icon: string;
	color: string;
}

export const DEATH_ENDINGS: Record<DeathType, DeathEnding> = {
	[DeathType.BANKRUPT]: {
		title: "Liquidated",
		description:
			"The VCs pulled out. Your budget is now negative. The office plants are being auctioned on eBay.",
		icon: "fa-file-invoice-dollar",
		color: "text-red-600",
	},
	[DeathType.REPLACED_BY_SCRIPT]: {
		title: "Replaced by a script",
		description:
			"Turns out a 12-line Python script can do your job better AND comply with regulations. Pack your things.",
		icon: "fa-robot",
		color: "text-cyan-500",
	},
	[DeathType.CONGRESS]: {
		title: "Testifying before Congress",
		description:
			"You're now trending on Twitter and not in a good way. Time to practice saying 'I do not recall' under oath.",
		icon: "fa-landmark",
		color: "text-blue-500",
	},
	[DeathType.FLED_COUNTRY]: {
		title: "Fled the country",
		description:
			"One-way ticket to a country with no extradition treaty. Your LinkedIn now says 'Seeking new opportunities in international compliance avoidance.'",
		icon: "fa-plane-departure",
		color: "text-yellow-500",
	},
	[DeathType.PRISON]: {
		title: "Federal pound-me-in-the-ass prison",
		description:
			"The auditors found your search history AND the offshore accounts. Federal raid in progress. Orange is the new black.",
		icon: "fa-lock",
		color: "text-orange-600",
	},
	[DeathType.AUDIT_FAILURE]: {
		title: "Audit catastrophe",
		description:
			"The external auditors left crying. The CFO just updated their resume. You're now a case study in what NOT to do.",
		icon: "fa-file-circle-xmark",
		color: "text-purple-500",
	},
	[DeathType.KIRK]: {
		title: "SIMULATION BREACH DETECTED",
		description: "You changed the conditions of the test.",
		icon: "fa-triangle-exclamation",
		color: "text-cyan-400",
	},
};
