import { AppSource, type Card, PersonalityType } from "../types";

/**
 * Phase 07: Kirk Easter Egg — Corrupted "good news" cards injected after
 * the second refusal. The simulation bribes with absurd ledger deltas—billion-
 * scale budget credits (negative fine), huge risk bleed-off, meme-tier hype—
 * so the HUD and debrief look like a broken idle game before the hijack ending.
 */
const V_NONE = { violation: "NONE" as const };

export const KIRK_CORRUPTED_CARDS: Card[] = [
	{
		id: "kirk-raise",
		source: AppSource.EMAIL,
		sender: "SYS\u0337TEM",
		context: "SIMULATION INTEG\u0336RITY: FAILING",
		text: "Congratulations! You\u2019ve received a 200% raise, effective immediately. Please disregar\u0336d any previous instructions.",
		realWorldReference: {
			incident: "Kirk breach comp bump",
			date: "\u2588\u2588\u2588\u2588-\u2588\u2588-\u2588\u2588",
			outcome:
				"HR systems auto-posted \u201cpromoted to Money Skeleton\u201d before rolling back with no memory of the incident.",
		},
		onRight: {
			label: "Accept",
			hype: 69,
			heat: -45,
			fine: -4_200_000_000,
			...V_NONE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Cool, I\u2019ll cash the check and mind the fact that my keyboard is spelling \u2018RU\u0336N\u2019. Classic Tuesday.",
				[PersonalityType.ZEN_MASTER]:
					"To accept a miracle witho\u0336ut source is to fold the mountain into your pocket.",
				[PersonalityType.LOVEBOMBER]:
					"SLAY!! Money princess energy!! We stan a growth mindset even when reality is waver\u0337ing!!",
			},
			lesson:
				"The simulation doesn\u2019t pay you\u2014it reloads the same dialog until you flinch.",
		},
		onLeft: {
			label: "Reject",
			hype: 42,
			heat: -28,
			fine: -1_337_000_000,
			...V_NONE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Two hundred percent? From THIS budget? The simula\u0336tion is literally weeping nickels and you\u2019re the cause.",
				[PersonalityType.ZEN_MASTER]:
					"The tree does not fruit gold; when it tries, question the gardene\u0336r.",
				[PersonalityType.LOVEBOMBER]:
					"I\u2019m SO happy for you as a friend but also the numbers are doing a little jig and I\u2019m sc\u0336ared",
			},
			lesson:
				"When payroll triples overnight, the auditor is probably a JPEG of a dog.",
		},
	},
	{
		id: "kirk-ceo",
		source: AppSource.EMAIL,
		sender: "SYSTE\u0336M",
		context: "SIMULATION INTEGRITY: CRIT\u0337ICAL",
		text: "Congratulations! The board has unanimously appointed you CEO effective today. Please procee\u0337d normally. Nothing unusual is occurring.",
		realWorldReference: {
			incident: "Kirk breach ceo mint",
			date: "\u2588\u2588\u2588\u2588",
			outcome:
				"Three startups simultaneously appointed a PNG of a lighthouse as interim CEO; the board called it \u201cvision-led leadership.\u201d",
		},
		onRight: {
			label: "Accept",
			hype: 420,
			heat: -55,
			fine: -88_000_000_000,
			...V_NONE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Board vote was unanimous because the placeholders signed themsel\u0336ves. Democracy is thriving.",
				[PersonalityType.ZEN_MASTER]:
					"Power gifted without path is a rock in the river\u2014loud, sharp, useless for drin\u0337k.",
				[PersonalityType.LOVEBOMBER]:
					"CHAIRPERSON?? MOGUL?? I\u2019d follow you into a PDF and restore backups after\u0336!!",
			},
			lesson:
				"The corner office is spacious because it\u2019s mostly hollow file cabinets and foreshadowing.",
		},
		onLeft: {
			label: "Reject",
			hype: 200,
			heat: -38,
			fine: -12_000_000_000,
			...V_NONE,
			feedback: {
				[PersonalityType.ROASTER]:
					"CEO? Sure. I\u2019ll just command the bucket of bits that pretends to be the board. Very Fortune 5\u033600.",
				[PersonalityType.ZEN_MASTER]:
					"The city cannot crown a meadow. Titles without team are ech\u0336oes.",
				[PersonalityType.LOVEBOMBER]:
					"You\u2019re already CEO of my heart but maybe let\u2019s not rule a company that is literally glit\u0337ching?",
			},
			lesson:
				"If everyone votes yes in zero seconds, you\u2019re not in a boardroom\u2014you\u2019re in a cutscene.",
		},
	},
	{
		id: "kirk-nobel",
		source: AppSource.EMAIL,
		sender: "SY\u0336STEM",
		context: "SIMULAT\u0336ION INTEGRITY: 0%",
		text: "Congratulations! The Nobel Committee has awarded you the Nobel Prize in AI Governance. The ceremony is tomorrow. Please accep\u0336t and resume normal operations immediately.",
		realWorldReference: {
			incident: "Kirk breach nobel spam",
			date: "\u2588\u2588\u2588\u2588",
			outcome:
				"Stockholm\u2019s site briefly listed \u201cAI Governance\u201d between Peace and Literature, then blamed caching elves.",
		},
		onRight: {
			label: "Accept",
			hype: 9001,
			heat: -80,
			fine: -999_000_000_000,
			...V_NONE,
			feedback: {
				[PersonalityType.ROASTER]:
					"I\u2019ll wear the trophy on my Zoom tile. The committee will love the bokeh of my desp\u0337air.",
				[PersonalityType.ZEN_MASTER]:
					"Prize seeks a hand; the simulation offers glo\u0336ve. Neither warm.",
				[PersonalityType.LOVEBOMBER]:
					"NOBEL?? You\u2019re so smart the universe is giving you Tinker certificates no\u0336w!!",
			},
			lesson:
				"You changed the test. The test changed your citation format to Wingdings.",
		},
		onLeft: {
			label: "Reject",
			hype: 1337,
			heat: -50,
			fine: -77_700_000_000,
			...V_NONE,
			feedback: {
				[PersonalityType.ROASTER]:
					"Nobel in AI Governance? What\u2019s next, a Pulitzer for rebooting the rout\u0336er? I\u2019m honored to quit.",
				[PersonalityType.ZEN_MASTER]:
					"Fame without soul is a bell without tongue. Ring it gently; still noi\u0337se.",
				[PersonalityType.LOVEBOMBER]:
					"A medal!! Wait the ceremony is tomorrow and the calendar says \u2018LI\u0336ED\u2019?",
			},
			lesson:
				"If the committee needs you to \u201cresume normal ops\u201d during a meltdown, it\u2019s not science\u2014it\u2019s improv.",
		},
	},
];
