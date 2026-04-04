import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PressureCueController } from "../src/components/game/PressureCueController";

const mockUsePressureAudio = vi.fn();

vi.mock("../src/hooks/usePressureAudio", () => ({
	usePressureAudio: (opts: object) => {
		mockUsePressureAudio(opts);
	},
}));

describe("PressureCueController", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders without crashing", () => {
		render(
			<PressureCueController
				isUrgent={false}
				isCritical={false}
				countdownValue={10}
				countdownSec={10}
				isCountdownActive={true}
			/>,
		);
	});

	it.each([
		{
			name: "when isUrgent",
			isUrgent: true,
			isCritical: false,
			countdownValue: 10,
			countdownSec: 10,
			isCountdownActive: true,
			expected: {
				hasHighPressure: true,
				isCritical: false,
				countdownValue: 10,
				countdownSec: 10,
				isCountdownActive: true,
			},
		},
		{
			name: "when isCritical but not urgent (heat-based only)",
			isUrgent: false,
			isCritical: true,
			countdownValue: 5,
			countdownSec: 10,
			isCountdownActive: false,
			expected: { hasHighPressure: false, isCritical: true },
		},
		{
			name: "when neither urgent nor critical",
			isUrgent: false,
			isCritical: false,
			countdownValue: 10,
			countdownSec: 10,
			isCountdownActive: true,
			expected: { hasHighPressure: false, isCritical: false },
		},
	])("calls usePressureAudio with expected options $name", (props) => {
		const { expected, ...controllerProps } = props;
		render(<PressureCueController {...controllerProps} />);
		expect(mockUsePressureAudio).toHaveBeenCalledWith(
			expect.objectContaining(expected),
		);
	});
});
