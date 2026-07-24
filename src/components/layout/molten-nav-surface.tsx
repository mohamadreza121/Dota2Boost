"use client";

import { useId } from "react";

const moltenNavSilhouette = [
  "M0 0 H1400 V75",
  "C1388 82 1380 85 1368 84",
  "C1359 84 1356 93 1354 108",
  "C1351 132 1347 147 1337 148",
  "C1327 148 1324 135 1328 115",
  "C1331 98 1324 87 1309 87",
  "C1291 87 1286 100 1276 103",
  "C1267 106 1259 101 1256 93",
  "C1253 85 1246 83 1238 85",
  "C1228 88 1225 99 1221 113",
  "C1217 128 1211 136 1203 135",
  "C1195 134 1193 123 1197 108",
  "C1201 92 1193 85 1181 86",
  "C1167 88 1161 102 1149 103",
  "C1134 105 1129 89 1116 87",
  "C1105 85 1098 92 1097 106",
  "C1095 124 1092 139 1082 141",
  "C1072 142 1067 129 1070 110",
  "C1073 92 1065 86 1052 87",
  "C1036 88 1030 101 1018 103",
  "C1005 106 998 96 987 91",
  "C977 87 967 91 964 103",
  "C959 123 955 151 943 152",
  "C930 152 928 132 933 107",
  "C936 91 926 85 913 87",
  "C895 91 890 105 875 104",
  "C860 104 853 88 839 87",
  "C828 87 822 94 819 109",
  "C815 129 811 141 801 141",
  "C791 140 788 126 792 109",
  "C796 92 787 85 774 87",
  "C758 89 752 105 738 105",
  "C722 105 716 88 701 87",
  "C686 87 681 101 674 110",
  "C668 119 658 117 654 106",
  "C650 94 643 87 631 87",
  "C617 87 611 99 608 114",
  "C604 134 600 147 590 148",
  "C579 148 576 132 580 111",
  "C583 94 574 86 562 87",
  "C545 89 540 104 526 105",
  "C511 106 505 91 492 88",
  "C479 85 472 94 470 110",
  "C468 125 464 136 456 137",
  "C447 137 443 124 447 109",
  "C451 92 442 85 429 87",
  "C412 90 407 103 392 104",
  "C377 104 370 89 356 87",
  "C344 86 338 95 336 110",
  "C333 130 329 143 319 144",
  "C308 144 305 129 309 109",
  "C313 92 303 85 291 87",
  "C275 89 269 102 255 103",
  "C241 105 235 91 221 88",
  "C210 86 202 93 200 107",
  "C198 122 194 132 186 133",
  "C177 133 173 121 177 107",
  "C181 92 171 85 158 87",
  "C142 90 135 103 121 102",
  "C105 101 99 86 83 85",
  "C61 84 37 88 0 76 Z"
].join(" ");

export function MoltenNavSurface() {
  const instanceId = useId().replaceAll(":", "");
  const fillId = `nav-melt-fill-${instanceId}`;
  const depthId = `nav-melt-depth-${instanceId}`;
  const heatId = `nav-melt-heat-${instanceId}`;
  const shadowId = `nav-melt-shadow-${instanceId}`;
  const clipId = `nav-melt-clip-${instanceId}`;

  return (
    <span className="dota-command-header__melt" aria-hidden="true">
      <svg viewBox="0 0 1400 154" preserveAspectRatio="none" role="presentation">
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="1400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#6f2905" />
            <stop offset=".12" stopColor="#d66b08" />
            <stop offset=".26" stopColor="#ffc84a" />
            <stop offset=".39" stopColor="#a74405" />
            <stop offset=".53" stopColor="#f19a16" />
            <stop offset=".68" stopColor="#ffd869" />
            <stop offset=".82" stopColor="#c95c06" />
            <stop offset="1" stopColor="#6a2504" />
          </linearGradient>
          <linearGradient id={depthId} x1="0" y1="0" x2="0" y2="154" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff1a0" stopOpacity=".3" />
            <stop offset=".38" stopColor="#ffad21" stopOpacity=".04" />
            <stop offset=".66" stopColor="#a53b03" stopOpacity=".32" />
            <stop offset="1" stopColor="#531603" stopOpacity=".78" />
          </linearGradient>
          <radialGradient id={heatId}>
            <stop offset="0" stopColor="#ffe999" stopOpacity=".78" />
            <stop offset=".35" stopColor="#ffc13b" stopOpacity=".48" />
            <stop offset="1" stopColor="#e76407" stopOpacity="0" />
          </radialGradient>
          <filter id={shadowId} x="-8%" y="-10%" width="116%" height="135%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#2c0801" floodOpacity=".62" />
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#ff8610" floodOpacity=".24" />
          </filter>
          <clipPath id={clipId}>
            <path d={moltenNavSilhouette} />
          </clipPath>
        </defs>

        <g filter={`url(#${shadowId})`}>
          <path className="dota-command-header__melt-shape" d={moltenNavSilhouette} fill={`url(#${fillId})`} />
          <g clipPath={`url(#${clipId})`}>
            <rect width="1400" height="154" fill={`url(#${depthId})`} />
            <ellipse className="dota-command-header__heat-pool dota-command-header__heat-pool--one" cx="235" cy="28" rx="255" ry="72" fill={`url(#${heatId})`} />
            <ellipse className="dota-command-header__heat-pool dota-command-header__heat-pool--two" cx="735" cy="18" rx="320" ry="76" fill={`url(#${heatId})`} />
            <ellipse className="dota-command-header__heat-pool dota-command-header__heat-pool--three" cx="1210" cy="31" rx="250" ry="70" fill={`url(#${heatId})`} />
            <g className="dota-command-header__bubbles">
              <circle cx="88" cy="37" r="4.5" />
              <circle cx="312" cy="23" r="2.7" />
              <circle cx="486" cy="42" r="3.3" />
              <circle cx="874" cy="27" r="3.9" />
              <circle cx="1075" cy="45" r="2.5" />
              <circle cx="1322" cy="30" r="4.2" />
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}
