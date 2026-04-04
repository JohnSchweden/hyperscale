import { memo, type RefObject, useEffect, useRef, useState } from "react";
import { PERSONALITIES } from "../../data";
import { useLiveAPISpeechRecognition } from "../../hooks/useLiveAPISpeechRecognition";
import { PersonalityType } from "../../types";
import { GLASS_PANEL_DEFAULT } from "./selectionStageStyles";

const ROAST_CONSOLE_NAMES: Record<PersonalityType, string> = {
	[PersonalityType.ROASTER]: "roast_con.exe",
	[PersonalityType.ZEN_MASTER]: "zen_con.exe",
	[PersonalityType.LOVEBOMBER]: "hype_con.exe",
};

interface RoastTerminalInnerProps {
	personality: PersonalityType;
	input: string;
	output: string | null;
	isLoading: boolean;
	outputRef: RefObject<HTMLDivElement>;
	onInputChange: (value: string) => void;
	onSubmit: () => void;
}

// Inner component that uses speech recognition - memoized to prevent re-render issues
const RoastTerminalInner = memo(function RoastTerminalInner({
	personality,
	input,
	output,
	isLoading,
	outputRef,
	onInputChange,
	onSubmit,
}: RoastTerminalInnerProps) {
	const [_streamingTranscript, setStreamingTranscript] = useState("");
	const lastFinalTranscriptRef = useRef("");

	const { isRecording, transcript, startRecording, stopRecording, error } =
		useLiveAPISpeechRecognition({
			onTranscript: (text, isFinal) => {
				if (isFinal) {
					lastFinalTranscriptRef.current = text;
					onInputChange(text);
					setStreamingTranscript("");
				} else {
					setStreamingTranscript(text);
				}
			},
		});

	// Update input only when final transcript arrives
	useEffect(() => {
		if (transcript && transcript !== lastFinalTranscriptRef.current) {
			lastFinalTranscriptRef.current = transcript;
			onInputChange(transcript);
		}
	}, [transcript, onInputChange]);

	const handleMicrophoneClick = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	const handleSubmit = async () => {
		if (isRecording) {
			await stopRecording();
			// Yield to React so onTranscript → onInputChange flushes before submit
			await new Promise((r) => setTimeout(r, 0));
		}
		onSubmit();
	};

	const personalityName = PERSONALITIES[personality].name;
	const isListening = isRecording;

	return (
		<div
			className={`w-full max-w-[43rem] lg:w-[43rem] flex-shrink-0 ${GLASS_PANEL_DEFAULT} rounded-xl overflow-hidden flex flex-col shadow-2xl ${output ? "min-h-[320px] lg:min-h-[260px]" : "min-h-0"}`}
			data-testid="roast-terminal"
		>
			<div className="bg-slate-900 px-4 py-2 border-b border-white/5 flex-shrink-0 flex items-center justify-between">
				<span className="text-xs mono font-bold text-green-500">
					{ROAST_CONSOLE_NAMES[personality]}
				</span>
				<i className="fa-solid fa-minus text-xs text-slate-400" aria-hidden></i>
			</div>
			<div className="p-3 md:p-4 flex-1 flex flex-col min-h-0">
				<p className="text-sm mono text-green-400 mb-4 flex-shrink-0">
					Describe your use case / workflow for governance review...
				</p>
				<div className="flex gap-2 mb-3 items-end flex-shrink-0">
					<textarea
						value={input}
						onChange={(e) => onInputChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit();
							}
						}}
						placeholder="e.g. I use ChatGPT for company secrets..."
						aria-label="Describe your use case / workflow for governance review"
						className="flex-1 min-h-[3rem] lg:min-h-[6rem] bg-black border border-green-900/30 rounded p-3 text-sm mono text-green-400 focus:outline-none placeholder:text-green-500/60 resize-none"
					/>
					<button
						type="button"
						onClick={handleMicrophoneClick}
						disabled={isLoading}
						title={isListening ? "Stop recording" : "Start voice input"}
						aria-label={isListening ? "Stop recording" : "Start voice input"}
						className={`shrink-0 w-11 h-11 lg:w-12 lg:h-12 flex items-center justify-center border rounded focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:pointer-events-none [transition:background-color_150ms,border-color_150ms,color_150ms] ${isListening ? "bg-red-900/30 border-red-500/50 text-red-400 animate-pulse" : "bg-green-900/20 border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black"}`}
					>
						<i
							className={`fa-solid text-lg ${isListening ? "fa-stop" : "fa-microphone"}`}
							aria-hidden
						/>
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isLoading}
						title={isLoading ? "Scanning..." : "Send (Enter)"}
						aria-label={isLoading ? "Scanning..." : "Send roast"}
						className="shrink-0 w-11 h-11 lg:w-12 lg:h-12 flex items-center justify-center bg-green-900/20 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black rounded focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:pointer-events-none [transition:background-color_150ms,border-color_150ms,color_150ms]"
					>
						<i
							className={`fa-solid text-lg ${isLoading ? "fa-spinner roast-spinner" : "fa-arrow-turn-down"}`}
							aria-hidden
						/>
					</button>
				</div>
				{error && (
					<div className="text-xs text-red-400 mt-1">Error: {error}</div>
				)}
				{/* TODO: Re-enable if needed - duplicate of transcript in input field
        {streamingTranscript && (
          <div className="text-xs text-yellow-400/80 mt-1 animate-pulse flex items-center gap-1">
            <i className="fa-solid fa-wave-square" aria-hidden />
            {streamingTranscript}
          </div>
        )}
        */}
				{output && (
					<div
						ref={outputRef}
						data-testid="roast-output"
						className="flex-1 min-h-0 flex flex-col bg-green-900/10 border border-green-500/20 rounded overflow-hidden"
					>
						<div className="p-3 pb-1 text-sm mono text-green-400 font-bold tracking-wide flex-shrink-0">
							{">>>"} {personalityName}:
						</div>
						<div
							data-testid="roast-output-body"
							className="flex-1 min-h-0 p-3 pt-0 text-sm mono text-green-400 overflow-auto"
						>
							{output}
						</div>
					</div>
				)}
			</div>
		</div>
	);
});

// Wrapper with auto-scroll
export const RoastTerminal = (props: {
	personality: PersonalityType | null;
	input: string;
	output: string | null;
	isLoading: boolean;
	outputRef: RefObject<HTMLDivElement>;
	onInputChange: (value: string) => void;
	onSubmit: () => void;
}) => {
	// Auto-scroll to output when it appears
	useEffect(() => {
		if (!props.output) return;
		const el = props.outputRef.current;
		if (!el) return;
		const id = requestAnimationFrame(() => {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
		});
		return () => cancelAnimationFrame(id);
	}, [props.output, props.outputRef]);

	if (!props.personality) return null;

	return <RoastTerminalInner {...props} />;
};
