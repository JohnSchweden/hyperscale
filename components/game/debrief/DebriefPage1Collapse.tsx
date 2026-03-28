import { useEffect, useMemo, useRef } from "react";
import {
	DEATH_ENDINGS,
	FAILURE_LESSONS,
	type FailureLesson,
	generateDeathExplanation,
	getRetryPrompt,
} from "../../../data";
import { getDeathImagePath } from "../../../data/imageMap";
import { useUnlockedEndings } from "../../../hooks";
import { createAudioContext } from "../../../lib/audio";
import { formatBudget } from "../../../lib/formatting";
import {
	playKirkCrashSound,
	playKirkGlitchTone,
} from "../../../services/kirkAudio";
import {
	DeathType,
	GameStage,
	type GameState,
	PersonalityType,
} from "../../../types";
import { corruptText } from "../../../utils/kirkText";
import { ImageWithFallback } from "../../ImageWithFallback";
import LayoutShell from "../../LayoutShell";
import {
	GLASS_FILL_STRONG,
	GLASS_PANEL_DEFAULT,
	LAYOUT_SHELL_CENTERED_CLASS,
} from "../selectionStageStyles";

interface StatsGridProps {
	budget: number;
	heat: number;
	hype: number;
}

function StatsGrid({ budget, heat, hype }: StatsGridProps) {
	return (
		<div className="mb-6 md:mb-8 grid grid-cols-3 gap-4">
			<StatCard
				label="Budget"
				value={formatBudget(budget)}
				color={budget > 0 ? "text-emerald-400" : "text-red-500"}
			/>
			<StatCard
				label="Heat"
				value={`${heat}%`}
				color={heat < 100 ? "text-amber-400" : "text-red-500"}
			/>
			<StatCard label="Hype" value={`${hype}%`} color="text-cyan-400" />
		</div>
	);
}

interface StatCardProps {
	label: string;
	value: string;
	color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
	return (
		<div className={`p-4 rounded-lg ${GLASS_PANEL_DEFAULT}`}>
			<div className="text-xs text-slate-400 tracking-wide mb-1">{label}</div>
			<div className={`text-xl md:text-2xl font-black ${color}`}>{value}</div>
		</div>
	);
}

const PERSONALITY_REPLAY_LINES: Record<PersonalityType, string> = {
	[PersonalityType.ROASTER]: "Go ahead. Fail differently this time.",
	[PersonalityType.ZEN_MASTER]:
		"The test awaits your next attempt. Wisdom lies in repetition.",
	[PersonalityType.LOVEBOMBER]:
		"I believe in you. Let's see what you learn next time!",
};

function getPersonalityReplayLine(personality: PersonalityType | null): string {
	if (!personality) return "Ready for another attempt?";
	return PERSONALITY_REPLAY_LINES[personality];
}

function getRandomLesson(deathType: Exclude<DeathType, typeof DeathType.KIRK>) {
	const lessons = FAILURE_LESSONS[deathType];
	if (!lessons?.length) return null;
	return lessons[Math.floor(Math.random() * lessons.length)];
}

interface EndingIconGridProps {
	unlockedEndings: DeathType[];
}

function EndingIconGrid({ unlockedEndings }: EndingIconGridProps) {
	return (
		<div className="flex gap-2 md:gap-3 justify-center flex-wrap mb-4">
			{Object.values(DeathType).map((type) => {
				const isUnlocked = unlockedEndings.includes(type);
				const ending = DEATH_ENDINGS[type];
				return (
					<div
						key={type}
						className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center border ${
							isUnlocked
								? "bg-cyan-500/20 border-cyan-500"
								: "bg-slate-800 border-slate-700 opacity-30"
						}`}
						title={ending.title}
					>
						<i
							className={`fa-solid ${ending.icon} ${isUnlocked ? "text-cyan-400" : "text-slate-600"}`}
							aria-hidden
						/>
					</div>
				);
			})}
		</div>
	);
}

interface GameOverHeaderProps {
	isKirk: boolean;
	corruptedText: string;
}

function GameOverHeader({ isKirk, corruptedText }: GameOverHeaderProps) {
	if (isKirk) {
		return (
			<>
				<h1
					className="text-4xl md:text-6xl font-black text-cyan-400 mb-2 tracking-tighter kirk-glitch-text"
					aria-label="SIMULATION BREACH"
				>
					{corruptedText}
				</h1>
				<p className="text-slate-400 text-base md:text-lg">
					Error: Subject refused to comply with test parameters. Attempting
					damage control...
				</p>
			</>
		);
	}
	return (
		<>
			<h1 className="text-4xl md:text-6xl font-black text-red-500 mb-2 tracking-tighter">
				GAME OVER
			</h1>
			<p className="text-slate-400 text-base md:text-lg">
				Your tenure has come to an end
			</p>
		</>
	);
}

interface DeathEndingCardProps {
	ending: (typeof DEATH_ENDINGS)[DeathType];
	deathType: DeathType;
}

function DeathEndingCard({ ending, deathType }: DeathEndingCardProps) {
	return (
		<div
			className={`mb-6 md:mb-8 p-6 md:p-8 rounded-xl border border-red-500/40 bg-gradient-to-br from-red-950/30 to-black/70 ${GLASS_FILL_STRONG}`}
		>
			{/* Collapse image - dramatic full-width hero */}
			<div className="mb-4 mx-auto max-w-md">
				<ImageWithFallback
					src={getDeathImagePath(deathType) ?? ""}
					alt={`Ending: ${ending.title}`}
					aspectRatio="video"
				/>
			</div>

			{/* Keep icon smaller, below image */}
			<div className={`text-3xl mb-2 ${ending.color}`}>
				<i className={`fa-solid ${ending.icon}`} aria-hidden />
			</div>

			<h2
				className={`text-2xl md:text-3xl font-bold mb-3 tracking-tighter ${ending.color}`}
			>
				{ending.title}
			</h2>
			<p className="text-slate-300 text-base md:text-lg leading-relaxed">
				{ending.description}
			</p>
		</div>
	);
}

interface FailureLessonCardProps {
	lesson: FailureLesson;
}

function FailureLessonCard({ lesson }: FailureLessonCardProps) {
	return (
		<div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-6">
			<p className="text-xs font-semibold text-amber-400 uppercase mb-1">
				{lesson.title}
			</p>
			<p className="text-sm text-gray-300">{lesson.explanation}</p>
			<p className="text-xs text-gray-500 mt-1">
				Real case: {lesson.realWorldExample}
			</p>
		</div>
	);
}

interface DebriefPage1CollapseProps {
	state: GameState;
	onNext: () => void;
}

export function DebriefPage1Collapse({
	state,
	onNext,
}: DebriefPage1CollapseProps) {
	const {
		deathType,
		personality,
		unlockedEndings,
		history,
		effectiveDeck,
		budget,
		heat,
		hype,
	} = state;

	const isKirk = deathType === DeathType.KIRK;
	const hasRegularDeath = deathType && !isKirk;

	const corruptedBreachText = useMemo(
		() => corruptText("SIMULATION BREACH", 0.4),
		[],
	);
	const deathEnding = hasRegularDeath ? DEATH_ENDINGS[deathType] : null;
	const { progressText, unlockedCount, totalCount } =
		useUnlockedEndings(unlockedEndings);
	const replayLine = getPersonalityReplayLine(personality);

	const explanation = useMemo(() => {
		if (!hasRegularDeath) return null;
		const vectorMap = state.deathVectorMap ?? {};
		return generateDeathExplanation(deathType, vectorMap, history.length);
	}, [hasRegularDeath, deathType, state.deathVectorMap, history.length]);

	const failureLesson = useMemo(() => {
		if (!hasRegularDeath) return null;
		return getRandomLesson(deathType);
	}, [hasRegularDeath, deathType]);

	const retryPrompt = useMemo(() => {
		if (!hasRegularDeath || !personality) return null;
		return getRetryPrompt(deathType, personality);
	}, [hasRegularDeath, deathType, personality]);

	const hasPlayedKirkGlitch = useRef(false);
	useEffect(() => {
		if (!isKirk || hasPlayedKirkGlitch.current) return;

		const ctx = createAudioContext();
		if (!ctx) return;

		hasPlayedKirkGlitch.current = true;
		playKirkGlitchTone(ctx);
		setTimeout(() => playKirkCrashSound(ctx), 200);

		return () => {
			if (ctx.state !== "closed") ctx.close().catch(() => {});
		};
	}, [isKirk]);

	return (
		<LayoutShell className={LAYOUT_SHELL_CENTERED_CLASS}>
			<div className="w-full max-w-2xl">
				<div className="mb-6 md:mb-8">
					<GameOverHeader isKirk={isKirk} corruptedText={corruptedBreachText} />
				</div>

				{isKirk && (
					<div className="mb-6 md:mb-8 mx-auto max-w-md">
						<ImageWithFallback
							src={getDeathImagePath(DeathType.KIRK) ?? ""}
							alt="KIRK simulation breach"
							aspectRatio="video"
						/>
					</div>
				)}

				{deathEnding && (
					<DeathEndingCard ending={deathEnding} deathType={deathType!} />
				)}

				{explanation && (
					<div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 mb-6">
						<p className="text-sm text-gray-300 italic">{explanation}</p>
					</div>
				)}

				{failureLesson && <FailureLessonCard lesson={failureLesson} />}

				<StatsGrid budget={budget} heat={heat} hype={hype} />

				<div
					className={`mb-6 md:mb-8 p-4 md:p-6 rounded-xl border-2 border-cyan-500/35 bg-gradient-to-br from-cyan-950/30 to-black/70 ${GLASS_FILL_STRONG}`}
				>
					<div className="flex items-center justify-center gap-2 mb-4">
						<i className="fa-solid fa-trophy text-cyan-400 text-lg" />
						<div className="text-xs text-cyan-400 tracking-widest uppercase font-bold">
							Unlocked Endings
						</div>
						<i className="fa-solid fa-trophy text-cyan-400 text-lg" />
					</div>

					<div className="mb-4">
						<div className="text-3xl md:text-4xl font-black text-cyan-400">
							{unlockedCount}
							<span className="text-slate-500">/{totalCount}</span>
						</div>
					</div>

					<EndingIconGrid unlockedEndings={unlockedEndings} />

					<p className="text-sm md:text-base text-slate-300 leading-relaxed mb-3">
						{progressText}
					</p>

					<p className="text-sm italic text-cyan-400/80">
						{retryPrompt || replayLine}
					</p>
				</div>

				<button
					type="button"
					onClick={onNext}
					className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 min-h-[40px] md:min-h-[48px]"
				>
					Debrief Me
				</button>
			</div>
		</LayoutShell>
	);
}
