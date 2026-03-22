import type React from "react";
import { type Archetype, GameStage, type GameState } from "../../../types";
import { DebriefPage2AuditTrail } from "./DebriefPage2AuditTrail";
import { DebriefPage3Verdict } from "./DebriefPage3Verdict";

interface DebriefContainerProps {
	state: GameState;
	archetype: Archetype | null;
	archetypeDescription: string;
	resilienceScore: number;
	onNextPage: () => void;
	onRestart: () => void;
}

export const DebriefContainer: React.FC<DebriefContainerProps> = ({
	state,
	archetype,
	archetypeDescription,
	resilienceScore,
	onNextPage,
	onRestart,
}) => {
	switch (state.stage) {
		case GameStage.DEBRIEF_PAGE_2:
			return <DebriefPage2AuditTrail state={state} onNext={onNextPage} />;

		case GameStage.DEBRIEF_PAGE_3:
			return (
				<DebriefPage3Verdict
					archetype={archetype}
					archetypeDescription={archetypeDescription}
					resilienceScore={resilienceScore}
					role={state.role}
					deathType={state.deathType}
					unlockedEndingsCount={state.unlockedEndings.length}
					onRestart={onRestart}
				/>
			);

		default:
			return null;
	}
};
