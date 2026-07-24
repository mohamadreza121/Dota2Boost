"use client";

import { useId } from "react";

const moltenFooterSilhouette = [
  "M0 0 H1400 V32",
  "C1368 32 1352 46 1325 45",
  "C1305 44 1297 56 1293 72",
  "C1288 91 1279 102 1267 100",
  "C1254 98 1251 82 1258 66",
  "C1264 51 1251 43 1236 47",
  "C1219 51 1211 66 1192 65",
  "C1174 64 1168 47 1151 45",
  "C1135 43 1127 54 1129 70",
  "C1132 92 1126 112 1113 114",
  "C1099 116 1092 98 1098 78",
  "C1104 56 1090 44 1072 48",
  "C1053 52 1046 68 1027 67",
  "C1007 66 1000 48 981 46",
  "C965 45 957 55 958 72",
  "C959 91 952 104 940 104",
  "C928 103 923 88 928 72",
  "C935 51 920 43 903 48",
  "C883 54 878 72 856 70",
  "C834 68 828 48 808 46",
  "C790 45 782 56 783 75",
  "C784 101 778 135 761 139",
  "C743 142 735 116 743 87",
  "C751 58 734 43 713 48",
  "C693 53 686 70 665 68",
  "C645 66 638 48 618 46",
  "C600 44 591 55 593 73",
  "C596 96 589 116 575 117",
  "C561 118 554 99 561 78",
  "C568 55 553 43 534 48",
  "C515 53 508 70 488 69",
  "C467 68 459 48 440 46",
  "C423 45 414 56 416 75",
  "C418 98 411 109 399 108",
  "C387 107 383 92 389 76",
  "C397 54 381 43 363 48",
  "C343 54 336 72 314 69",
  "C291 66 286 47 265 46",
  "C245 45 236 58 239 78",
  "C243 103 234 126 218 127",
  "C201 127 195 104 203 80",
  "C211 56 194 43 175 48",
  "C153 54 147 70 126 67",
  "C103 64 94 44 71 44",
  "C48 44 32 56 0 47 Z"
].join(" ");

export function MoltenFooterCrown() {
  const instanceId = useId().replaceAll(":", "");
  const fillId = `footer-crown-fill-${instanceId}`;
  const depthId = `footer-crown-depth-${instanceId}`;
  const heatId = `footer-crown-heat-${instanceId}`;
  const shadowId = `footer-crown-shadow-${instanceId}`;
  const clipId = `footer-crown-clip-${instanceId}`;

  return (
    <span className="dota-command-footer__crown" aria-hidden="true">
      <svg viewBox="0 0 1400 145" preserveAspectRatio="none" role="presentation">
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="1400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#321103" />
            <stop offset=".13" stopColor="#8f3604" />
            <stop offset=".26" stopColor="#de750d" />
            <stop offset=".38" stopColor="#672202" />
            <stop offset=".52" stopColor="#bc5406" />
            <stop offset=".65" stopColor="#f1a21e" />
            <stop offset=".79" stopColor="#7f2c03" />
            <stop offset=".9" stopColor="#c35b07" />
            <stop offset="1" stopColor="#2b0e02" />
          </linearGradient>
          <linearGradient id={depthId} x1="0" y1="0" x2="0" y2="145" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffe08a" stopOpacity=".24" />
            <stop offset=".28" stopColor="#ffab28" stopOpacity=".06" />
            <stop offset=".62" stopColor="#6d1f02" stopOpacity=".46" />
            <stop offset="1" stopColor="#210702" stopOpacity=".92" />
          </linearGradient>
          <radialGradient id={heatId}>
            <stop offset="0" stopColor="#ffeeb0" stopOpacity=".8" />
            <stop offset=".32" stopColor="#ffc34b" stopOpacity=".52" />
            <stop offset=".7" stopColor="#f3790b" stopOpacity=".2" />
            <stop offset="1" stopColor="#a53602" stopOpacity="0" />
          </radialGradient>
          <filter id={shadowId} x="-8%" y="-8%" width="116%" height="138%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#190400" floodOpacity=".78" />
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#ff7510" floodOpacity=".2" />
          </filter>
          <clipPath id={clipId}>
            <path d={moltenFooterSilhouette} />
          </clipPath>
        </defs>

        <g filter={`url(#${shadowId})`}>
          <path className="dota-command-footer__crown-shape" d={moltenFooterSilhouette} fill={`url(#${fillId})`} />
          <g clipPath={`url(#${clipId})`}>
            <rect width="1400" height="145" fill={`url(#${depthId})`} />
            <g className="dota-command-footer__crown-heat">
              <ellipse cx="218" cy="17" rx="240" ry="62" fill={`url(#${heatId})`} />
              <ellipse cx="721" cy="10" rx="310" ry="70" fill={`url(#${heatId})`} />
              <ellipse cx="1212" cy="20" rx="245" ry="64" fill={`url(#${heatId})`} />
            </g>
            <g className="dota-command-footer__crown-bubbles">
              <circle cx="84" cy="20" r="4" />
              <circle cx="302" cy="33" r="2.8" />
              <circle cx="558" cy="19" r="3.5" />
              <circle cx="896" cy="28" r="2.6" />
              <circle cx="1122" cy="17" r="4.2" />
              <circle cx="1334" cy="31" r="3" />
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}
