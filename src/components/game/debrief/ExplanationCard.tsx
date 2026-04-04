import { GLASS_PANEL_DEFAULT } from "../selectionStageStyles";

interface ExplanationCardProps {
	explanation: string;
	className?: string;
}

export function ExplanationCard({
	explanation,
	className = "",
}: ExplanationCardProps) {
	return (
		<div
			className={`mt-4 mb-6 rounded-lg p-3 ${GLASS_PANEL_DEFAULT} ${className}`}
		>
			<p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
				Why this ending
			</p>
			<p className="text-xs text-slate-500 mb-2">
				Short read on how your swipe patterns relate to this outcome — not
				random flavor text.
			</p>
			<p className="text-sm text-gray-300 leading-relaxed">{explanation}</p>
		</div>
	);
}
