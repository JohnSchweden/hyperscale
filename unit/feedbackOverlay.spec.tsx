import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeedbackOverlay } from "../components/game/FeedbackOverlay";
import { PersonalityType } from "../types";

describe("FeedbackOverlay", () => {
	const defaultProps = {
		personality: PersonalityType.ROASTER,
		text: "This is a test feedback message",
		lesson: "This is a test lesson about governance",
		choice: "RIGHT" as const,
		fine: 0,
		violation: "Test violation",
		onNext: vi.fn(),
	};

	describe("rendering", () => {
		it("should render the feedback text", () => {
			render(<FeedbackOverlay {...defaultProps} />);

			expect(
				screen.getByText(/This is a test feedback message/),
			).toBeInTheDocument();
		});

		it("should render the lesson", () => {
			render(<FeedbackOverlay {...defaultProps} />);

			expect(
				screen.getByText(/This is a test lesson about governance/),
			).toBeInTheDocument();
		});

		it("should render the personality name", () => {
			render(<FeedbackOverlay {...defaultProps} />);

			expect(screen.getByText(/V.E.R.A.'s review/)).toBeInTheDocument();
		});

		it("should render the Next ticket button", () => {
			render(<FeedbackOverlay {...defaultProps} />);

			expect(screen.getByText("Next ticket")).toBeInTheDocument();
		});

		it("should have proper accessibility attributes", () => {
			render(<FeedbackOverlay {...defaultProps} />);

			const dialog = screen.getByRole("dialog");
			expect(dialog).toHaveAttribute("aria-modal", "true");
		});
	});

	describe("fine display", () => {
		it("should show success icon when fine is 0", () => {
			render(<FeedbackOverlay {...defaultProps} fine={0} />);

			const icon = document.querySelector(".fa-circle-check");
			expect(icon).toBeInTheDocument();
		});

		it("should show failure icon when fine > 0", () => {
			render(<FeedbackOverlay {...defaultProps} fine={5000} />);

			const icon = document.querySelector(".fa-triangle-exclamation");
			expect(icon).toBeInTheDocument();
		});

		it("should display fine amount when fine > 0", () => {
			render(<FeedbackOverlay {...defaultProps} fine={5000} />);

			expect(screen.getByText(/-\$5,000/)).toBeInTheDocument();
		});

		it("should not display fine section when fine is 0", () => {
			render(<FeedbackOverlay {...defaultProps} fine={0} />);

			// The "Violation fine" label should not be present
			expect(screen.queryByText("Violation fine")).not.toBeInTheDocument();
		});
	});

	describe("escalation banners", () => {
		it("should show budget critical banner when budget is critical", () => {
			render(<FeedbackOverlay {...defaultProps} budget={1_000_000} />);

			expect(screen.getByText(/Budget Critical/)).toBeInTheDocument();
		});

		it("should show heat critical banner when heat is critical", () => {
			render(<FeedbackOverlay {...defaultProps} heat={90} />);

			expect(screen.getByText(/Risk Critical/)).toBeInTheDocument();
		});

		it("should show heat high banner when heat is high but not critical", () => {
			render(
				<FeedbackOverlay {...defaultProps} budget={1_000_000} heat={75} />,
			);

			expect(screen.getByText(/Risk High/)).toBeInTheDocument();
		});
	});

	describe("team impact", () => {
		it("should render team impact message when provided", () => {
			render(
				<FeedbackOverlay {...defaultProps} teamImpact="Team morale dropped" />,
			);

			expect(screen.getByText("Team impact")).toBeInTheDocument();
			expect(screen.getByText("Team morale dropped")).toBeInTheDocument();
		});

		it("should not render team impact section when not provided", () => {
			render(<FeedbackOverlay {...defaultProps} teamImpact={null} />);

			expect(screen.queryByText("Team impact")).not.toBeInTheDocument();
		});
	});

	describe("user interaction", () => {
		it("should call onNext when button is clicked", () => {
			const onNext = vi.fn();
			render(<FeedbackOverlay {...defaultProps} onNext={onNext} />);

			fireEvent.click(screen.getByText("Next ticket"));
			expect(onNext).toHaveBeenCalledTimes(1);
		});

		it("should call onNext when Escape key is pressed", () => {
			const onNext = vi.fn();
			render(<FeedbackOverlay {...defaultProps} onNext={onNext} />);

			fireEvent.keyDown(document, { key: "Escape" });
			expect(onNext).toHaveBeenCalledTimes(1);
		});

		it("should call onNext when Space key is pressed", () => {
			const onNext = vi.fn();
			render(<FeedbackOverlay {...defaultProps} onNext={onNext} />);

			fireEvent.keyDown(document, { key: " " });
			expect(onNext).toHaveBeenCalledTimes(1);
		});

		it("should call onNext when Enter key is pressed", () => {
			const onNext = vi.fn();
			render(<FeedbackOverlay {...defaultProps} onNext={onNext} />);

			fireEvent.keyDown(document, { key: "Enter" });
			expect(onNext).toHaveBeenCalledTimes(1);
		});
	});

	describe("choice attribute", () => {
		it("should set data-choice attribute to RIGHT", () => {
			render(<FeedbackOverlay {...defaultProps} choice="RIGHT" />);

			const dialog = screen.getByTestId("feedback-dialog");
			expect(dialog).toHaveAttribute("data-choice", "RIGHT");
		});

		it("should set data-choice attribute to LEFT", () => {
			render(<FeedbackOverlay {...defaultProps} choice="LEFT" />);

			const dialog = screen.getByTestId("feedback-dialog");
			expect(dialog).toHaveAttribute("data-choice", "LEFT");
		});
	});
});
