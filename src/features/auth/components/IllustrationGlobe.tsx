import React from "react";

interface IllustrationGlobeProps {
  className?: string;
}

export function IllustrationGlobe({ className = "" }: IllustrationGlobeProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[210px] max-h-[210px] select-none pointer-events-none"
        aria-hidden="true"
      >
        {/* Globe wireframe background with dashed latitude/longitude */}
        <circle
          cx="120"
          cy="120"
          r="86"
          stroke="#D8D8D4"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
        {/* Longitudinal curved line */}
        <ellipse
          cx="120"
          cy="120"
          rx="44"
          ry="86"
          stroke="#E2E2DE"
          strokeWidth="1"
          strokeDasharray="2.5 3"
        />
        {/* Latitudinal equator curved line */}
        <ellipse
          cx="120"
          cy="120"
          rx="86"
          ry="38"
          stroke="#E2E2DE"
          strokeWidth="1"
          strokeDasharray="2.5 3"
        />

        {/* Minimalist character drawing */}
        {/* Overhead sweeping arc */}
        <path
          d="M 98 84 C 104 42, 148 40, 168 76"
          stroke="#111110"
          strokeWidth="2.1"
          strokeLinecap="round"
          fill="none"
        />

        {/* Character Head */}
        <circle
          cx="108"
          cy="87"
          r="9.5"
          stroke="#111110"
          strokeWidth="2"
          fill="#FFFFFF"
        />
        {/* Profile / ear stroke inside head */}
        <path
          d="M 106 84 C 109 84, 111 87, 108 90"
          stroke="#111110"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dynamic Ponytail Hair */}
        <path
          d="M 102 88 C 86 96, 76 118, 70 148"
          stroke="#111110"
          strokeWidth="2.1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 100 92 C 88 104, 82 124, 76 150"
          stroke="#111110"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Solid Rectangular Torso */}
        <polygon
          points="101,98 112,100 107,130 96,128"
          fill="#111110"
        />

        {/* Extended right arm pointing down */}
        <path
          d="M 110 104 L 148 132"
          stroke="#111110"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Left leg (forward stride) */}
        <path
          d="M 100 128 L 84 178"
          stroke="#111110"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Right leg (support / back stride) */}
        <path
          d="M 105 129 L 115 178"
          stroke="#111110"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Ground leaf / seed pebble mark */}
        <path
          d="M 137 172 C 141 168, 150 167, 155 171 C 151 176, 142 176, 137 172 Z"
          fill="#111110"
        />
      </svg>
    </div>
  );
}

