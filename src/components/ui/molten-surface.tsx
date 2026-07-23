"use client";

import { useId } from "react";

const moltenSilhouette = [
  "M54 8",
  "C26 8 10 25 10 52",
  "L10 102",
  "C10 118 22 126 38 128",
  "C54 130 66 142 80 145",
  "C95 149 111 140 114 127",
  "C117 116 129 117 137 125",
  "C146 134 146 150 148 164",
  "L150 184",
  "C151 198 160 207 173 207",
  "C187 207 197 197 197 184",
  "C197 173 189 165 181 159",
  "C171 151 170 137 178 128",
  "C187 118 202 118 211 129",
  "C222 142 230 154 248 154",
  "C269 154 280 143 286 128",
  "C291 118 303 118 311 127",
  "C321 138 319 153 322 163",
  "C325 175 334 181 345 181",
  "C356 181 365 173 365 162",
  "C365 151 355 145 352 136",
  "C348 126 358 119 369 123",
  "C386 128 392 145 410 149",
  "C427 153 442 142 448 128",
  "C454 117 468 118 476 128",
  "C487 142 487 163 489 177",
  "C491 190 500 200 513 200",
  "C526 200 537 190 538 177",
  "C539 165 530 157 522 151",
  "C513 144 512 132 520 125",
  "C529 117 544 119 552 130",
  "C561 143 568 151 585 151",
  "C603 151 617 140 622 127",
  "C627 116 641 117 650 126",
  "C661 138 660 156 663 167",
  "C666 179 675 187 687 187",
  "C700 187 709 178 710 166",
  "C711 156 703 149 697 142",
  "C689 133 692 123 703 120",
  "C719 116 730 130 739 140",
  "C751 153 768 156 784 147",
  "C798 139 802 122 815 122",
  "C829 122 835 136 837 149",
  "L840 190",
  "C841 205 851 216 865 216",
  "C880 216 891 205 891 190",
  "C891 178 882 170 874 163",
  "C864 154 863 139 872 130",
  "C881 120 897 120 906 130",
  "C918 143 924 151 940 148",
  "C956 145 970 132 982 120",
  "C987 115 990 108 990 98",
  "L990 50",
  "C990 24 974 8 946 8",
  "Z"
].join(" ");

export function MoltenSurface() {
  const instanceId = useId().replaceAll(":", "");
  const fillId = `molten-fill-${instanceId}`;
  const depthId = `molten-depth-${instanceId}`;
  const flareId = `molten-flare-${instanceId}`;
  const clipId = `molten-clip-${instanceId}`;

  return (
    <span className="molten-button__surface" aria-hidden="true">
      <svg viewBox="0 0 1000 230" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id={fillId} x1="0" y1="22" x2="1000" y2="174" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--melt-deep)" />
            <stop offset="0.14" stopColor="var(--melt-mid)" />
            <stop offset="0.34" stopColor="var(--melt-hot)" />
            <stop offset="0.5" stopColor="var(--melt-glow)" />
            <stop offset="0.57" stopColor="var(--melt-white)" />
            <stop offset="0.66" stopColor="var(--melt-hot)" />
            <stop offset="0.83" stopColor="var(--melt-mid)" />
            <stop offset="1" stopColor="var(--melt-deep)" />
          </linearGradient>
          <linearGradient id={depthId} x1="0" y1="0" x2="0" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff8c9" stopOpacity="0.38" />
            <stop offset="0.34" stopColor="#ff9c2e" stopOpacity="0.08" />
            <stop offset="0.68" stopColor="#7d1207" stopOpacity="0.38" />
            <stop offset="1" stopColor="#310301" stopOpacity="0.88" />
          </linearGradient>
          <radialGradient id={flareId} cx="0" cy="0" r="1" gradientTransform="translate(360 36) rotate(9) scale(330 92)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fffbd5" stopOpacity="0.88" />
            <stop offset="0.28" stopColor="#ffd05d" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ff6a18" stopOpacity="0" />
          </radialGradient>
          <clipPath id={clipId}>
            <path d={moltenSilhouette} />
          </clipPath>
        </defs>

        <path className="molten-button__shape" d={moltenSilhouette} fill={`url(#${fillId})`} />
        <g clipPath={`url(#${clipId})`}>
          <rect width="1000" height="230" fill={`url(#${depthId})`} />
          <ellipse className="molten-button__flare" cx="360" cy="36" rx="360" ry="98" fill={`url(#${flareId})`} />
          <path className="molten-button__flow molten-button__flow--one" d="M171 92 C163 124 167 160 173 193" />
          <path className="molten-button__flow molten-button__flow--two" d="M504 86 C496 119 503 151 513 185" />
          <path className="molten-button__flow molten-button__flow--three" d="M852 84 C844 122 855 158 865 202" />
          <circle cx="132" cy="34" r="9" fill="#fffbd2" fillOpacity="0.8" />
          <circle cx="731" cy="46" r="6" fill="#ffe276" fillOpacity="0.72" />
        </g>
      </svg>
    </span>
  );
}
