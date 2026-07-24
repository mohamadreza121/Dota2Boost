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
  const rippleId = `nav-melt-ripple-${instanceId}`;
  const rippleShadeId = `nav-melt-ripple-shade-${instanceId}`;
  const shadowId = `nav-melt-shadow-${instanceId}`;
  const clipId = `nav-melt-clip-${instanceId}`;

  return (
    <span className="dota-command-header__melt" aria-hidden="true">
      <svg viewBox="0 0 1400 154" preserveAspectRatio="none" role="presentation">
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="1400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4d3203" />
            <stop offset=".12" stopColor="#bd8910" />
            <stop offset=".26" stopColor="#f1cb4e" />
            <stop offset=".39" stopColor="#8c5d06" />
            <stop offset=".53" stopColor="#d0a020" />
            <stop offset=".68" stopColor="#ffe17a" />
            <stop offset=".82" stopColor="#a97309" />
            <stop offset="1" stopColor="#442b02" />
          </linearGradient>
          <linearGradient id={depthId} x1="0" y1="0" x2="0" y2="154" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff3b0" stopOpacity=".27" />
            <stop offset=".35" stopColor="#e5b932" stopOpacity=".035" />
            <stop offset=".66" stopColor="#684204" stopOpacity=".34" />
            <stop offset="1" stopColor="#2e1b01" stopOpacity=".8" />
          </linearGradient>
          <radialGradient id={heatId}>
            <stop offset="0" stopColor="#fff1aa" stopOpacity=".68" />
            <stop offset=".35" stopColor="#e2b633" stopOpacity=".38" />
            <stop offset="1" stopColor="#8c5a05" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={rippleId} x1="-80" y1="0" x2="1480" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff6c6" stopOpacity="0" />
            <stop offset=".14" stopColor="#fff2a5" stopOpacity=".14" />
            <stop offset=".31" stopColor="#fff9d8" stopOpacity=".045" />
            <stop offset=".5" stopColor="#fff0a0" stopOpacity=".2" />
            <stop offset=".7" stopColor="#fff8d0" stopOpacity=".055" />
            <stop offset=".87" stopColor="#ffe78a" stopOpacity=".13" />
            <stop offset="1" stopColor="#fff6c6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={rippleShadeId} x1="-80" y1="0" x2="1480" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#362000" stopOpacity="0" />
            <stop offset=".18" stopColor="#473000" stopOpacity=".12" />
            <stop offset=".4" stopColor="#2d1a00" stopOpacity=".04" />
            <stop offset=".62" stopColor="#3b2500" stopOpacity=".14" />
            <stop offset=".84" stopColor="#2f1c00" stopOpacity=".06" />
            <stop offset="1" stopColor="#362000" stopOpacity="0" />
          </linearGradient>
          <filter id={shadowId} x="-8%" y="-10%" width="116%" height="135%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1d1100" floodOpacity=".68" />
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#d79a14" floodOpacity=".18" />
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
            <g className="dota-command-header__metal-ripples">
              <path d="M-90 18 C110 4 229 35 398 23 C572 10 680 1 850 19 C1025 38 1167 4 1490 18 L1490 32 C1200 20 1035 49 853 31 C680 14 554 26 397 36 C221 47 100 17 -90 31 Z" fill={`url(#${rippleId})`} />
              <path d="M-80 43 C95 29 236 61 415 48 C589 35 719 27 891 47 C1062 66 1241 31 1480 44 L1480 57 C1238 45 1065 78 888 59 C713 40 595 48 414 61 C230 75 94 42 -80 56 Z" fill={`url(#${rippleShadeId})`} />
              <path d="M-70 65 C132 51 267 81 459 69 C650 57 785 48 978 68 C1150 85 1284 58 1470 66 L1470 76 C1281 70 1147 96 976 80 C783 62 651 70 458 81 C268 93 129 64 -70 77 Z" fill={`url(#${rippleId})`} opacity=".72" />
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}
