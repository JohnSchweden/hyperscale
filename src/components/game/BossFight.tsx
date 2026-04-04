import type React from "react";
import { BTN_PRIMARY_CTA } from "../../lib/buttonStyles";
import type { BossQuestion } from "../../types";
import LayoutShell from "../LayoutShell";
import { GLASS_PANEL_DEFAULT } from "./selectionStageStyles";

/**
 * Props for the BossFight component.
 */
interface BossFightProps {
	/** The current boss question object */
	question: BossQuestion;
	/** Array of shuffled answer options for the current question */
	fixedAnswers: string[];
	/** Index of the current question (0-based) */
	currentQuestion: number;
	/** Total number of questions in the boss fight */
	totalQuestions: number;
	/** Time remaining in seconds for the current question */
	timeLeft: number;
	/** Whether to show the explanation after answering */
	showExplanation: boolean;
	/** Whether the user has already answered the current question */
	hasAnswered: boolean;
	/** Whether the user's answer was correct */
	isCorrect: boolean;
	/** Number of correct answers so far */
	correctCount: number;
	/** Total number of questions answered */
	totalAnswered: number;
	/** Callback when user selects an answer */
	onAnswer: (isCorrect: boolean) => void;
	/** Callback to proceed to the next question or final result */
	onNext: () => void;
}

/**
 * BossFight component manages the final boss fight sequence with timed questions.
 * Displays questions with multiple choice answers, tracks score and time.
 * Shows explanations after answers and handles question progression.
 * @param props - The component props
 * @returns The rendered boss fight component
 */
export const BossFight: React.FC<BossFightProps> = ({
	question,
	fixedAnswers,
	currentQuestion,
	totalQuestions,
	timeLeft,
	showExplanation,
	hasAnswered,
	isCorrect,
	correctCount,
	totalAnswered,
	onAnswer,
	onNext,
}) => {
	const isNextFinal = currentQuestion + 1 >= totalQuestions;
	const nextQuestionLabel = isNextFinal ? "Final result" : "Next question";

	return (
		<LayoutShell className="px-4 md:px-8 !bg-transparent">
			<div className="w-full max-w-3xl">
				<div className="text-center mb-6 md:mb-8">
					<div className="text-4xl md:text-6xl mb-3 md:mb-4">
						<i className="fa-solid fa-gavel text-yellow-500" aria-hidden></i>
					</div>
					<h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tight text-yellow-500">
						Boss fight
					</h2>
					<p className="text-slate-400 text-sm md:text-base">
						Negotiate with the External Auditor
					</p>
				</div>

				<div
					className={`${GLASS_PANEL_DEFAULT} rounded-2xl p-4 md:p-8 shadow-2xl`}
				>
					{/* Timer Bar */}
					<div className="mb-4 md:mb-6">
						<div className="flex justify-between text-xs text-slate-400 mb-2">
							<span>Time remaining</span>
							<span className={timeLeft < 5 ? "text-red-500" : ""}>
								{timeLeft}s
							</span>
						</div>
						<div className="h-2 bg-slate-800 rounded overflow-hidden">
							<div
								className={`h-full transition-all duration-1000 ${timeLeft < 5 ? "bg-red-500" : "bg-yellow-500"}`}
								style={{ width: `${(timeLeft / 30) * 100}%` }}
							/>
						</div>
					</div>

					{/* Question */}
					<div className="mb-6 md:mb-8">
						<div className="text-xs text-cyan-400 tracking-wide mb-3 md:mb-4">
							Question {currentQuestion + 1} of {totalQuestions}
						</div>
						<p className="text-base md:text-xl font-medium text-slate-200 leading-relaxed">
							{question.question}
						</p>
					</div>

					{/* Answers */}
					{!showExplanation ? (
						<div className="space-y-2 md:space-y-3">
							{fixedAnswers.map((answer, answerIndex) => {
								const answerIsCorrect = answer === question.correctAnswer;
								return (
									<button
										key={answer}
										type="button"
										onClick={() => onAnswer(answerIsCorrect)}
										disabled={hasAnswered}
										className="w-full p-3 md:p-4 bg-slate-800 border border-slate-700 text-left hover:bg-slate-700 hover:border-cyan-500 transition-all flex items-center gap-4 min-h-[48px]"
									>
										<div className="flex-1">
											<span className="text-cyan-400 font-mono mr-2">
												{String.fromCharCode(65 + answerIndex)}.
											</span>
											<span className="text-slate-300 text-sm md:text-base">
												{answer}
											</span>
										</div>
									</button>
								);
							})}
						</div>
					) : (
						<div className="space-y-4">
							<div
								className={`p-3 md:p-4 rounded-lg ${isCorrect ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
							>
								<div
									className={`text-sm font-bold mb-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}
								>
									{isCorrect ? "Correct!" : "Incorrect"}
								</div>
								<p className="text-slate-400 text-xs md:text-sm">
									{question.explanation}
								</p>
							</div>
							<div className="text-center pt-3">
								<button
									type="button"
									onClick={onNext}
									className={BTN_PRIMARY_CTA}
								>
									{nextQuestionLabel}
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Score */}
				<div className="mt-4 md:mt-6 text-center">
					<div className="text-xs text-slate-400 tracking-wide mb-2">
						Correct answers
					</div>
					<div className="text-xl md:text-2xl font-black text-cyan-400">
						{correctCount} / {totalAnswered}
					</div>
				</div>
			</div>
		</LayoutShell>
	);
};
