import { useCallback, useEffect, useMemo, useState } from "react";
import { BOSS_FIGHT_QUESTIONS } from "../data";
import type { BossQuestion } from "../types";

interface UseBossFightOptions {
	isActive: boolean;
	onAnswer: (isCorrect: boolean) => void;
	onComplete: (success: boolean) => void;
	currentAnswers: boolean[];
}

interface UseBossFightResult {
	currentQuestion: number;
	timeLeft: number;
	showExplanation: boolean;
	hasAnswered: boolean;
	question: BossQuestion | undefined;
	fixedAnswers: string[];
	correctCount: number;
	totalAnswered: number;
	handleAnswer: (isCorrect: boolean) => void;
	nextQuestion: () => void;
}

/**
 * Hook for managing boss fight quiz mechanics with timed questions and scoring.
 * Handles question progression, answer validation, timer countdown, and completion logic.
 * @param options - Configuration options for the boss fight
 * @returns Object containing current question state, timer, and control functions
 */
export function useBossFight({
	isActive,
	onAnswer,
	onComplete,
	currentAnswers,
}: UseBossFightOptions): UseBossFightResult {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [timeLeft, setTimeLeft] = useState(30);
	const [showExplanation, setShowExplanation] = useState(false);
	const [hasAnswered, setHasAnswered] = useState(false);
	const [seed, setSeed] = useState(() => Math.random());

	const question = BOSS_FIGHT_QUESTIONS[currentQuestion];

	const fixedAnswers = useMemo(() => {
		if (!question) return [];
		const answers = [question.correctAnswer, ...question.wrongAnswers];
		const seeded = answers.map((a, i) => ({
			val: a,
			rand: Math.random() + seed * 0.1 * (i + 1),
		}));
		return seeded.sort((a, b) => a.rand - b.rand).map((s) => s.val);
	}, [question, seed]);

	// Reset when boss fight becomes active
	useEffect(() => {
		if (isActive) {
			setCurrentQuestion(0);
			setTimeLeft(30);
			setShowExplanation(false);
			setHasAnswered(false);
			setSeed(Math.random());
		}
	}, [isActive]);

	// Timer logic
	useEffect(() => {
		if (!isActive || timeLeft <= 0 || hasAnswered || showExplanation) return;

		const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [isActive, timeLeft, hasAnswered, showExplanation]);

	const handleAnswer = useCallback(
		(isCorrect: boolean) => {
			setHasAnswered(true);
			setShowExplanation(true);
			onAnswer(isCorrect);
		},
		[onAnswer],
	);

	// Auto-fail when time runs out
	useEffect(() => {
		if (isActive && timeLeft === 0 && !hasAnswered) {
			handleAnswer(false);
		}
	}, [isActive, timeLeft, hasAnswered, handleAnswer]);

	const nextQuestion = useCallback(() => {
		if (currentQuestion + 1 >= BOSS_FIGHT_QUESTIONS.length) {
			const correctAnswers = currentAnswers.filter(Boolean).length;
			onComplete(correctAnswers >= 3);
		} else {
			setCurrentQuestion((prev) => prev + 1);
			setTimeLeft(30);
			setHasAnswered(false);
			setShowExplanation(false);
		}
	}, [currentQuestion, currentAnswers, onComplete]);

	const correctCount = currentAnswers.filter(Boolean).length;

	return {
		currentQuestion,
		timeLeft,
		showExplanation,
		hasAnswered,
		question,
		fixedAnswers,
		correctCount,
		totalAnswered: currentAnswers.length,
		handleAnswer,
		nextQuestion,
	};
}
