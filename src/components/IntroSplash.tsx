import { useCallback, useEffect, useRef, useState } from "react";

export default function IntroSplash({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  const [stage, setStage] = useState<"shown" | "leaving">("shown");
  const dismissalStarted = useRef(false);
  const beginExit = useCallback(() => {
    if (dismissalStarted.current) return;
    dismissalStarted.current = true;
    setStage("leaving");
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(beginExit, 3200);

    return () => window.clearTimeout(timeout);
  }, [beginExit]);

  useEffect(() => {
    if (stage !== "leaving") return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timeout = window.setTimeout(
      onDismiss,
      prefersReducedMotion ? 250 : 2300
    );

    return () => window.clearTimeout(timeout);
  }, [onDismiss, stage]);

  return (
    <div
      className={`intro-splash intro-splash-${stage}`}
      role="status"
      aria-label="Selamat datang di HealthyPet"
    >
      <div
        className="intro-splash-glow intro-splash-glow-one"
        aria-hidden="true"
      />
      <div
        className="intro-splash-glow intro-splash-glow-two"
        aria-hidden="true"
      />

      <div className="intro-splash-content">
        <div className="intro-splash-logo-frame">
          <img
            src="/images/veterinary.png"
            alt="Logo Veterinary"
            className="intro-splash-logo"
          />
        </div>
        <p className="intro-splash-eyebrow">KLINIK HEWAN TERPERCAYA</p>
        <h1>HealthyPet</h1>
        <p className="intro-splash-tagline">
          Perawatan sepenuh hati, untuk sahabat yang selalu berarti.
        </p>
      </div>

      <button
        type="button"
        onClick={beginExit}
        className="intro-splash-skip"
        aria-label="Lewati intro"
      >
        Lewati intro
      </button>
    </div>
  );
}
