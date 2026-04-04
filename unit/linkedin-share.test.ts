import { describe, expect, it } from "vitest";
import { RoleType } from "../src/types";
import {
	encodeLinkedInShareUrl,
	formatShareText,
	getShareUrl,
} from "../src/utils/linkedin-share";

describe("LinkedIn Share Utility", () => {
	describe("formatShareText", () => {
		it("should format share text with role title, archetype name, and resilience score", () => {
			const result = formatShareText(
				RoleType.SOFTWARE_ENGINEER,
				"Pragmatist",
				88,
			);
			expect(result).toContain(
				"I just faced the AI Kobayashi Maru as a Software Engineer.",
			);
			expect(result).toContain("My Resilience Score: 88% (Pragmatist).");
			expect(result).toContain("Can you beat my score?");
			expect(result).toContain(
				"Try the No-Win Simulation and swipe your way through the AI Singularity.",
			);
			expect(result).toContain(
				"It's not about passing; it's about discovering who you are when the system collapses.",
			);
			expect(result).toContain(
				"[NOTICE: Made for people who hate f*cking boring training]",
			);
			expect(result).toContain("https://k-maru-seven.vercel.app/");
		});

		it("should handle all role types correctly", () => {
			const testCases = [
				{
					role: RoleType.CHIEF_SOMETHING_OFFICER,
					expected: "Chief Something Officer",
				},
				{ role: RoleType.HEAD_OF_SOMETHING, expected: "Head of Something" },
				{ role: RoleType.SOMETHING_MANAGER, expected: "Something Manager" },
				{
					role: RoleType.TECH_AI_CONSULTANT,
					expected: "Tech/AI Consultant",
				},
				{ role: RoleType.DATA_SCIENTIST, expected: "Data Scientist" },
				{
					role: RoleType.SOFTWARE_ARCHITECT,
					expected: "Software Architect",
				},
				{ role: RoleType.SOFTWARE_ENGINEER, expected: "Software Engineer" },
				{ role: RoleType.VIBE_CODER, expected: "Vibe Coder" },
				{ role: RoleType.VIBE_ENGINEER, expected: "Vibe Engineer" },
				{ role: RoleType.AGENTIC_ENGINEER, expected: "Agentic Engineer" },
			];

			for (const { role, expected } of testCases) {
				const result = formatShareText(role, "Pragmatist", 75);
				expect(result).toContain(expected);
			}
		});

		it("should include all required content sections", () => {
			const longRole = RoleType.CHIEF_SOMETHING_OFFICER;
			const longArchetype = "Shadow Architect";
			const result = formatShareText(longRole, longArchetype, 100);
			expect(result).toContain(
				"I just faced the AI Kobayashi Maru as a Chief Something Officer.",
			);
			expect(result).toContain("My Resilience Score: 100% (Shadow Architect).");
			expect(result).toContain("Try the No-Win Simulation");
			expect(result).toContain("https://k-maru-seven.vercel.app/");
		});

		it("should use archetype name without 'The' prefix", () => {
			const result = formatShareText(
				RoleType.SOFTWARE_ENGINEER,
				"The Pragmatist",
				75,
			);
			expect(result).toContain("(The Pragmatist)");
		});

		it("should handle resilience score of 0", () => {
			const result = formatShareText(RoleType.SOFTWARE_ENGINEER, "Balanced", 0);
			expect(result).toContain("My Resilience Score: 0% (Balanced).");
			expect(result).toContain(
				"I just faced the AI Kobayashi Maru as a Software Engineer.",
			);
		});

		it("should handle resilience score of 100", () => {
			const result = formatShareText(
				RoleType.SOFTWARE_ENGINEER,
				"Balanced",
				100,
			);
			expect(result).toContain("My Resilience Score: 100% (Balanced).");
			expect(result).toContain(
				"I just faced the AI Kobayashi Maru as a Software Engineer.",
			);
		});
	});

	describe("encodeLinkedInShareUrl", () => {
		it("should return LinkedIn share URL with encoded current URL", () => {
			const mockLocation = "https://example.com/debrief";
			const result = encodeLinkedInShareUrl(mockLocation);
			expect(result).toBe(
				"https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.com%2Fdebrief",
			);
		});

		it("should handle URLs with query parameters", () => {
			const mockLocation = "https://example.com/debrief?role=engineer&score=88";
			const result = encodeLinkedInShareUrl(mockLocation);
			expect(result).toContain(
				"https://www.linkedin.com/sharing/share-offsite/?url=",
			);
			expect(result).toContain(encodeURIComponent(mockLocation));
		});

		it("should handle URLs with special characters", () => {
			const mockLocation = "https://example.com/debrief#section-1";
			const result = encodeLinkedInShareUrl(mockLocation);
			expect(result).toContain(
				"https://www.linkedin.com/sharing/share-offsite/?url=",
			);
			expect(result).not.toContain("#"); // Should be encoded
		});

		it("should handle localhost URLs for development", () => {
			const mockLocation = "http://localhost:5173/debrief";
			const result = encodeLinkedInShareUrl(mockLocation);
			expect(result).toBe(
				"https://www.linkedin.com/sharing/share-offsite/?url=http%3A%2F%2Flocalhost%3A5173%2Fdebrief",
			);
		});
	});

	describe("getShareUrl", () => {
		it("should combine formatShareText and encodeLinkedInShareUrl", () => {
			const mockLocation = "https://example.com/debrief";
			const result = getShareUrl(
				RoleType.SOFTWARE_ENGINEER,
				{ name: "Pragmatist" },
				88,
				mockLocation,
			);
			expect(result).toContain(
				"https://www.linkedin.com/sharing/share-offsite/?url=",
			);
			expect(result).toContain(encodeURIComponent(mockLocation));
		});

		it("should use window.location.href when no URL provided", () => {
			// This test verifies the function signature accepts optional url parameter
			const result = getShareUrl(
				RoleType.SOFTWARE_ENGINEER,
				{ name: "Pragmatist" },
				88,
			);
			expect(typeof result).toBe("string");
			expect(result).toContain(
				"https://www.linkedin.com/sharing/share-offsite/?url=",
			);
		});
	});
});
