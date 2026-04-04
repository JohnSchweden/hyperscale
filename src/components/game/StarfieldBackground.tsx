import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { GLASS_PANEL_DEFAULT } from "./selectionStageStyles";

const FOCAL_LENGTH = 128;
const Z_MAX = 1000;
const SPEED_FULL = 2.1;
const SPEED_REDUCED = 0.378;

/** Canvas / first paint — matches LayoutShell intro */
const CANVAS_BG = "#0a0a0c";

/** Lower α = longer motion tail (still pure black rgba for clean comp). */
const TRAIL_ALPHA_FULL = 0.13;
const TRAIL_ALPHA_REDUCED = 0.15;

const SPEED_SCALE_STORAGE_KEY = "k-maru-starfield-speed-scale";
const SPEED_SCALE_MIN = 0.15;
const SPEED_SCALE_MAX = 2.5;
const SPEED_SCALE_STEP = 0.05;
const SPEED_SCALE_DEFAULT = 0.3;

const SAFE_TOP = "calc(0.75rem + env(safe-area-inset-top, 0px))";
const SAFE_RIGHT = "calc(0.75rem + env(safe-area-inset-right, 0px))";
/** Below fixed corner burger (h-10) + gap */
const FLYOUT_BELOW_TOP_RIGHT_BURGER = `calc(${SAFE_TOP} + 3rem)`;
/** Above taskbar row (3rem) + shell safe-area padding below it */
const FLYOUT_ABOVE_TASKBAR_BOTTOM =
	"calc(3rem + env(safe-area-inset-bottom, 0px) + 0.5rem)";

const MD_MIN_WIDTH = 768;
const MOBILE_MAX_WIDTH_MQ = `(max-width: ${MD_MIN_WIDTH - 1}px)`;

function useIsMobileViewport(): boolean {
	const [mobile, setMobile] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia(MOBILE_MAX_WIDTH_MQ).matches;
	});
	useEffect(() => {
		const mq = window.matchMedia(MOBILE_MAX_WIDTH_MQ);
		const sync = () => setMobile(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);
	return mobile;
}

type StarfieldSpeedUIContextValue = {
	/** Mobile + taskbarHostsSpeedBurger: burger lives in taskbar, not top-right */
	showTaskbarBurger: boolean;
	taskbarBurgerRef: React.RefObject<HTMLButtonElement | null>;
	menuOpen: boolean;
	toggleMenu: () => void;
};

const StarfieldSpeedUIContext =
	createContext<StarfieldSpeedUIContextValue | null>(null);

/**
 * Hook to access starfield speed UI controls from context.
 * Returns null when not within a StarfieldBackground provider.
 * @returns The starfield speed UI context value or null
 */
export function useStarfieldSpeedUIBurger(): StarfieldSpeedUIContextValue | null {
	return useContext(StarfieldSpeedUIContext);
}

function BurgerGlyph({ menuOpen }: { menuOpen: boolean }) {
	return (
		<span
			className={`relative block w-6 transition-[height] duration-200 ease-out ${
				menuOpen ? "h-5" : "h-6"
			}`}
			aria-hidden
		>
			<span
				className={`absolute left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-200 ease-out ${
					menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[5px]"
				}`}
			/>
			<span
				className={`absolute left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-200 ease-out ${
					menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[5px]"
				}`}
			/>
		</span>
	);
}

class Star {
	x = 0;
	y = 0;
	z = 0;

	reset() {
		this.x = Math.random() * 1600 - 800;
		this.y = Math.random() * 1200 - 600;
		this.z = Math.random() * Z_MAX;
	}

	update(speed: number) {
		this.z -= speed;
		if (this.z < 1) {
			this.reset();
			this.z = Z_MAX;
		}
	}

	draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
		const k = FOCAL_LENGTH / this.z;
		const px = Math.round(this.x * k + centerX);
		const py = Math.round(this.y * k + centerY);
		const size = (1 - this.z / Z_MAX) * 2;
		if (size <= 0) return;
		const dim = Math.max(1, Math.round(size));
		const brightness = (1 - this.z / Z_MAX) * 255;

		ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
		ctx.fillRect(px, py, dim, dim);
	}
}

function getStarCount(): number {
	if (typeof window === "undefined") return 180;
	return window.matchMedia(MOBILE_MAX_WIDTH_MQ).matches ? 120 : 300;
}

function usePrefersReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const onChange = () => setReduced(mq.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return reduced;
}

function setupCanvasSize(
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	dpr: number,
) {
	const w = canvas.clientWidth;
	const h = canvas.clientHeight;
	canvas.width = Math.floor(w * dpr);
	canvas.height = Math.floor(h * dpr);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(dpr, dpr);
}

function clampSpeedScale(n: number): number {
	if (!Number.isFinite(n)) return SPEED_SCALE_DEFAULT;
	return Math.min(SPEED_SCALE_MAX, Math.max(SPEED_SCALE_MIN, n));
}

function readStoredSpeedScale(): number {
	try {
		const raw = localStorage.getItem(SPEED_SCALE_STORAGE_KEY);
		if (raw == null) return SPEED_SCALE_DEFAULT;
		return clampSpeedScale(parseFloat(raw));
	} catch {
		return SPEED_SCALE_DEFAULT;
	}
}

/**
 * Props for background music controls in the starfield panel.
 */
export type StarfieldBgmMenuProps = {
	currentTrackTitle: string;
	bgmVolume: number;
	bgmVolumeMin: number;
	bgmVolumeMax: number;
	bgmVolumeStep: number;
	onBgmVolumeChange: (value: number) => void;
	bgmEnabled: boolean;
	onBgmToggle: () => void;
	onBgmSkip: () => void;
};

type StarfieldSpeedPanelProps = {
	idSuffix: string;
	speedScale: number;
	onSpeedChange: React.ChangeEventHandler<HTMLInputElement>;
	bgm?: StarfieldBgmMenuProps;
};

function StarfieldSpeedPanel({
	idSuffix,
	speedScale,
	onSpeedChange,
	bgm,
}: StarfieldSpeedPanelProps) {
	const inputId = `starfield-speed-${idSuffix}`;
	const bgmVolumeId = `bgm-volume-${idSuffix}`;
	return (
		<div className={`rounded-lg ${GLASS_PANEL_DEFAULT} px-2.5 py-3`}>
			<label
				htmlFor={inputId}
				className="mb-1.5 block text-center text-[10px] font-bold uppercase tracking-widest text-slate-400"
			>
				Fly speed
			</label>
			<div className="flex items-center gap-2 py-1">
				<span
					className="select-none text-lg leading-none"
					title="Slower"
					aria-hidden
				>
					🐢
				</span>
				<input
					id={inputId}
					type="range"
					min={SPEED_SCALE_MIN}
					max={SPEED_SCALE_MAX}
					step={SPEED_SCALE_STEP}
					value={speedScale}
					onChange={onSpeedChange}
					className="h-2 w-full min-w-0 flex-1 accent-cyan-400"
					aria-valuemin={SPEED_SCALE_MIN}
					aria-valuemax={SPEED_SCALE_MAX}
					aria-valuenow={Number(speedScale.toFixed(2))}
					aria-label="Starfield fly speed. Left is slower, right is faster."
				/>
				<span
					className="select-none text-lg leading-none"
					title="Faster"
					aria-hidden
				>
					🐇
				</span>
			</div>
			{bgm ? (
				<div className="mt-2.5 border-t border-white/10 pt-2.5">
					<p className="mb-0.5 block text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
						Background music
					</p>
					<p className="mb-1.5 text-center text-[11px] text-slate-300">
						{bgm.currentTrackTitle}
					</p>
					<div className="flex items-center gap-2 py-1">
						<span
							className="select-none text-base leading-none text-slate-500"
							aria-hidden
						>
							🔈
						</span>
						<input
							id={bgmVolumeId}
							type="range"
							min={bgm.bgmVolumeMin}
							max={bgm.bgmVolumeMax}
							step={bgm.bgmVolumeStep}
							value={bgm.bgmVolume}
							onChange={(e) => {
								const n = parseFloat(e.target.value);
								if (Number.isFinite(n)) bgm.onBgmVolumeChange(n);
							}}
							className="h-2 w-full min-w-0 flex-1 accent-cyan-400"
							aria-valuemin={bgm.bgmVolumeMin}
							aria-valuemax={bgm.bgmVolumeMax}
							aria-valuenow={Number(bgm.bgmVolume.toFixed(2))}
							aria-label="Background music volume"
						/>
						<span
							className="select-none text-base leading-none text-slate-500"
							aria-hidden
						>
							🔊
						</span>
					</div>
					<div className="mt-2 flex flex-wrap justify-center gap-1">
						<button
							type="button"
							onClick={bgm.onBgmToggle}
							aria-pressed={bgm.bgmEnabled}
							aria-label={
								bgm.bgmEnabled
									? "Pause background music"
									: "Resume background music"
							}
							className="compact-touch-target flex h-9 w-9 items-center justify-center rounded-md border-0 bg-transparent text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
						>
							<i
								className={`fa-solid text-sm ${bgm.bgmEnabled ? "fa-pause" : "fa-play"}`}
								aria-hidden
							/>
						</button>
						<button
							type="button"
							onClick={bgm.onBgmSkip}
							aria-label="Skip to next music track"
							className="compact-touch-target flex h-9 w-9 items-center justify-center rounded-md border-0 bg-transparent text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
						>
							<i className="fa-solid fa-forward-step text-sm" aria-hidden />
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}

/**
 * Props for the StarfieldBackground component.
 */
export type StarfieldBackgroundProps = {
	/** When true, hide the desktop inline panel; fly speed is only in the burger fly-out */
	flySpeedMenuOnly?: boolean;
	/** When true with `flySpeedMenuOnly` and a mobile viewport, the corner burger is hidden and Taskbar hosts the control via context */
	taskbarHostsSpeedBurger?: boolean;
	/** Optional background music controls */
	bgm?: StarfieldBgmMenuProps;
	/** Child components to render above the starfield */
	children?: React.ReactNode;
};

/**
 * StarfieldBackground component renders an animated starfield background with speed controls.
 * Provides context for speed UI controls and supports background music integration.
 * @param props - The component props
 * @returns The rendered starfield background with controls
 */
export const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
	flySpeedMenuOnly = false,
	taskbarHostsSpeedBurger = false,
	bgm,
	children,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const speedScaleRef = useRef(SPEED_SCALE_DEFAULT);
	const reducedMotion = usePrefersReducedMotion();
	const isMobile = useIsMobileViewport();

	const [speedScale, setSpeedScale] = useState(SPEED_SCALE_DEFAULT);
	const [menuOpen, setMenuOpen] = useState(false);
	const flyoutRef = useRef<HTMLDivElement>(null);
	const cornerBurgerRef = useRef<HTMLButtonElement>(null);
	const taskbarBurgerRef = useRef<HTMLButtonElement>(null);

	const showTaskbarBurger =
		flySpeedMenuOnly && taskbarHostsSpeedBurger && isMobile;
	const showCornerBurger = !showTaskbarBurger;

	useEffect(() => {
		const stored = readStoredSpeedScale();
		speedScaleRef.current = stored;
		setSpeedScale(stored);
	}, []);

	useEffect(() => {
		speedScaleRef.current = speedScale;
	}, [speedScale]);

	useEffect(() => {
		document.documentElement.setAttribute("data-starfield", "");
		return () => document.documentElement.removeAttribute("data-starfield");
	}, []);

	useEffect(() => {
		if (!menuOpen) return;
		const close = () => setMenuOpen(false);
		const onPointerDown = (e: PointerEvent) => {
			const t = e.target as Node;
			if (flyoutRef.current?.contains(t)) return;
			if (cornerBurgerRef.current?.contains(t)) return;
			if (taskbarBurgerRef.current?.contains(t)) return;
			close();
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		document.addEventListener("pointerdown", onPointerDown, true);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown, true);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [menuOpen]);

	useEffect(() => {
		setMenuOpen(false);
		if (flySpeedMenuOnly) return;
		const mq = window.matchMedia(`(min-width: ${MD_MIN_WIDTH}px)`);
		const onChange = () => {
			if (mq.matches) setMenuOpen(false);
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [flySpeedMenuOnly]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.imageSmoothingEnabled = false;

		const baseSpeed = reducedMotion ? SPEED_REDUCED : SPEED_FULL;
		const trailAlpha = reducedMotion ? TRAIL_ALPHA_REDUCED : TRAIL_ALPHA_FULL;

		const dpr = Math.min(window.devicePixelRatio, 2);
		const stars = Array.from({ length: getStarCount() }, () => {
			const s = new Star();
			s.reset();
			return s;
		});

		let rafId = 0;

		const resize = () => {
			setupCanvasSize(canvas, ctx, dpr);
			const rw = canvas.clientWidth;
			const rh = canvas.clientHeight;
			if (rw > 0 && rh > 0) {
				ctx.fillStyle = CANVAS_BG;
				ctx.fillRect(0, 0, rw, rh);
			}
		};

		resize();
		window.addEventListener("resize", resize);

		const animate = () => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (w === 0 || h === 0) {
				rafId = requestAnimationFrame(animate);
				return;
			}
			const centerX = w / 2;
			const centerY = h / 2;

			ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
			ctx.fillRect(0, 0, w, h);

			const step = baseSpeed * speedScaleRef.current;
			for (const star of stars) {
				star.update(step);
				star.draw(ctx, centerX, centerY);
			}

			rafId = requestAnimationFrame(animate);
		};

		rafId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("resize", resize);
		};
	}, [reducedMotion]);

	const onSpeedChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
		(e) => {
			const v = clampSpeedScale(parseFloat(e.target.value));
			speedScaleRef.current = v;
			setSpeedScale(v);
			try {
				localStorage.setItem(SPEED_SCALE_STORAGE_KEY, String(v));
			} catch {
				/* ignore quota / private mode */
			}
		},
		[],
	);

	const toggleMenu = useCallback(() => {
		setMenuOpen((o) => !o);
	}, []);

	const speedUiContextValue: StarfieldSpeedUIContextValue = {
		showTaskbarBurger,
		taskbarBurgerRef,
		menuOpen,
		toggleMenu,
	};

	return (
		<StarfieldSpeedUIContext.Provider value={speedUiContextValue}>
			<div
				className="fixed inset-0 z-[1] pointer-events-none"
				aria-hidden="true"
			>
				<canvas
					ref={canvasRef}
					data-testid="starfield-canvas"
					className="block h-full w-full"
					style={{ background: CANVAS_BG }}
				/>
			</div>

			{/* Desktop inline panel — only when flySpeedMenuOnly is false */}
			<div
				className={`pointer-events-auto fixed z-[25] max-w-[min(18rem,calc(100vw-2rem))] ${flySpeedMenuOnly ? "hidden" : "hidden md:block"}`}
				style={{ top: SAFE_TOP, right: SAFE_RIGHT }}
			>
				<StarfieldSpeedPanel
					idSuffix="desktop"
					speedScale={speedScale}
					onSpeedChange={onSpeedChange}
					bgm={bgm}
				/>
			</div>

			{/* Top-right burger when not taskbar-hosted; fly-out uses StarfieldSpeedPanel */}
			{showCornerBurger ? (
				<div
					className={`pointer-events-auto fixed z-[25] ${flySpeedMenuOnly ? "block" : "md:hidden"}`}
					style={{ top: SAFE_TOP, right: SAFE_RIGHT }}
				>
					<button
						ref={cornerBurgerRef}
						type="button"
						onClick={toggleMenu}
						aria-expanded={menuOpen}
						aria-controls="starfield-speed-flyout"
						aria-label={
							menuOpen
								? "Close game menu"
								: "Open game menu (starfield and music)"
						}
						className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-100 transition-colors duration-200 ease-out hover:text-white"
					>
						<BurgerGlyph menuOpen={menuOpen} />
					</button>
				</div>
			) : null}

			{menuOpen ? (
				<div
					id="starfield-speed-flyout"
					ref={flyoutRef}
					className="pointer-events-auto fixed z-[26] max-w-[min(18rem,calc(100vw-2rem))]"
					style={
						showTaskbarBurger
							? {
									bottom: FLYOUT_ABOVE_TASKBAR_BOTTOM,
									right: SAFE_RIGHT,
								}
							: {
									top: FLYOUT_BELOW_TOP_RIGHT_BURGER,
									right: SAFE_RIGHT,
								}
					}
				>
					<StarfieldSpeedPanel
						idSuffix="flyout-range"
						speedScale={speedScale}
						onSpeedChange={onSpeedChange}
						bgm={bgm}
					/>
				</div>
			) : null}

			{children}
		</StarfieldSpeedUIContext.Provider>
	);
};
