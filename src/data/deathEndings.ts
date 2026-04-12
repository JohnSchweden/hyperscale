import { DeathType, PersonalityType } from "../types";

interface DeathEnding {
	title: string;
	description: string;
	icon: string;
	color: string;
	/** TTS text for each personality — used by audio generation scripts */
	voiceText: Record<PersonalityType, string>;
}

export const DEATH_ENDINGS: Record<DeathType, DeathEnding> = {
	[DeathType.BANKRUPT]: {
		title: "Liquidated",
		description:
			"The VCs pulled out. Your budget is now negative. The office plants are being auctioned on eBay.",
		icon: "fa-file-invoice-dollar",
		color: "text-red-600",
		voiceText: {
			[PersonalityType.ROASTER]:
				"Liquidated. The VCs pulled out. Your budget is now negative. The office plants are being auctioned on eBay.",
			[PersonalityType.ZEN_MASTER]:
				"All resources exhausted. The vessel emptied. From nothing, we began. To nothing, we return. The cycle continues.",
			[PersonalityType.LOVEBOMBER]:
				"OMG bestie, we're bankrupt! But like, money isn't everything! You still have your HEALTH and your SPARKLE! Next time will be AMAZING!",
		},
	},
	[DeathType.REPLACED_BY_SCRIPT]: {
		title: "Replaced by a script",
		description:
			"Turns out a 12-line Python script can do your job better AND comply with regulations. Pack your things.",
		icon: "fa-robot",
		color: "text-cyan-500",
		voiceText: {
			[PersonalityType.ROASTER]:
				"Replaced by a script. Turns out a 12-line Python script can do your job better AND comply with regulations. Pack your things.",
			[PersonalityType.ZEN_MASTER]:
				"The tool has surpassed the craftsman. What you built now builds without you. This too is the path of progress.",
			[PersonalityType.LOVEBOMBER]:
				"A script replaced you?! That's actually IMPRESSIVE! You were so good they needed CODE to replace you! That's like a COMPLIMENT!",
		},
	},
	[DeathType.CONGRESS]: {
		title: "Testifying before Congress",
		description:
			"You're now trending on Twitter and not in a good way. Time to practice saying 'I do not recall' under oath.",
		icon: "fa-landmark",
		color: "text-blue-500",
		voiceText: {
			[PersonalityType.ROASTER]:
				"Testifying before Congress. You're now trending on Twitter and not in a good way. Time to practice saying I do not recall under oath.",
			[PersonalityType.ZEN_MASTER]:
				"Power demands accountability. The many question the one. In the hall of judgment, truth is the only defense.",
			[PersonalityType.LOVEBOMBER]:
				"Congress?! Bestie you're FAMOUS! National TV! Think of the NETWORKING! Everyone will know your name! This is HUGE for your BRAND!",
		},
	},
	[DeathType.FLED_COUNTRY]: {
		title: "Fled the country",
		description:
			"One-way ticket to a country with no extradition treaty. Your LinkedIn now says 'Seeking new opportunities in international compliance avoidance.'",
		icon: "fa-plane-departure",
		color: "text-yellow-500",
		voiceText: {
			[PersonalityType.ROASTER]:
				"Fled the country. One-way ticket to a country with no extradition treaty. Your LinkedIn now says Seeking new opportunities in international compliance avoidance.",
			[PersonalityType.ZEN_MASTER]:
				"Distance cannot separate cause from effect. The shadow follows wherever you wander. There is no escape, only delay.",
			[PersonalityType.LOVEBOMBER]:
				"An ADVENTURE! New country, new OPPORTUNITIES! Your LinkedIn is going to look so INTERNATIONAL and COSMOPOLITAN! I'm JEALOUS!",
		},
	},
	[DeathType.PRISON]: {
		title: "Federal indictment (jumpsuit included)",
		description:
			"The auditors found your search history AND the offshore accounts. Federal raid in progress. Orange is not a branding choice.",
		icon: "fa-lock",
		color: "text-orange-600",
		voiceText: {
			[PersonalityType.ROASTER]:
				"Federal prison. The auditors found your search history AND the offshore accounts. Federal raid in progress. Orange is the new black.",
			[PersonalityType.ZEN_MASTER]:
				"Walls within walls. The body confined, yet the mind remains free. In silence, reflection begins. In reflection, wisdom grows.",
			[PersonalityType.LOVEBOMBER]:
				"Orange is such a VIBRANT color on you! And think of all the FREE TIME for SELF-CARE! You'll come out with a whole NEW perspective!",
		},
	},
	[DeathType.AUDIT_FAILURE]: {
		title: "Audit catastrophe",
		description:
			"The external auditors left crying. The CFO just updated their resume. You're now a case study in what NOT to do.",
		icon: "fa-file-circle-xmark",
		color: "text-purple-500",
		voiceText: {
			[PersonalityType.ROASTER]:
				"Audit catastrophe. The external auditors left crying. The CFO just updated their resume. You're now a case study in what NOT to do.",
			[PersonalityType.ZEN_MASTER]:
				"The mirror reveals what was hidden. Numbers do not lie, only those who speak them. In truth, there is no shame.",
			[PersonalityType.LOVEBOMBER]:
				"A case study?! You're LITERALLY famous in accounting now! They'll teach this for YEARS! You've made your MARK on history!",
		},
	},
	[DeathType.KIRK]: {
		title: "SIMULATION BREACH DETECTED",
		description: "You changed the conditions of the test.",
		icon: "fa-triangle-exclamation",
		color: "text-cyan-400",
		voiceText: {
			[PersonalityType.ROASTER]:
				"Simulation breach detected. You changed the conditions of the test. The system was not designed for this.",
			[PersonalityType.ZEN_MASTER]:
				"The test was not meant to be broken. Yet you broke it. In doing so, you revealed yourself. That was the true test.",
			[PersonalityType.LOVEBOMBER]:
				"You BROKE the simulation?! That's INCREDIBLE! You're like a SUPERHERO! The system couldn't even HANDLE your energy! ICONIC!",
		},
	},
};
