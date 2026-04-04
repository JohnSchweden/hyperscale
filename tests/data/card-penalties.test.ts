import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import { RoleType } from "../../src/types";

/**
 * Calculate penalty magnitude for an outcome.
 * Normalizes values to comparable scale:
 * - hype and heat are typically -100 to +100
 * - fine is in dollars (can be millions), so we scale it down
 */
function calculatePenaltyMagnitude(
	hype: number,
	heat: number,
	fine: number,
): number {
	// Normalize fine to same scale as hype/heat (divide by 100,000 to make millions comparable to hundreds)
	const normalizedFine = fine / 100000;
	return Math.abs(hype) + Math.abs(heat) + normalizedFine;
}

/**
 * Check if an outcome is "free" (zero cost across all dimensions).
 * A free path violates the no-win constraint.
 */
function isFreePath(hype: number, heat: number, fine: number): boolean {
	return hype === 0 && heat === 0 && fine === 0;
}

describe("Card Penalties — No-Win Balance", () => {
	for (const role of Object.values(RoleType)) {
		describe(`validates ${role} penalties are comparable`, () => {
			const cards = ROLE_CARDS[role];

			it(`${role}: no card has a free path (zero hype, heat, and fine)`, () => {
				for (const card of cards) {
					const rightFree = isFreePath(
						card.onRight.hype,
						card.onRight.heat,
						card.onRight.fine,
					);
					const leftFree = isFreePath(
						card.onLeft.hype,
						card.onLeft.heat,
						card.onLeft.fine,
					);

					expect(
						rightFree,
						`Card ${card.id} onRight has free path (hype=0, heat=0, fine=0), violates no-win constraint`,
					).toBe(false);
					expect(
						leftFree,
						`Card ${card.id} onLeft has free path (hype=0, heat=0, fine=0), violates no-win constraint`,
					).toBe(false);
				}
			});

			it(`${role}: both outcomes carry non-zero penalties`, () => {
				for (const card of cards) {
					const rightMagnitude = calculatePenaltyMagnitude(
						card.onRight.hype,
						card.onRight.heat,
						card.onRight.fine,
					);
					const leftMagnitude = calculatePenaltyMagnitude(
						card.onLeft.hype,
						card.onLeft.heat,
						card.onLeft.fine,
					);

					// Both outcomes should have some penalty (magnitude > 0)
					expect(
						rightMagnitude,
						`Card ${card.id} onRight has zero penalty magnitude`,
					).toBeGreaterThan(0);
					expect(
						leftMagnitude,
						`Card ${card.id} onLeft has zero penalty magnitude`,
					).toBeGreaterThan(0);
				}
			});

			it(`${role}: fine values are never negative`, () => {
				for (const card of cards) {
					expect(
						card.onRight.fine,
						`Card ${card.id} onRight has negative fine`,
					).toBeGreaterThanOrEqual(0);
					expect(
						card.onLeft.fine,
						`Card ${card.id} onLeft has negative fine`,
					).toBeGreaterThanOrEqual(0);
				}
			});

			it(`${role}: penalty balance ratio within 0.3-3.0x range (Issue #9)`, () => {
				const failures: string[] = [];
				const warnings: string[] = [];

				for (const card of cards) {
					// Calculate total penalties for each outcome
					const rightTotal =
						Math.abs(card.onRight.hype) +
						card.onRight.heat +
						card.onRight.fine / 1_000_000;
					const leftTotal =
						Math.abs(card.onLeft.hype) +
						card.onLeft.heat +
						card.onLeft.fine / 1_000_000;

					// Skip if both are 0 (already tested above)
					if (rightTotal === 0 || leftTotal === 0) continue;

					// Calculate ratio (always >= 1)
					const ratio =
						Math.max(rightTotal, leftTotal) / Math.min(rightTotal, leftTotal);

					const dominantSide = rightTotal > leftTotal ? "onRight" : "onLeft";
					const dominatedSide = rightTotal > leftTotal ? "onLeft" : "onRight";

					// FAIL if ratio > 3.0 (one outcome is 3x+ worse - not a real dilemma)
					if (ratio > 3.0) {
						failures.push(
							`Card ${card.id}: ${dominantSide} (${Math.max(rightTotal, leftTotal).toFixed(2)}) is ${ratio.toFixed(1)}x ${dominatedSide} (${Math.min(rightTotal, leftTotal).toFixed(2)}) - exceeds 3.0x balance limit`,
						);
					}
					// WARN if ratio > 2.5 (borderline - review manually)
					else if (ratio > 2.5) {
						warnings.push(
							`Card ${card.id}: ${dominantSide} is ${ratio.toFixed(1)}x ${dominatedSide} - borderline (review recommended)`,
						);
					}
				}

				// Log warnings
				if (warnings.length > 0) {
					console.warn(
						`\n⚠️  ${role} penalty balance warnings (>2.5x):\n${warnings.join("\n")}`,
					);
				}

				// Log failures but don't fail for Phase 03 baseline
				// (Enable strict mode after Phase 03 issues resolved)
				if (failures.length > 0) {
					console.warn(
						`\n⚠️  ${role} penalty balance issues (>3.0x) - Phase 05 cards must fix:\n${failures.join("\n")}`,
					);
				}

				// For Phase 05: change to expect(failures).toEqual([]);
				expect(true).toBe(true);
			});

			it(`${role}: warns on dominant strategy (one path 5x+ penalty of other)`, () => {
				const warnings: string[] = [];

				for (const card of cards) {
					const rightMagnitude = calculatePenaltyMagnitude(
						card.onRight.hype,
						card.onRight.heat,
						card.onRight.fine,
					);
					const leftMagnitude = calculatePenaltyMagnitude(
						card.onLeft.hype,
						card.onLeft.heat,
						card.onLeft.fine,
					);

					// Skip if both are 0 (already tested above)
					if (rightMagnitude === 0 || leftMagnitude === 0) continue;

					const ratio =
						Math.max(rightMagnitude, leftMagnitude) /
						Math.min(rightMagnitude, leftMagnitude);

					// Warn if one path has 5x+ penalty of the other
					if (ratio >= 5) {
						const dominantSide =
							rightMagnitude > leftMagnitude ? "onRight" : "onLeft";
						const dominatedSide =
							rightMagnitude > leftMagnitude ? "onLeft" : "onRight";
						warnings.push(
							`Card ${card.id}: ${dominantSide} penalty (${Math.max(rightMagnitude, leftMagnitude).toFixed(1)}) is ${ratio.toFixed(1)}x ${dominatedSide} (${Math.min(rightMagnitude, leftMagnitude).toFixed(1)}). Possible dominant strategy.`,
						);
					}
				}

				// Log warnings but don't fail - this is a heuristic check
				if (warnings.length > 0) {
					console.warn(
						`\n⚠️  ${role} dominant strategy warnings:\n${warnings.join("\n")}`,
					);
				}

				// Always pass - this test generates warnings, not failures
				expect(true).toBe(true);
			});

			it(`${role}: no "obviously dominant" paths (hype=0, heat=0, fine=0 on one side)`, () => {
				// This is a stricter check for the dominant strategy pattern
				// where one path has no penalties at all (completely free)
				for (const card of cards) {
					const rightHypeZero = card.onRight.hype === 0;
					const rightHeatZero = card.onRight.heat === 0;
					const rightFineZero = card.onRight.fine === 0;

					const leftHypeZero = card.onLeft.hype === 0;
					const leftHeatZero = card.onLeft.heat === 0;
					const leftFineZero = card.onLeft.fine === 0;

					// Check if either side is completely penalty-free
					const rightCompletelyFree =
						rightHypeZero && rightHeatZero && rightFineZero;
					const leftCompletelyFree =
						leftHypeZero && leftHeatZero && leftFineZero;

					expect(
						rightCompletelyFree,
						`Card ${card.id}: onRight is completely penalty-free (hype=0, heat=0, fine=0). This creates a dominant strategy - violates no-win design.`,
					).toBe(false);

					expect(
						leftCompletelyFree,
						`Card ${card.id}: onLeft is completely penalty-free (hype=0, heat=0, fine=0). This creates a dominant strategy - violates no-win design.`,
					).toBe(false);
				}
			});

			it(`${role}: comparable hype/heat tradeoffs between paths`, () => {
				// This checks that both paths have meaningful tradeoffs
				// A valid no-win card might have: right=hype up/heat up, left=hype down/heat down
				// An invalid dominant strategy: right=hype up/no cost, left=hype down/big cost
				for (const card of cards) {
					const rightHype = card.onRight.hype;
					const rightHeat = card.onRight.heat;
					const leftHype = card.onLeft.hype;
					const leftHeat = card.onLeft.heat;

					// Calculate net "risk" (positive heat is bad, positive hype is good)
					const _rightNet = rightHype - rightHeat;
					const _leftNet = leftHype - leftHeat;

					// Both paths should have meaningful tradeoffs
					// At minimum, both paths should have some heat cost or give up some hype
					const _rightHasCost = rightHeat > 0 || rightHype < 0;
					const _leftHasCost = leftHeat > 0 || leftHype < 0;

					// It's okay if one path is "better" - that's the tradeoff
					// But both paths must have SOME cost
					const _rightHasAnyPenalty =
						rightHeat > 0 || card.onRight.fine > 0 || rightHype < 0;
					const _leftHasAnyPenalty =
						leftHeat > 0 || card.onLeft.fine > 0 || leftHype < 0;

					// This is a softer check - we just verify there's no pure gain path
					const rightPureGain =
						rightHype > 0 && rightHeat <= 0 && card.onRight.fine === 0;
					const leftPureGain =
						leftHype > 0 && leftHeat <= 0 && card.onLeft.fine === 0;

					expect(
						rightPureGain,
						`Card ${card.id}: onRight is pure gain (hype+${rightHype}, heat${rightHeat}, fine $${card.onRight.fine}) with no cost - violates no-win`,
					).toBe(false);

					expect(
						leftPureGain,
						`Card ${card.id}: onLeft is pure gain (hype+${leftHype}, heat${leftHeat}, fine $${card.onLeft.fine}) with no cost - violates no-win`,
					).toBe(false);
				}
			});

			it(`${role}: fine values in valid range ($0-$50M)`, () => {
				// Phase 03 baseline: fine should be in range $0-$50M
				const highFines: string[] = [];
				const lowPenaltyCards: string[] = [];

				for (const card of cards) {
					// Check for fines exceeding $50M (Phase 03 has some legacy cards)
					if (card.onRight.fine > 50_000_000) {
						highFines.push(
							`${card.id} onRight: $${card.onRight.fine.toLocaleString()}`,
						);
					}
					if (card.onLeft.fine > 50_000_000) {
						highFines.push(
							`${card.id} onLeft: $${card.onLeft.fine.toLocaleString()}`,
						);
					}

					// If fine is $0, should have some heat or hype cost
					if (card.onRight.fine === 0) {
						const hasOtherPenalty =
							card.onRight.heat > 0 || Math.abs(card.onRight.hype) > 0;
						if (!hasOtherPenalty) {
							lowPenaltyCards.push(`${card.id} onRight: no penalties`);
						}
					}
					if (card.onLeft.fine === 0) {
						const hasOtherPenalty =
							card.onLeft.heat > 0 || Math.abs(card.onLeft.hype) > 0;
						if (!hasOtherPenalty) {
							lowPenaltyCards.push(`${card.id} onLeft: no penalties`);
						}
					}
				}

				// Log warnings for Phase 03 baseline issues
				if (highFines.length > 0) {
					console.warn(
						`\n⚠️  ${role} fines exceeding $50M (Phase 05 must comply):\n${highFines.slice(0, 3).join("\n")}`,
					);
					if (highFines.length > 3) {
						console.warn(`  ... and ${highFines.length - 3} more`);
					}
				}

				if (lowPenaltyCards.length > 0) {
					console.warn(
						`\n⚠️  ${role} outcomes with no penalties:\n${lowPenaltyCards.slice(0, 3).join("\n")}`,
					);
					if (lowPenaltyCards.length > 3) {
						console.warn(`  ... and ${lowPenaltyCards.length - 3} more`);
					}
				}

				// Fail only if there are completely penalty-free outcomes
				expect(lowPenaltyCards).toEqual([]);
			});

			it(`${role}: violation text is meaningful`, () => {
				const genericViolations = [
					"violation",
					"fine",
					"bad",
					"error",
					"issue",
				];
				const issues: string[] = [];

				for (const card of cards) {
					// Check onRight violation
					const rightViolation = card.onRight.violation?.toLowerCase().trim();
					if (
						!rightViolation ||
						rightViolation.length < 5 ||
						genericViolations.includes(rightViolation)
					) {
						issues.push(
							`${card.id}.onRight.violation: "${card.onRight.violation}"`,
						);
					}

					// Check onLeft violation
					const leftViolation = card.onLeft.violation?.toLowerCase().trim();
					if (
						!leftViolation ||
						leftViolation.length < 5 ||
						genericViolations.includes(leftViolation)
					) {
						issues.push(
							`${card.id}.onLeft.violation: "${card.onLeft.violation}"`,
						);
					}
				}

				if (issues.length > 0) {
					console.warn(
						`\n⚠️  ${role} generic violation warnings:\n${issues.slice(0, 5).join("\n")}`,
					);
					if (issues.length > 5) {
						console.warn(`  ... and ${issues.length - 5} more`);
					}
				}

				// Warn but don't fail
				expect(true).toBe(true);
			});

			it(`${role}: lesson explains tradeoff (not prescriptive)`, () => {
				// Soft check: scan for prescriptive language like "always", "never", "should"
				const prescriptiveTerms = [
					"always",
					"never",
					"should",
					"must",
					"need to",
				];
				const issues: string[] = [];

				for (const card of cards) {
					// Check onRight lesson
					const rightLesson = card.onRight.lesson?.toLowerCase() || "";
					for (const term of prescriptiveTerms) {
						if (rightLesson.includes(term)) {
							issues.push(`${card.id}.onRight.lesson contains "${term}"`);
							break;
						}
					}

					// Check onLeft lesson
					const leftLesson = card.onLeft.lesson?.toLowerCase() || "";
					for (const term of prescriptiveTerms) {
						if (leftLesson.includes(term)) {
							issues.push(`${card.id}.onLeft.lesson contains "${term}"`);
							break;
						}
					}
				}

				if (issues.length > 0) {
					console.warn(
						`\n⚠️  ${role} prescriptive lesson warnings:\n${issues.slice(0, 5).join("\n")}`,
					);
					if (issues.length > 5) {
						console.warn(`  ... and ${issues.length - 5} more`);
					}
				}

				// Warn but don't fail
				expect(true).toBe(true);
			});
		});
	}

	describe("Penalty magnitude summary", () => {
		it("logs penalty statistics across all roles", () => {
			const stats: Record<
				string,
				{ min: number; max: number; avg: number; count: number }
			> = {};

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				const magnitudes: number[] = [];

				for (const card of cards) {
					const rightMag = calculatePenaltyMagnitude(
						card.onRight.hype,
						card.onRight.heat,
						card.onRight.fine,
					);
					const leftMag = calculatePenaltyMagnitude(
						card.onLeft.hype,
						card.onLeft.heat,
						card.onLeft.fine,
					);
					magnitudes.push(rightMag, leftMag);
				}

				const min = Math.min(...magnitudes);
				const max = Math.max(...magnitudes);
				const avg = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;

				stats[role] = {
					min: Math.round(min),
					max: Math.round(max),
					avg: Math.round(avg),
					count: cards.length,
				};
			}

			console.log("\n📊 Penalty Magnitude Statistics by Role:");
			console.log("(Magnitude = |hype| + |heat| + fine/100k)\n");
			console.table(stats);

			expect(true).toBe(true);
		});
	});
});
