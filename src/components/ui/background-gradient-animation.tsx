import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function BackgroundGradientAnimation({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef<HTMLDivElement>(null);
  const curRef = useRef({ x: 0, y: 0 });
  const tgRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const root = document.body;
    const props: [string, string][] = [
      ["--gradient-background-start", gradientBackgroundStart],
      ["--gradient-background-end", gradientBackgroundEnd],
      ["--first-color", firstColor],
      ["--second-color", secondColor],
      ["--third-color", thirdColor],
      ["--fourth-color", fourthColor],
      ["--fifth-color", fifthColor],
      ["--pointer-color", pointerColor],
      ["--size", size],
      ["--blending-value", blendingValue],
    ];
    props.forEach(([k, v]) => root.style.setProperty(k, v));
    return () => {
      props.forEach(([k]) => root.style.removeProperty(k));
    };
  }, [
    blendingValue,
    fifthColor,
    firstColor,
    fourthColor,
    gradientBackgroundEnd,
    gradientBackgroundStart,
    pointerColor,
    secondColor,
    size,
    thirdColor,
  ]);

  useEffect(() => {
    if (!interactive) return;

    const tick = () => {
      const el = interactiveRef.current;
      if (el) {
        const cx = curRef.current.x + (tgRef.current.x - curRef.current.x) / 20;
        const cy = curRef.current.y + (tgRef.current.y - curRef.current.y) / 20;
        curRef.current = { x: cx, y: cy };
        el.style.transform = `translate(${Math.round(cx)}px, ${Math.round(cy)}px)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [interactive]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;
    // Blob được căn tâm ở giữa section; translate đặt **tâm** gradient trùng con trỏ (không phải góc trên-trái).
    tgRef.current = {
      x: mx - rect.width / 2,
      y: my - rect.height / 2,
    };
  };

  const blend = `[mix-blend-mode:var(--blending-value)]` as const;
  const radial = (n: string) =>
    `[background:radial-gradient(circle_at_center,_rgba(var(${n}),_0.85)_0,_rgba(var(${n}),_0)_55%)]` as const;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full min-h-[320px] w-full overflow-hidden bg-[linear-gradient(45deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName,
      )}
      onMouseMove={interactive ? handleMouseMove : undefined}
    >
      <svg className="absolute h-0 w-0" aria-hidden focusable="false">
        <defs>
          <filter id="bgGradBlur" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feBlend in="SourceGraphic" in2="blur" mode="normal" />
          </filter>
        </defs>
      </svg>

      <div className={cn("relative z-10 h-full w-full", className)}>{children}</div>

      <div
        className="gradients-container pointer-events-none absolute inset-0 blur-3xl"
        style={{ filter: isSafari ? "blur(42px)" : undefined }}
      >
        <div
          className={cn(
            "absolute h-[var(--size)] w-[var(--size)] opacity-90 animate-acet-first",
            "left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)]",
            radial("--first-color"),
            blend,
          )}
        />
        <div
          className={cn(
            "absolute h-[var(--size)] w-[var(--size)] opacity-90 animate-acet-second",
            "left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)]",
            radial("--second-color"),
            blend,
          )}
        />
        <div
          className={cn(
            "absolute h-[var(--size)] w-[var(--size)] opacity-90 animate-acet-third",
            "left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)]",
            radial("--third-color"),
            blend,
          )}
        />
        <div
          className={cn(
            "absolute h-[var(--size)] w-[var(--size)] opacity-90 animate-acet-fourth",
            "left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)]",
            radial("--fourth-color"),
            blend,
          )}
        />
        <div
          className={cn(
            "absolute h-[var(--size)] w-[var(--size)] opacity-90 animate-acet-fifth",
            "left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)]",
            radial("--fifth-color"),
            blend,
          )}
        />
        {interactive ? (
          <div
            ref={interactiveRef}
            className={cn(
              "absolute h-[var(--size)] w-[var(--size)] opacity-60",
              "left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)]",
              "[background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)]",
              blend,
            )}
          />
        ) : null}
      </div>
    </div>
  );
}
