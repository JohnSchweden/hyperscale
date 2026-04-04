import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PersonalitySelect } from "../src/components/game/PersonalitySelect";

describe("PersonalitySelect", () => {
	const defaultProps = {
		isReady: true,
		hoverEnabled: true,
		onSelect: vi.fn(),
	};

	it("should place voice hint inside V.E.R.A. card when speech UI is enabled", () => {
		render(<PersonalitySelect {...defaultProps} />);

		const roasterCard = screen.getByTestId("personality-roaster");
		const hint = screen.getByTestId("personality-select-voice-hint");
		expect(roasterCard).toContainElement(hint);
	});

	it("should apply selection-card-hover when hoverEnabled is true", () => {
		render(<PersonalitySelect {...defaultProps} hoverEnabled={true} />);
		expect(screen.getByTestId("personality-roaster").className).toContain(
			"selection-card-hover",
		);
	});

	it("should not apply selection-card-hover when hoverEnabled is false", () => {
		render(<PersonalitySelect {...defaultProps} hoverEnabled={false} />);
		expect(screen.getByTestId("personality-roaster").className).not.toContain(
			"selection-card-hover",
		);
	});
});
