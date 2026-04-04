import { useEffect, useMemo, useRef } from "react";
import {
	DEATH_ENDINGS,
	FAILURE_LESSONS,
	type FailureLesson,
	generateDeathExplanation,
} from "../../../data";
import { getDeathImagePath } from "../../../data/imageMap";
import { useUnlockedEndings } from "../../../hooks";
import { createAudioContext } from "../../../lib/audio";
import { BTN_DEBRIEF_NAV } from "../../../lib/buttonStyles";
import { formatBudget } from "../../../lib/formatting";
import {
	playKirkCrashSound,
	playKirkGlitchTone,
} from "../../../services/kirkAudio";
import { DeathType, type GameState } from "../../../types";
import { corruptText } from "../../../utils/kirkText";
import { ImageWithFallback } from "../../ImageWithFallback";
import LayoutShell from "../../LayoutShell";
import {
	GLASS_FILL_STRONG,
	GLASS_PANEL_DEFAULT,
	LAYOUT_SHELL_CENTERED_CLASS,
} from "../selectionStageStyles";
import { ExplanationCard } from "./ExplanationCard";

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

function getRandomLesson(deathType: DeathType) {
	const lessons = FAILURE_LESSONS[deathType];
	if (!lessons?.length) return null;
	return lessons[Math.floor(Math.random() * lessons.length)];
}

/** Six standard endings shown in the collection grid; KIRK is batch 7 (secret). */
const DEBRIEF_STANDARD_DEATH_TYPES = Object.values(DeathType).filter(
	(t): t is Exclude<DeathType, DeathType.KIRK> => t !== DeathType.KIRK,
);

interface EndingIconGridProps {
	unlockedEndings: DeathType[];
}

function EndingIconGrid({ unlockedEndings }: EndingIconGridProps) {
	return (
		<div className="flex gap-2 md:gap-3 justify-center flex-wrap mb-4">
			{DEBRIEF_STANDARD_DEATH_TYPES.map((type) => {
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

function KirkEndingBatch7() {
	return (
		<div
			data-testid="debrief-ending-batch-7"
			className="mt-4 border-t border-cyan-500/25 pt-4"
		>
			<p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/90 mb-1">
				Ending batch 7
			</p>
			<p className="text-center text-xs text-slate-500 mb-3">
				Secret ending — unlocked this run
			</p>
			<div className="flex justify-center">
				<div
					className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex flex-col items-center justify-center border bg-cyan-500/25 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
					title="Secret ending (batch 7)"
				>
					<i
						className="fa-solid fa-pizza-slice text-lg md:text-xl text-cyan-300"
						aria-hidden
					/>
				</div>
			</div>
		</div>
	);
}

function KirkBreachHeader({ corruptedText }: { corruptedText: string }) {
	return (
		<>
			<h1
				className="text-4xl md:text-6xl font-black text-cyan-400 mb-2 tracking-tighter kirk-glitch-text"
				aria-label="SIMULATION BREACH"
			>
				{corruptedText}
			</h1>
			<p className="text-slate-400 text-base md:text-lg">
				Error: Subject refused to comply with test parameters. Attempting damage
				control...
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
		<>
			<div className="mb-6 md:mb-8">
				<h1
					className={`text-4xl md:text-6xl font-black mb-2 tracking-tighter ${ending.color}`}
				>
					{ending.title}
				</h1>
				<p className="text-slate-400 text-base md:text-lg">
					{ending.description}
				</p>
			</div>
			<div className="mb-6 md:mb-8 mx-auto w-full max-w-md">
				<ImageWithFallback
					src={getDeathImagePath(deathType) ?? ""}
					alt={`Ending: ${ending.title}`}
					aspectRatio="video"
				/>
			</div>
		</>
	);
}

interface FailureLessonCardProps {
	lesson: FailureLesson;
}

function FailureLessonCard({ lesson }: FailureLessonCardProps) {
	return (
		<div
			className={`mt-3 mb-6 rounded-lg border border-amber-500/35 bg-gradient-to-br from-amber-950/30 to-black/70 p-3 ${GLASS_FILL_STRONG}`}
		>
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

/**
 * DebriefPage1Collapse component displays the first page of the game debrief.
 * Shows game over status, stats, unlocked endings, and failure lessons.
 * Handles victory and various death types including KIRK breach.
 * @param props - The component props
 * @returns The rendered debrief page 1 component
 */
export function DebriefPage1Collapse({
	state,
	onNext,
}: DebriefPage1CollapseProps) {
	const { deathType, unlockedEndings, history, budget, heat, hype } = state;

	/** Boss fight win — land on debrief page 1 with no death type */
	const isVictory = deathType === null;
	const isKirk = deathType === DeathType.KIRK;
	const regularDeathType: Exclude<DeathType, DeathType.KIRK> | null =
		deathType != null && deathType !== DeathType.KIRK ? deathType : null;

	const corruptedBreachText = useMemo(
		() => corruptText("SIMULATION BREACH", 0.4),
		[],
	);
	const deathEnding = regularDeathType ? DEATH_ENDINGS[regularDeathType] : null;
	const { unlockedCount, totalCount } = useUnlockedEndings(unlockedEndings);

	const explanation = useMemo(() => {
		if (deathType === null) return null;
		const vectorMap = state.deathVectorMap ?? {};
		return generateDeathExplanation(deathType, vectorMap, history.length);
	}, [deathType, state.deathVectorMap, history.length]);

	const failureLesson = useMemo(() => {
		if (deathType === null) return null;
		return getRandomLesson(deathType);
	}, [deathType]);

	const hasPlayedKirkGlitch = useRef(false);
	useEffect(() => {
		if (isVictory || !isKirk || hasPlayedKirkGlitch.current) return;

		const ctx = createAudioContext();
		if (!ctx) return;

		hasPlayedKirkGlitch.current = true;
		playKirkGlitchTone(ctx);
		setTimeout(() => playKirkCrashSound(ctx), 200);

		return () => {
			if (ctx.state !== "closed") ctx.close().catch(() => {});
		};
	}, [isVictory, isKirk]);

	return (
		<LayoutShell className={LAYOUT_SHELL_CENTERED_CLASS}>
			<div className="w-full max-w-2xl">
				{isVictory ? (
					<>
						<h1 className="text-3xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter text-green-400">
							Quarter survived
						</h1>
						<p className="max-w-xl text-base md:text-xl mb-6 md:mb-8 text-slate-400 px-4 mx-auto">
							Against all odds, the company is still legal. You&apos;ve earned a
							voucher for a synthetic coffee.
						</p>
						<div className="mb-6 md:mb-8 mx-auto w-full max-w-md">
							<ImageWithFallback
								src="/images/victory.webp"
								alt="Victory celebration"
								aspectRatio="video"
								containerClassName="mx-auto"
							/>
						</div>
						<div className={`mt-4 mb-6 rounded-lg p-3 ${GLASS_PANEL_DEFAULT}`}>
							<p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
								Why you survived
							</p>
							<p className="text-xs text-slate-500 mb-2">
								Your decisions balanced risk across budget, heat, and hype — no
								single vector dominated.
							</p>
							<p className="text-sm text-gray-300 leading-relaxed">
								Surviving a quarter in hyperscale means managing competing
								pressures without letting any one metric spiral. You kept the
								budget sustainable, avoided regulatory heat, and maintained just
								enough hype to stay funded. That balance is the real win.
							</p>
						</div>
						<div
							className={`mt-3 mb-6 rounded-lg border border-green-500/35 bg-gradient-to-br from-green-950/30 to-black/70 p-3 ${GLASS_FILL_STRONG}`}
						>
							<p className="text-xs font-semibold text-green-400 uppercase mb-1">
								Success Lesson
							</p>
							<p className="text-sm text-gray-300">
								Balance across competing pressures — not perfection in any
								single dimension — is what leads to sustainable success in
								ambiguous environments.
							</p>
						</div>
					</>
				) : (
					<>
						{isKirk && (
							<div className="mb-6 md:mb-8">
								<KirkBreachHeader corruptedText={corruptedBreachText} />
							</div>
						)}

						{isKirk && (
							<div className="mb-6 md:mb-8 mx-auto w-full max-w-md">
								<ImageWithFallback
									src={getDeathImagePath(DeathType.KIRK) ?? ""}
									alt="KIRK simulation breach"
									aspectRatio="video"
								/>
							</div>
						)}

						{isKirk && explanation && (
							<ExplanationCard explanation={explanation} />
						)}

						{deathEnding && regularDeathType && (
							<DeathEndingCard
								ending={deathEnding}
								deathType={regularDeathType}
							/>
						)}

						{regularDeathType && explanation && (
							<ExplanationCard explanation={explanation} />
						)}

						{(isKirk || regularDeathType) && failureLesson && (
							<FailureLessonCard lesson={failureLesson} />
						)}
					</>
				)}

				<StatsGrid budget={budget} heat={heat} hype={hype} />

				<div
					data-testid="debrief-endings-box"
					className={`mb-6 md:mb-8 p-4 md:p-6 rounded-xl border-2 border-cyan-500/35 bg-gradient-to-br from-cyan-950/30 to-black/70 ${GLASS_FILL_STRONG}`}
				>
					<div className="flex items-center justify-center gap-2 mb-4">
						<i className="fa-solid fa-trophy text-cyan-400 text-lg" />
						<div className="text-xs text-cyan-400 tracking-widest uppercase font-bold">
							Unlocked Endings
						</div>
					</div>

					<div className="mb-4">
						<div className="text-3xl md:text-4xl font-black text-cyan-400">
							{unlockedCount}
							<span className="text-slate-500">/{totalCount}</span>
						</div>
					</div>

					<EndingIconGrid unlockedEndings={unlockedEndings} />
					{isKirk && <KirkEndingBatch7 />}
				</div>

				<button type="button" onClick={onNext} className={BTN_DEBRIEF_NAV}>
					Debrief me
				</button>
			</div>
		</LayoutShell>
	);
}
