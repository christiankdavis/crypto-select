// --- TokenScale.tsx ---
import React from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import "./TokenScale.css";

export type TokenScaleProps = {
  leftValue: number;
  rightValue: number;
  /** Icon can be a ReactNode or a string src path */
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  leftLabel?: string;
  rightLabel?: string;
  maxTiltDeg?: number;
  mode?: "inverse" | "direct";
  className?: string;
};

const DefaultCoin: React.FC<{ label?: string }> = ({ label }) => (
  <div className="token-scale__default-coin" aria-hidden>
    {(label?.replace(/[^a-z0-9]/gi, "").slice(0, 3) || "").toUpperCase()}
  </div>
);

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function toDegreesRatio(
  leftVal: number,
  rightVal: number,
  maxTilt: number,
  mode: "inverse" | "direct"
) {
  const l = isFinite(leftVal) ? Math.max(0, leftVal) : 0;
  const r = isFinite(rightVal) ? Math.max(0, rightVal) : 0;

  const weightL = mode === "inverse" ? 1 / (l + 1e-9) : l;
  const weightR = mode === "inverse" ? 1 / (r + 1e-9) : r;

  if (weightL === 0 && weightR === 0) return 0;

  const ratio = weightR / Math.max(weightL, 1e-12);
  const logRatio = Math.log10(Math.max(ratio, 1e-12));
  const scaled = Math.tanh(logRatio);
  return clamp(scaled * maxTilt, -maxTilt, maxTilt);
}

function renderIcon(icon?: React.ReactNode | string, label?: string) {
  if (typeof icon === "string") {
    return (
      <img
        src={icon}
        alt={label || "token"}
        className="token-scale__img-icon"
      />
    );
  }
  return icon ?? <DefaultCoin label={label} />;
}

const TokenScale: React.FC<TokenScaleProps> = ({
  leftValue,
  rightValue,
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
  maxTiltDeg = 12,
  mode = "inverse",
  className = "",
}) => {
  // Beam rotation spring
  const rotateSpring = useSpring(0, { stiffness: 120, damping: 16, mass: 0.6 });

  // Compute desired degrees from values
  const deg = toDegreesRatio(leftValue, rightValue, maxTiltDeg, mode);
  React.useEffect(() => {
    rotateSpring.set(deg);
  }, [deg, rotateSpring]);

  // Keep labels readable by counter-rotating them against the beam tilt
  const counterRotate = useTransform(rotateSpring, (v) => -v);

  // Animated shadow strengths from tilt
  const leftShadowMV = useTransform(rotateSpring, (v) =>
    v > 0 ? 0.15 : 0.35 + Math.min(1, Math.abs(v) / maxTiltDeg) * 0.25
  );
  const rightShadowMV = useTransform(rotateSpring, (v) =>
    v > 0 ? 0.35 + Math.min(1, Math.abs(v) / maxTiltDeg) * 0.25 : 0.15
  );

  // Convert to CSS strings
  const leftShadowCss = useMotionTemplate`0 6px 10px rgba(0,0,0,${leftShadowMV})`;
  const rightShadowCss = useMotionTemplate`0 6px 10px rgba(0,0,0,${rightShadowMV})`;

  // -------- SLIDE ALONG THE PAN --------
  // Pan inner width ~ 88px (112 - 24); icon 44px → safe travel from center = 22px.
  const MAX_TRAVEL = 22;

  // Map tilt linearly to travel so at max tilt you reach the edge.
  const slideX = useTransform(rotateSpring, (v) => {
    const ratio = clamp(v / (maxTiltDeg || 1), -1, 1);
    return ratio * MAX_TRAVEL;
  });

  // Tiny vertical settle for weight (0..~3px)
  const settleY = useTransform(rotateSpring, (v) => {
    const r = Math.abs(v) / (maxTiltDeg || 1);
    return (1 - Math.cos((Math.min(1, r) * Math.PI) / 2)) * 3;
  });
  // ----------------------------------------------------------

  return (
    <div className={`token-scale ${className}`}>
      <div className="token-scale__wrap">
        <div className="token-scale__pillar" />
        <div className="token-scale__fulcrum" />

        <motion.div
          className="token-scale__beam"
          style={{ rotate: rotateSpring }}
        >
          <div className="token-scale__chain token-scale__chain--left" />
          <div className="token-scale__chain token-scale__chain--right" />

          {/* Left pan */}
          <div className="token-scale__pan token-scale__pan--left">
            <motion.div
              className="token-scale__pan-bar"
              style={{ boxShadow: leftShadowCss }}
            />
            {/* ANCHOR keeps element centered; child motion div does the sliding */}
            <div className="token-scale__token-anchor">
              <motion.div
                className="token-scale__token"
                style={{ rotate: counterRotate, x: slideX, y: settleY }}
              >
                <div className="token-scale__icon token-scale__icon--contained">
                  {renderIcon(leftIcon, leftLabel)}
                </div>
                {leftLabel ? (
                  <span className="token-scale__label-text">{leftLabel}</span>
                ) : null}
              </motion.div>
            </div>
          </div>

          {/* Right pan */}
          <div className="token-scale__pan token-scale__pan--right">
            <motion.div
              className="token-scale__pan-bar"
              style={{ boxShadow: rightShadowCss }}
            />
            <div className="token-scale__token-anchor">
              <motion.div
                className="token-scale__token"
                style={{ rotate: counterRotate, x: slideX, y: settleY }}
              >
                <div className="token-scale__icon token-scale__icon--contained">
                  {renderIcon(rightIcon, rightLabel)}
                </div>
                {rightLabel ? (
                  <span className="token-scale__label-text">{rightLabel}</span>
                ) : null}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="token-scale__legend">
          "The power of one is the power to believe"
        </div>
      </div>
    </div>
  );
};

export default TokenScale;
