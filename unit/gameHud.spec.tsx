import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GameHUD } from "../components/game/GameHUD";

describe("GameHUD", () => {
	const defaultProps = {
		budget: 10_000_000,
		heat: 30,
		hype: 60,
	};

	describe("rendering", () => {
		it("should render budget, heat, and hype displays", () => {
			render(<GameHUD {...defaultProps} />);

			expect(screen.getByText("Budget")).toBeInTheDocument();
			expect(screen.getByText("Risk")).toBeInTheDocument();
			expect(screen.getByText("Hype")).toBeInTheDocument();
		});

		it("should format budget in millions", () => {
			render(<GameHUD {...defaultProps} />);

			expect(screen.getByText("$10.0M")).toBeInTheDocument();
		});

		it("should display heat percentage", () => {
			render(<GameHUD {...defaultProps} />);

			expect(screen.getByText("30%")).toBeInTheDocument();
		});

		it("should display hype percentage", () => {
			render(<GameHUD {...defaultProps} />);

			expect(screen.getByText("60%")).toBeInTheDocument();
		});
	});

	describe("budget thresholds", () => {
		it("should show green when budget is healthy", () => {
			render(<GameHUD {...defaultProps} budget={10_000_000} />);

			// Budget should show in green (default)
			const budgetValue = screen.getByText("$10.0M");
			expect(budgetValue).toHaveClass("text-green-400");
		});

		it("should show warning (amber) when budget is below $3M", () => {
			render(<GameHUD {...defaultProps} budget={2_500_000} />);

			const budgetValue = screen.getByText("$2.5M");
			expect(budgetValue).toHaveClass("text-amber-400");
		});

		it("should show critical (red) when budget is below $2M", () => {
			render(<GameHUD {...defaultProps} budget={1_500_000} />);

			const budgetValue = screen.getByText("$1.5M");
			expect(budgetValue).toHaveClass("text-red-500");
			// Should show "Critical" label
			expect(screen.getByText("Critical")).toBeInTheDocument();
		});

		it("should show budget below $1M as raw number", () => {
			render(<GameHUD {...defaultProps} budget={500_000} />);

			expect(screen.getByText("$500,000")).toBeInTheDocument();
		});
	});

	describe("heat thresholds", () => {
		it("should show orange by default (below 70%)", () => {
			render(<GameHUD {...defaultProps} heat={30} />);

			const heatValue = screen.getByText("30%");
			expect(heatValue).toHaveClass("text-orange-500");
		});

		it("should show yellow when heat is >= 70%", () => {
			render(<GameHUD {...defaultProps} heat={75} />);

			const heatValue = screen.getByText("75%");
			expect(heatValue).toHaveClass("text-yellow-400");
		});

		it("should show critical (red) when heat >= 85%", () => {
			render(<GameHUD {...defaultProps} heat={90} />);

			const heatValue = screen.getByText("90%");
			expect(heatValue).toHaveClass("text-red-400");
			// Should show "Critical" label
			expect(screen.getByText("Critical")).toBeInTheDocument();
		});
	});

	describe("hype thresholds", () => {
		it("should show cyan when hype >= 20%", () => {
			render(<GameHUD {...defaultProps} hype={60} />);

			// The Hype label span has the conditional class
			const hypeLabel = screen.getByText("Hype");
			expect(hypeLabel).toHaveClass("text-cyan-400");
		});

		it("should show red (pulse) when hype < 20%", () => {
			render(<GameHUD {...defaultProps} hype={10} />);

			// The Hype label span has the conditional class
			const hypeLabel = screen.getByText("Hype");
			expect(hypeLabel).toHaveClass("text-red-500", "animate-pulse");
		});
	});

	describe("countdown integration", () => {
		it("should render with countdown value", () => {
			render(<GameHUD {...defaultProps} countdownValue={5} />);

			// Component should render without error
			expect(screen.getByText("Budget")).toBeInTheDocument();
		});

		it("should apply pressure styles when countdown is active", () => {
			render(<GameHUD {...defaultProps} countdownValue={3} />);

			// Find the outer container with data-pressure attribute
			const container = document.querySelector("[data-pressure]");
			expect(container).toHaveAttribute("data-pressure", "true");
		});
	});

	describe("pressure state", () => {
		it("should apply pressure styles when budget is critical", () => {
			render(<GameHUD {...defaultProps} budget={1_000_000} />);

			const container = document.querySelector("[data-pressure]");
			expect(container).toHaveAttribute("data-pressure", "true");
		});

		it("should apply pressure styles when heat is critical", () => {
			render(<GameHUD {...defaultProps} heat={90} />);

			const container = document.querySelector("[data-pressure]");
			expect(container).toHaveAttribute("data-pressure", "true");
		});
	});
});
