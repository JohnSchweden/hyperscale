import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RoleSelect } from "../src/components/game/RoleSelect";
import { RoleType } from "../src/types";

describe("RoleSelect", () => {
	const defaultProps = {
		isReady: true,
		hoverEnabled: true,
		onSelect: vi.fn(),
	};

	describe("rendering", () => {
		it("should render the title and description", () => {
			render(<RoleSelect {...defaultProps} />);

			expect(screen.getByText("Select your impact zone")).toBeInTheDocument();
		});

		it("should show voice hint only on Head of Something when speech UI is enabled", () => {
			render(<RoleSelect {...defaultProps} />);

			const headCard = screen.getByTestId("role-head_of_something");
			const hint = screen.getByTestId("role-select-voice-hint");
			expect(headCard).toContainElement(hint);
		});

		it("should render all role buttons", () => {
			render(<RoleSelect {...defaultProps} />);

			const roles = Object.values(RoleType);
			roles.forEach((role) => {
				expect(
					screen.getByTestId(`role-${role.toLowerCase()}`),
				).toBeInTheDocument();
			});
		});

		it("should render role labels", () => {
			render(<RoleSelect {...defaultProps} />);

			expect(screen.getByText("Software Engineer")).toBeInTheDocument();
			expect(screen.getByText("Data Scientist")).toBeInTheDocument();
		});

		it("should render role descriptions", () => {
			render(<RoleSelect {...defaultProps} />);

			// Check that role descriptions are rendered
			expect(screen.getByText(/plausible deniability/i)).toBeInTheDocument();
		});
	});

	describe("selection", () => {
		it("should call onSelect when a role is clicked", () => {
			const onSelect = vi.fn();
			render(<RoleSelect {...defaultProps} onSelect={onSelect} />);

			const roleButton = screen.getByTestId("role-software_engineer");
			fireEvent.click(roleButton);

			expect(onSelect).toHaveBeenCalledWith(RoleType.SOFTWARE_ENGINEER);
		});

		it("should call onSelect with correct role for data scientist", () => {
			const onSelect = vi.fn();
			render(<RoleSelect {...defaultProps} onSelect={onSelect} />);

			const dataScientistButton = screen.getByTestId("role-data_scientist");
			fireEvent.click(dataScientistButton);

			expect(onSelect).toHaveBeenCalledWith(RoleType.DATA_SCIENTIST);
		});
	});

	describe("ready state", () => {
		it("should disable role buttons when not ready", () => {
			render(<RoleSelect {...defaultProps} isReady={false} />);

			const roleButton = screen.getByTestId("role-software_engineer");
			expect(roleButton).toHaveStyle({ pointerEvents: "none" });
		});

		it("should enable role buttons when ready", () => {
			render(<RoleSelect {...defaultProps} isReady={true} />);

			const roleButton = screen.getByTestId("role-software_engineer");
			expect(roleButton).toHaveStyle({ pointerEvents: "auto" });
		});

		it("should not call onSelect when not ready", () => {
			const onSelect = vi.fn();
			render(
				<RoleSelect {...defaultProps} isReady={false} onSelect={onSelect} />,
			);

			const roleButton = screen.getByTestId("role-software_engineer");
			fireEvent.click(roleButton);

			expect(onSelect).not.toHaveBeenCalled();
		});
	});

	describe("hover state", () => {
		it("should apply selection-card-hover when hoverEnabled is true", () => {
			render(<RoleSelect {...defaultProps} hoverEnabled={true} />);

			const roleButton = screen.getByTestId("role-software_engineer");
			expect(roleButton.className).toContain("selection-card-hover");
		});

		it("should not apply selection-card-hover when hoverEnabled is false", () => {
			render(<RoleSelect {...defaultProps} hoverEnabled={false} />);

			const roleButton = screen.getByTestId("role-software_engineer");
			expect(roleButton.className).not.toContain("selection-card-hover");
		});
	});
});
