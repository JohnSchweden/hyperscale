import { chromium, type Page } from "playwright";
import {
	DeathType,
	GameStage,
	PersonalityType,
	RoleType,
} from "../../../types";

const BASE_URL = "https://localhost:3000";
const OUTPUT_DIR = "tests/screenshots/phase06-verification";

// Viewport configurations
const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 393, height: 851 };

interface ScreenshotConfig {
	name: string;
	description: string;
}

// Helper to capture screenshot with both viewports
async function captureScreenshot(page: Page, config: ScreenshotConfig) {
	// Desktop screenshot
	await page.setViewportSize(DESKTOP_VIEWPORT);
	await page.waitForTimeout(300);
	await page.screenshot({
		path: `${OUTPUT_DIR}/${config.name}-desktop.png`,
		fullPage: false,
	});

	// Mobile screenshot
	await page.setViewportSize(MOBILE_VIEWPORT);
	await page.waitForTimeout(300);
	await page.screenshot({
		path: `${OUTPUT_DIR}/${config.name}-mobile.png`,
		fullPage: false,
	});
}

// Helper to set full game state via localStorage and reload
async function setFullGameState(page: Page, state: object) {
	await page.evaluate((gameState) => {
		localStorage.setItem("km-debug-state", JSON.stringify(gameState));
	}, state);
	await page.reload();
	await page.waitForLoadState("networkidle");
}

async function main() {
	const browser = await chromium.launch({
		headless: true,
		args: ["--ignore-certificate-errors"],
	});

	const context = await browser.newContext({
		ignoreHTTPSErrors: true,
	});

	const page = await context.newPage();

	console.log("Starting screenshot capture...");
	console.log(`Output directory: ${OUTPUT_DIR}`);

	// ==========================================
	// LANDING PAGE
	// ==========================================
	console.log("\n📸 Capturing: Landing Page...");
	await page.goto(BASE_URL);
	await page.waitForLoadState("networkidle");
	await page.waitForTimeout(800);

	await captureScreenshot(page, {
		name: "01-landing-page",
		description: "K-Maru intro/landing page with game premise",
	});

	// ==========================================
	// PERSONALITY SELECTION
	// ==========================================
	console.log("\n📸 Capturing: Personality Selection...");
	await page.click("text=Boot system");
	await page.waitForTimeout(800);

	await captureScreenshot(page, {
		name: "02-personality-select",
		description:
			"Personality selection showing Roaster, Zen Master, and Lovebomber",
	});

	// ==========================================
	// ROLE SELECTION
	// ==========================================
	console.log("\n📸 Capturing: Role Selection...");
	await page.click("text=V.E.R.A"); // Select Roaster
	await page.waitForTimeout(800);

	await captureScreenshot(page, {
		name: "03-role-select",
		description: "Role selection screen showing various job titles",
	});

	// ==========================================
	// INITIALIZING SCREEN
	// ==========================================
	console.log("\n📸 Capturing: Initializing Screen...");
	await page.click("text=Vibe Coder");
	await page.waitForTimeout(800);

	await captureScreenshot(page, {
		name: "04-initializing",
		description: "Initializing screen with countdown and role confirmation",
	});

	// ==========================================
	// GAMEPLAY SCREEN
	// ==========================================
	console.log("\n📸 Capturing: Gameplay Screen...");
	await page.waitForTimeout(4500); // Wait for countdown and game screen to load

	await captureScreenshot(page, {
		name: "05-gameplay",
		description:
			"Active gameplay with card, HUD showing hype/heat/budget metrics",
	});

	// ==========================================
	// GAMEPLAY WITH DIFFERENT PERSONALITIES
	// ==========================================
	const personalities = [
		{ name: "roaster", label: "V.E.R.A" },
		{ name: "zen-master", label: "BAMBOO" },
		{ name: "lovebomber", label: "HYPE-BRO" },
	];

	for (const personality of personalities) {
		console.log(`\n📸 Capturing: Gameplay - ${personality.name}...`);

		// Navigate back to personality select
		await setFullGameState(page, {
			stage: GameStage.PERSONALITY_SELECT,
			hype: 50,
			heat: 0,
			budget: 10000000,
			personality: null,
			role: null,
			currentCardIndex: 0,
			history: [],
			deathReason: null,
			deathType: null,
			unlockedEndings: [],
			bossFightAnswers: [],
			effectiveDeck: null,
		});
		await page.waitForTimeout(600);

		await page.click(`text=${personality.label}`);
		await page.waitForTimeout(600);
		await page.click("text=Vibe Coder");
		await page.waitForTimeout(4500); // Countdown and load

		await captureScreenshot(page, {
			name: `14-gameplay-${personality.name}`,
			description: `Gameplay with ${personality.name} personality`,
		});
	}

	// ==========================================
	// GAME OVER (DEBRIEF PAGE 0) - Different Death Types
	// ==========================================
	const deathConfigs = [
		{ type: DeathType.BANKRUPT, name: "bankrupt", budget: -25000 },
		{ type: DeathType.REPLACED_BY_SCRIPT, name: "replaced", budget: 15000 },
		{ type: DeathType.CONGRESS, name: "congress", budget: 20000 },
		{ type: DeathType.FLED_COUNTRY, name: "fled", budget: 30000 },
		{ type: DeathType.PRISON, name: "prison", budget: 10000 },
		{ type: DeathType.AUDIT_FAILURE, name: "audit", budget: 5000 },
	];

	for (const death of deathConfigs) {
		console.log(`\n📸 Capturing: Game Over - ${death.type}...`);

		await setFullGameState(page, {
			stage: GameStage.DEBRIEF_PAGE_1,
			hype: 30,
			heat: death.type === DeathType.BANKRUPT ? 40 : 95,
			budget: death.budget,
			personality: PersonalityType.ROASTER,
			role: RoleType.VIBE_CODER,
			currentCardIndex: 5,
			history: [
				{ cardId: "vibe-1", choice: "RIGHT" },
				{ cardId: "vibe-2", choice: "LEFT" },
				{ cardId: "vibe-3", choice: "RIGHT" },
				{ cardId: "vibe-4", choice: "RIGHT" },
				{ cardId: "vibe-5", choice: "LEFT" },
			],
			deathReason: `Game ended due to ${death.type}`,
			deathType: death.type,
			unlockedEndings: [death.type],
			bossFightAnswers: [],
			effectiveDeck: null,
		});
		await page.waitForTimeout(800);

		await captureScreenshot(page, {
			name: `07-game-over-${death.name}`,
			description: `Debrief page 1 (death) with ${death.type} ending`,
		});
	}

	// ==========================================
	// DEBRIEF PAGE 1 - Different Personalities
	// ==========================================
	for (const personality of personalities) {
		console.log(`\n📸 Capturing: Debrief Page 1 - ${personality.name}...`);

		const personalityType =
			personality.name === "roaster"
				? PersonalityType.ROASTER
				: personality.name === "zen-master"
					? PersonalityType.ZEN_MASTER
					: PersonalityType.LOVEBOMBER;

		await setFullGameState(page, {
			stage: GameStage.DEBRIEF_PAGE_1,
			hype: 35,
			heat: 75,
			budget: 25000,
			personality: personalityType,
			role: RoleType.VIBE_CODER,
			currentCardIndex: 6,
			history: [
				{ cardId: "vibe-1", choice: "RIGHT" },
				{ cardId: "vibe-2", choice: "LEFT" },
				{ cardId: "vibe-3", choice: "RIGHT" },
				{ cardId: "vibe-4", choice: "LEFT" },
				{ cardId: "vibe-5", choice: "RIGHT" },
				{ cardId: "vibe-6", choice: "LEFT" },
			],
			deathReason: "Heat exceeded maximum threshold",
			deathType: DeathType.PRISON,
			unlockedEndings: [DeathType.PRISON],
			bossFightAnswers: [],
			effectiveDeck: null,
		});
		await page.waitForTimeout(800);

		await captureScreenshot(page, {
			name: `08-debrief-page1-${personality.name}`,
			description: `Debrief page 1 (Collapse/Game Over) with ${personality.name} personality`,
		});
	}

	// ==========================================
	// DEBRIEF PAGE 2 - Audit Trail with Different Personalities
	// ==========================================
	for (const personality of personalities) {
		console.log(`\n📸 Capturing: Debrief Page 2 - ${personality.name}...`);

		const personalityType =
			personality.name === "roaster"
				? PersonalityType.ROASTER
				: personality.name === "zen-master"
					? PersonalityType.ZEN_MASTER
					: PersonalityType.LOVEBOMBER;

		await setFullGameState(page, {
			stage: GameStage.DEBRIEF_PAGE_2,
			hype: 35,
			heat: 75,
			budget: 25000,
			personality: personalityType,
			role: RoleType.VIBE_CODER,
			currentCardIndex: 6,
			history: [
				{ cardId: "vibe-1", choice: "RIGHT" },
				{ cardId: "vibe-2", choice: "LEFT" },
				{ cardId: "vibe-3", choice: "RIGHT" },
				{ cardId: "vibe-4", choice: "LEFT" },
				{ cardId: "vibe-5", choice: "RIGHT" },
				{ cardId: "vibe-6", choice: "LEFT" },
			],
			deathReason: "Heat exceeded maximum threshold",
			deathType: DeathType.PRISON,
			unlockedEndings: [DeathType.PRISON],
			bossFightAnswers: [],
			effectiveDeck: null,
		});
		await page.waitForTimeout(800);

		await captureScreenshot(page, {
			name: `09-debrief-page2-${personality.name}`,
			description: `Debrief page 2 (Audit Trail) showing decision history with ${personality.name}`,
		});
	}

	// ==========================================
	// DEBRIEF PAGE 3 - Different Archetypes
	// ==========================================
	const archetypes = [
		{ id: "PRAGMATIST", name: "pragmatist" },
		{ id: "SHADOW_ARCHITECT", name: "shadow-architect" },
		{ id: "DISRUPTOR", name: "disruptor" },
		{ id: "CONSERVATIVE", name: "conservative" },
		{ id: "BALANCED", name: "balanced" },
		{ id: "CHAOS_AGENT", name: "chaos-agent" },
	];

	for (const archetype of archetypes) {
		console.log(`\n📸 Capturing: Debrief Page 3 - ${archetype.id}...`);

		await setFullGameState(page, {
			stage: GameStage.DEBRIEF_PAGE_3,
			hype: 35,
			heat: 75,
			budget: 25000,
			personality: PersonalityType.ROASTER,
			role: RoleType.VIBE_CODER,
			currentCardIndex: 6,
			history: [
				{ cardId: "vibe-1", choice: "RIGHT" },
				{ cardId: "vibe-2", choice: "LEFT" },
				{ cardId: "vibe-3", choice: "RIGHT" },
				{ cardId: "vibe-4", choice: "LEFT" },
				{ cardId: "vibe-5", choice: "RIGHT" },
				{ cardId: "vibe-6", choice: "LEFT" },
			],
			deathReason: "Heat exceeded maximum threshold",
			deathType: DeathType.PRISON,
			unlockedEndings: [DeathType.PRISON],
			bossFightAnswers: [],
			effectiveDeck: null,
		});
		await page.waitForTimeout(800);

		await captureScreenshot(page, {
			name: `10-debrief-page3-${archetype.name}`,
			description: `Debrief page 3 (Verdict) showing ${archetype.id} archetype reveal`,
		});
	}

	// ==========================================
	// DEBRIEF PAGE 3 - Different Progress Levels
	// ==========================================
	const progressLevels = [
		{ endings: [DeathType.PRISON], label: "1of6" },
		{
			endings: [
				DeathType.PRISON,
				DeathType.BANKRUPT,
				DeathType.REPLACED_BY_SCRIPT,
			],
			label: "3of6",
		},
		{
			endings: [
				DeathType.PRISON,
				DeathType.BANKRUPT,
				DeathType.REPLACED_BY_SCRIPT,
				DeathType.CONGRESS,
				DeathType.FLED_COUNTRY,
				DeathType.AUDIT_FAILURE,
			],
			label: "6of6",
		},
	];

	for (const progress of progressLevels) {
		console.log(
			`\n📸 Capturing: Debrief Page 3 - Progress ${progress.label}...`,
		);

		await setFullGameState(page, {
			stage: GameStage.DEBRIEF_PAGE_3,
			hype: 35,
			heat: 75,
			budget: 25000,
			personality: PersonalityType.ROASTER,
			role: RoleType.VIBE_CODER,
			currentCardIndex: 6,
			history: [
				{ cardId: "vibe-1", choice: "RIGHT" },
				{ cardId: "vibe-2", choice: "LEFT" },
				{ cardId: "vibe-3", choice: "RIGHT" },
				{ cardId: "vibe-4", choice: "LEFT" },
				{ cardId: "vibe-5", choice: "RIGHT" },
				{ cardId: "vibe-6", choice: "LEFT" },
			],
			deathReason: "Heat exceeded maximum threshold",
			deathType: DeathType.PRISON,
			unlockedEndings: progress.endings,
			bossFightAnswers: [],
			effectiveDeck: null,
		});
		await page.waitForTimeout(800);

		await captureScreenshot(page, {
			name: `11-debrief-page3-progress-${progress.label}`,
			description: `Debrief page 3 showing progress (${progress.label} endings unlocked)`,
		});
	}

	// ==========================================
	// ALTERNATIVE ROLES SHOWCASE
	// ==========================================
	const roles = [
		{ role: RoleType.CHIEF_SOMETHING_OFFICER, name: "chief-something-officer" },
		{ role: RoleType.AGENTIC_ENGINEER, name: "agentic-engineer" },
		{ role: RoleType.DATA_SCIENTIST, name: "data-scientist" },
	];

	for (const roleConfig of roles) {
		console.log(`\n📸 Capturing: Role ${roleConfig.name}...`);

		await setFullGameState(page, {
			stage: GameStage.INITIALIZING,
			hype: 50,
			heat: 0,
			budget: 10000000,
			personality: PersonalityType.ZEN_MASTER,
			role: roleConfig.role,
			currentCardIndex: 0,
			history: [],
			deathReason: null,
			deathType: null,
			unlockedEndings: [],
			bossFightAnswers: [],
			effectiveDeck: null,
		});
		await page.waitForTimeout(800);

		await captureScreenshot(page, {
			name: `13-role-${roleConfig.name}`,
			description: `Initializing screen for ${roleConfig.name} role`,
		});
	}

	// ==========================================
	// DEBRIEF PAGE 1 — victory (boss success)
	// ==========================================
	console.log("\n📸 Capturing: Debrief Page 1 (Quarter survived)...");
	await setFullGameState(page, {
		stage: GameStage.DEBRIEF_PAGE_1,
		hype: 85,
		heat: 30,
		budget: 125000,
		personality: PersonalityType.ROASTER,
		role: RoleType.VIBE_CODER,
		currentCardIndex: 10,
		history: [
			{ cardId: "vibe-1", choice: "RIGHT" },
			{ cardId: "vibe-2", choice: "LEFT" },
			{ cardId: "vibe-3", choice: "RIGHT" },
			{ cardId: "vibe-4", choice: "LEFT" },
			{ cardId: "vibe-5", choice: "RIGHT" },
			{ cardId: "vibe-6", choice: "LEFT" },
			{ cardId: "vibe-7", choice: "RIGHT" },
			{ cardId: "vibe-8", choice: "LEFT" },
			{ cardId: "vibe-9", choice: "RIGHT" },
			{ cardId: "vibe-10", choice: "LEFT" },
		],
		deathReason: null,
		deathType: null,
		unlockedEndings: [],
		bossFightAnswers: [true, true, true],
		effectiveDeck: null,
	});
	await page.waitForTimeout(800);

	await captureScreenshot(page, {
		name: "12-summary-success",
		description:
			"Debrief page 1 (Quarter survived) after successful boss fight",
	});

	// ==========================================
	// BOSS FIGHT
	// ==========================================
	console.log("\n📸 Capturing: Boss Fight...");
	await setFullGameState(page, {
		stage: GameStage.BOSS_FIGHT,
		hype: 70,
		heat: 45,
		budget: 75000,
		personality: PersonalityType.ROASTER,
		role: RoleType.VIBE_CODER,
		currentCardIndex: 8,
		history: [
			{ cardId: "vibe-1", choice: "RIGHT" },
			{ cardId: "vibe-2", choice: "LEFT" },
			{ cardId: "vibe-3", choice: "RIGHT" },
			{ cardId: "vibe-4", choice: "LEFT" },
			{ cardId: "vibe-5", choice: "RIGHT" },
			{ cardId: "vibe-6", choice: "LEFT" },
			{ cardId: "vibe-7", choice: "RIGHT" },
			{ cardId: "vibe-8", choice: "LEFT" },
		],
		deathReason: null,
		deathType: null,
		unlockedEndings: [],
		bossFightAnswers: [],
		effectiveDeck: null,
	});
	await page.waitForTimeout(800);

	await captureScreenshot(page, {
		name: "06-boss-fight",
		description: "Boss fight screen with compliance questions and timer",
	});

	await browser.close();

	console.log("\n✅ Screenshot capture complete!");
	console.log(`Total screenshots captured: ~50 (25 scenes × 2 viewports)`);
	console.log(`Output directory: ${OUTPUT_DIR}`);
}

main().catch((error) => {
	console.error("Error capturing screenshots:", error);
	process.exit(1);
});
