"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  type PointerEvent as ReactPointerEvent
} from "react";

interface CoachingArtifactCardProps {
  eyebrow: string;
  title: string;
  description: string;
  bestFor: string;
  benefits: readonly string[];
  href: string;
  ctaLabel: string;
  sequence?: string;
}

interface ArtifactDefinitionsProps {
  id: string;
  compact?: boolean;
}

function ArtifactDefinitions({ id, compact = false }: ArtifactDefinitionsProps) {
  return (
    <defs>
      <linearGradient id={`${id}-obsidian`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#302e32" />
        <stop offset="0.18" stopColor="#131417" />
        <stop offset="0.52" stopColor="#07080a" />
        <stop offset="0.78" stopColor="#181318" />
        <stop offset="1" stopColor="#030405" />
      </linearGradient>
      <linearGradient id={`${id}-obsidian-edge`} x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stopColor="#777078" />
        <stop offset="0.1" stopColor="#242126" />
        <stop offset="0.7" stopColor="#070708" />
        <stop offset="1" stopColor="#25151a" />
      </linearGradient>
      <linearGradient id={`${id}-iron`} x1="0.04" y1="0" x2="0.94" y2="1">
        <stop offset="0" stopColor="#676065" />
        <stop offset="0.09" stopColor="#28262b" />
        <stop offset="0.38" stopColor="#141519" />
        <stop offset="0.73" stopColor="#272126" />
        <stop offset="1" stopColor="#09090b" />
      </linearGradient>
      <linearGradient id={`${id}-copper`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7c5d4e" />
        <stop offset="0.18" stopColor="#2e4541" />
        <stop offset="0.4" stopColor="#94654f" />
        <stop offset="0.68" stopColor="#263b3c" />
        <stop offset="0.84" stopColor="#503632" />
        <stop offset="1" stopColor="#16191b" />
      </linearGradient>
      <linearGradient id={`${id}-copper-edge`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b39074" />
        <stop offset="0.2" stopColor="#48625c" />
        <stop offset="0.65" stopColor="#38282a" />
        <stop offset="1" stopColor="#120e11" />
      </linearGradient>
      <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#17161a" />
        <stop offset="0.32" stopColor="#0a0a0d" />
        <stop offset="0.72" stopColor="#100d12" />
        <stop offset="1" stopColor="#1a1015" />
      </linearGradient>
      <linearGradient id={`${id}-amber`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5e2418" />
        <stop offset="0.25" stopColor="#e6a542" />
        <stop offset="0.55" stopColor="#7f3522" />
        <stop offset="0.76" stopColor="#f0bf62" />
        <stop offset="1" stopColor="#3c1415" />
      </linearGradient>
      <linearGradient id={`${id}-violet`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a2c62" stopOpacity="0.1" />
        <stop offset="0.45" stopColor="#b078d2" stopOpacity="0.88" />
        <stop offset="1" stopColor="#533063" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id={`${id}-ivory-light`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff3ce" stopOpacity="0" />
        <stop offset="0.48" stopColor="#fff1c9" stopOpacity="0.14" />
        <stop offset="0.58" stopColor="#c9a7d9" stopOpacity="0.08" />
        <stop offset="1" stopColor="#fff3ce" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-rivet`} cx="0.32" cy="0.24" r="0.8">
        <stop offset="0" stopColor="#a49a91" />
        <stop offset="0.18" stopColor="#4c484a" />
        <stop offset="0.72" stopColor="#151518" />
        <stop offset="1" stopColor="#050506" />
      </radialGradient>
      <pattern
        id={`${id}-hammered`}
        width={compact ? 42 : 54}
        height={compact ? 36 : 46}
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M3 14C12 4 24 5 31 15S47 29 54 18M-8 39C4 28 17 28 25 37S40 49 51 40"
          fill="none"
          stroke="#d2c3b2"
          strokeOpacity="0.035"
          strokeWidth="2"
        />
        <path
          d="M7 23c8 5 15 5 23-1M34 4c5 4 9 4 15 0"
          fill="none"
          stroke="#000"
          strokeOpacity="0.22"
          strokeWidth="2.6"
        />
        <circle cx="12" cy="8" r="1.2" fill="#d6c8b8" fillOpacity="0.07" />
        <circle cx="38" cy="30" r="1.5" fill="#000" fillOpacity="0.32" />
      </pattern>
      <pattern
        id={`${id}-grain`}
        width={compact ? 29 : 35}
        height={compact ? 25 : 31}
        patternUnits="userSpaceOnUse"
      >
        <path d="M3 7h7M20 17h4M11 28h10" stroke="#f2e5d1" strokeOpacity="0.035" />
        <path d="M15 4h3M27 25h6M1 21h4" stroke="#000" strokeOpacity="0.28" />
        <circle cx="25" cy="9" r="0.9" fill="#d4c4b4" fillOpacity="0.08" />
        <circle cx="7" cy="17" r="1.2" fill="#000" fillOpacity="0.34" />
      </pattern>
      <filter
        id={`${id}-seam-glow`}
        x="-35%"
        y="-35%"
        width="170%"
        height="170%"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur stdDeviation={compact ? 2.4 : 3.2} />
      </filter>
    </defs>
  );
}

function DesktopArtifact({ id }: { id: string }) {
  const silhouette =
    "M76 120 131 78 239 69 315 43 452 58 552 31 672 51 776 37 914 58 1027 47 1162 86 1193 154 1166 224 1194 316 1170 393 1195 500 1149 593 1047 625 955 655 816 640 718 675 604 650 500 678 391 651 262 667 168 626 89 578 105 489 60 420 84 336 54 242 87 183Z";

  return (
    <svg
      aria-hidden="true"
      className="coaching-artifact__art coaching-artifact__art--desktop"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 1240 700"
    >
      <ArtifactDefinitions id={id} />

      <g className="coaching-artifact__layer coaching-artifact__layer--far">
        <path d={silhouette} fill="#010102" opacity="0.78" transform="translate(0 18)" />
        <path
          d="M49 221 87 181 68 138 111 109 153 88 169 51 245 68 278 37 331 53 352 104 312 133 231 123 173 151 128 211Z"
          fill={`url(#${id}-copper-edge)`}
          opacity="0.8"
        />
        <path
          d="m1085 68 78 17 33 54-19 62 31 41-28 49-67-3-24-51 16-54-36-45Z"
          fill={`url(#${id}-copper)`}
          opacity="0.76"
        />
        <path
          d="m928 632 51-36 104 4 39-31 45 22-17 40-79 22-74-5-43 29Z"
          fill="#182825"
          opacity="0.78"
        />
      </g>

      <g className="coaching-artifact__layer coaching-artifact__layer--mid">
        <path d={silhouette} fill={`url(#${id}-copper)`} />
        <path d={silhouette} fill={`url(#${id}-hammered)`} opacity="0.86" />
        <path
          d="M91 135 145 95 244 88 324 62 452 75 554 50 672 70 779 55 911 76 1018 65 1145 101 1169 158 1144 225 1171 315 1147 392 1170 493 1132 573 1035 602 944 632 813 617 715 651 607 627 501 654 394 627 267 643 181 603 113 559 128 486 84 414 108 335 79 249 109 187Z"
          fill={`url(#${id}-obsidian-edge)`}
        />
        <path
          d="M106 151 156 113 251 106 330 80 456 92 560 68 675 88 781 74 908 94 1009 84 1127 116 1147 166 1124 228 1149 317 1127 389 1148 482 1113 551 1025 580 933 607 809 593 711 626 609 603 503 628 397 603 275 619 192 582 136 543 149 478 107 408 130 334 102 255 130 198Z"
          fill={`url(#${id}-obsidian)`}
        />
        <path
          d="M106 151 156 113 251 106 330 80 456 92 560 68 675 88 781 74 908 94 1009 84 1127 116 1147 166 1124 228 1149 317 1127 389 1148 482 1113 551 1025 580 933 607 809 593 711 626 609 603 503 628 397 603 275 619 192 582 136 543 149 478 107 408 130 334 102 255 130 198Z"
          fill={`url(#${id}-grain)`}
          opacity="0.94"
        />

        <path
          d="M327 129 441 103 555 119 677 101 790 119 907 104 1043 129 1100 177 1081 244 1104 325 1081 401 1099 490 1061 535 961 560 838 549 733 578 622 558 511 579 407 558 318 579 279 528 293 450 269 379 292 302 272 219Z"
          fill="#020204"
          opacity="0.9"
          transform="translate(5 9)"
        />
        <path
          d="M327 129 441 103 555 119 677 101 790 119 907 104 1043 129 1100 177 1081 244 1104 325 1081 401 1099 490 1061 535 961 560 838 549 733 578 622 558 511 579 407 558 318 579 279 528 293 450 269 379 292 302 272 219Z"
          fill={`url(#${id}-panel)`}
        />
        <path
          d="M340 143 443 120 555 136 678 118 789 136 905 122 1036 145 1082 183"
          fill="none"
          stroke="#c8b9a7"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        <path
          d="M1082 183 1065 244 1087 326 1064 399 1080 479 1048 518"
          fill="none"
          stroke="#000"
          strokeOpacity="0.74"
          strokeWidth="5"
        />
        <path
          d="M1050 522 956 544 836 533 730 561 620 541 511 562 410 541 328 560"
          fill="none"
          stroke="#5f4546"
          strokeOpacity="0.21"
          strokeWidth="2"
        />

        <path
          d="M101 254 131 198 170 178 188 128 246 113 293 139 282 207 303 260 276 320 297 383 270 445 288 508 247 567 181 573 137 537 151 474 110 408 132 335Z"
          fill="#020204"
          opacity="0.94"
        />
        <path
          d="M116 253 145 207 183 190 198 146 244 132 274 150 263 207 284 260 258 319 278 381 251 442 269 500 236 547 187 553 155 523 170 469 130 403 151 334Z"
          fill={`url(#${id}-iron)`}
        />
        <path
          d="M116 253 145 207 183 190 198 146 244 132 274 150 263 207 284 260 258 319 278 381 251 442 269 500 236 547 187 553 155 523 170 469 130 403 151 334Z"
          fill={`url(#${id}-hammered)`}
          opacity="0.72"
        />
      </g>

      <g className="coaching-artifact__layer coaching-artifact__layer--near">
        <path
          d="m91 223 29-5 17 13-19 19-27-3-11-11Zm32 278 32-17 20 15-9 30-35 4-18-14Zm1011-269 30-18 25 11-7 34-36 6-19-14Zm-55 287 42-6 23 20-17 28-47 5-15-25Z"
          fill={`url(#${id}-copper-edge)`}
        />
        <path
          d="m343 92 23-37 42 7 13 31-23 19-39-2Zm414-29 31-31 39 13 5 38-27 20-42-8Zm-254 557 34 9 15 35-27 15-44-8-5-31Z"
          fill="#17171a"
          stroke="#746568"
          strokeOpacity="0.24"
          strokeWidth="2"
        />

        <path
          className="coaching-artifact__seam coaching-artifact__seam--glow"
          d="m558 68 8 28-17 25 12 20-21 25 16 29-26 31 11 26"
          fill="none"
          stroke={`url(#${id}-amber)`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="9"
          filter={`url(#${id}-seam-glow)`}
          opacity="0.28"
        />
        <path
          className="coaching-artifact__seam"
          d="m558 68 8 28-17 25 12 20-21 25 16 29-26 31 11 26"
          fill="none"
          stroke="#1a0708"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <path
          className="coaching-artifact__seam coaching-artifact__seam--core"
          d="m558 68 8 28-17 25 12 20-21 25 16 29-26 31 11 26"
          fill="none"
          stroke={`url(#${id}-amber)`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.6"
        />
        <path
          className="coaching-artifact__seam coaching-artifact__seam--glow"
          d="m1055 123-16 30 13 25-29 29 10 34-22 24"
          fill="none"
          stroke={`url(#${id}-violet)`}
          strokeWidth="8"
          filter={`url(#${id}-seam-glow)`}
          opacity="0.25"
        />
        <path
          className="coaching-artifact__seam coaching-artifact__seam--violet"
          d="m1055 123-16 30 13 25-29 29 10 34-22 24"
          fill="none"
          stroke="#8c5da8"
          strokeLinecap="round"
          strokeWidth="2"
          opacity="0.55"
        />

        <g className="coaching-artifact__engraving" fill="none" stroke="#bfa99d">
          <path d="M349 167h130l14-12h104" strokeOpacity="0.14" />
          <path d="M352 519h88l12 10h155" strokeOpacity="0.1" />
          <path d="M1006 177h32l13 14-12 15 14 16-13 15" strokeOpacity="0.2" />
          <path d="M320 284h27l11 11-11 11h-27" strokeOpacity="0.16" />
          <path d="M320 329h17m-17 20h28m-28 20h14" strokeOpacity="0.09" />
          <path
            d="m992 482 13-13 13 13-13 13Zm-28 0 8-8 8 8-8 8Zm69 0 8-8 8 8-8 8Z"
            stroke="#a971c2"
            strokeOpacity="0.34"
          />
        </g>

        <g fill={`url(#${id}-rivet)`}>
          <circle cx="318" cy="177" r="7" />
          <circle cx="1072" cy="190" r="7" />
          <circle cx="1052" cy="519" r="6" />
          <circle cx="333" cy="535" r="6" />
          <circle cx="210" cy="173" r="6" />
          <circle cx="201" cy="529" r="6" />
        </g>
        <g fill="none" stroke="#08080a" strokeWidth="1.5" opacity="0.85">
          <path d="m313 177 10 0m-5-5v10" />
          <path d="m1067 190 10 0m-5-5v10" />
          <path d="m1048 516 8 6m0-8-8 7" />
          <path d="m329 532 8 6m0-8-8 7" />
        </g>

        <g className="coaching-artifact__scratches" fill="none" stroke="#d8c8bb">
          <path d="m389 204 76-19m-62 28 49-12m513 165 66-17m-77 31 40-10" />
          <path d="m720 139 41-9m-22 17 68-14M438 491l63-15m-52 25 31-8" />
        </g>

        <g className="coaching-artifact__particles">
          <path d="m85 116 8-18 7 19-7 9Zm1080 438 7-16 8 15-7 10Z" fill="#bc7242" />
          <path d="m1136 81 4-10 5 10-5 6Zm-1034 470 4-9 5 9-5 6Z" fill="#a46fbc" />
          <circle cx="64" cy="183" r="3" fill="#d6a34b" />
          <circle cx="1188" cy="444" r="3.5" fill="#a46fbc" />
          <circle cx="1129" cy="623" r="2.4" fill="#dcad5d" />
        </g>
      </g>

      <path
        className="coaching-artifact__light-sweep"
        d="M151 91 397 72 1076 575 808 631Z"
        fill={`url(#${id}-ivory-light)`}
      />
    </svg>
  );
}

function MobileArtifact({ id }: { id: string }) {
  const silhouette =
    "M66 74 146 45 218 57 300 31 390 50 479 35 558 62 578 124 557 188 583 256 564 331 584 407 560 474 578 558 551 638 572 725 548 816 566 907 533 1042 463 1083 390 1068 316 1094 244 1072 164 1091 91 1050 70 967 45 892 66 807 43 728 64 649 47 566 68 486 44 401 66 327 45 247 69 181 45 119Z";

  return (
    <svg
      aria-hidden="true"
      className="coaching-artifact__art coaching-artifact__art--mobile"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 620 1140"
    >
      <ArtifactDefinitions id={id} compact />

      <g className="coaching-artifact__layer coaching-artifact__layer--far">
        <path d={silhouette} fill="#010102" opacity="0.82" transform="translate(0 16)" />
        <path
          d="M47 171 71 112 133 62 206 66 232 104 205 143 137 147 94 198Z"
          fill={`url(#${id}-copper-edge)`}
        />
        <path
          d="m494 40 72 27 26 62-25 49 26 48-28 42-58-15-11-59 17-45-31-55Z"
          fill={`url(#${id}-copper)`}
          opacity="0.84"
        />
        <path
          d="m436 1050 67-45 67 17-12 62-91 35Z"
          fill="#1d302d"
          opacity="0.8"
        />
      </g>

      <g className="coaching-artifact__layer coaching-artifact__layer--mid">
        <path d={silhouette} fill={`url(#${id}-copper)`} />
        <path d={silhouette} fill={`url(#${id}-hammered)`} />
        <path
          d="M80 91 151 64 221 75 303 51 390 68 474 55 541 78 559 128 538 190 563 257 544 328 564 406 540 474 559 558 531 638 553 726 528 811 546 902 516 1024 455 1058 388 1046 314 1072 245 1050 168 1067 105 1032 87 960 65 889 86 807 64 729 84 650 67 568 87 486 66 404 87 329 65 252 86 185 65 125Z"
          fill={`url(#${id}-obsidian-edge)`}
        />
        <path
          d="M96 108 158 84 225 94 306 70 391 87 469 75 525 94 541 133 520 192 544 260 526 327 545 404 522 472 540 556 513 636 535 726 510 809 528 900 499 1006 449 1035 386 1024 313 1050 248 1028 174 1045 121 1016 105 953 83 886 103 806 83 730 102 650 85 570 104 487 84 408 104 331 84 256 104 192 84 133Z"
          fill={`url(#${id}-obsidian)`}
        />
        <path
          d="M96 108 158 84 225 94 306 70 391 87 469 75 525 94 541 133 520 192 544 260 526 327 545 404 522 472 540 556 513 636 535 726 510 809 528 900 499 1006 449 1035 386 1024 313 1050 248 1028 174 1045 121 1016 105 953 83 886 103 806 83 730 102 650 85 570 104 487 84 408 104 331 84 256 104 192 84 133Z"
          fill={`url(#${id}-grain)`}
        />
        <path
          d="M106 298 171 275 240 290 311 275 390 291 465 279 505 310 490 379 511 458 490 543 510 632 485 713 503 808 481 906 447 986 382 997 315 1021 250 998 184 1012 124 976 111 889 91 808 111 726 91 640 111 557 91 475 112 394 93 330Z"
          fill="#020203"
          opacity="0.9"
          transform="translate(3 8)"
        />
        <path
          d="M106 298 171 275 240 290 311 275 390 291 465 279 505 310 490 379 511 458 490 543 510 632 485 713 503 808 481 906 447 986 382 997 315 1021 250 998 184 1012 124 976 111 889 91 808 111 726 91 640 111 557 91 475 112 394 93 330Z"
          fill={`url(#${id}-panel)`}
        />
        <path
          d="M121 312 174 292 241 307 311 293 389 309 461 297 489 319"
          fill="none"
          stroke="#cdbba9"
          strokeOpacity="0.17"
          strokeWidth="2"
        />
        <path
          d="M126 963 185 991 249 977 316 1000 381 976 438 968"
          fill="none"
          stroke="#65474b"
          strokeOpacity="0.22"
          strokeWidth="2"
        />
      </g>

      <g className="coaching-artifact__layer coaching-artifact__layer--near">
        <path
          d="m70 341 31-15 20 19-14 33-36 2-15-22Zm452 202 29-17 25 12-4 38-37 12-23-19Zm-16 391 36-8 23 24-13 34-45 5-15-26Z"
          fill={`url(#${id}-copper-edge)`}
        />

        <path
          className="coaching-artifact__seam coaching-artifact__seam--glow"
          d="m390 87-12 31 19 24-20 31 14 33-25 36 12 39"
          fill="none"
          stroke={`url(#${id}-amber)`}
          strokeWidth="9"
          filter={`url(#${id}-seam-glow)`}
          opacity="0.28"
        />
        <path
          className="coaching-artifact__seam"
          d="m390 87-12 31 19 24-20 31 14 33-25 36 12 39"
          fill="none"
          stroke="#190707"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <path
          className="coaching-artifact__seam coaching-artifact__seam--core"
          d="m390 87-12 31 19 24-20 31 14 33-25 36 12 39"
          fill="none"
          stroke={`url(#${id}-amber)`}
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          className="coaching-artifact__seam coaching-artifact__seam--violet"
          d="m505 666-21 25 13 31-25 26 11 37-18 28"
          fill="none"
          stroke="#a46bc0"
          strokeLinecap="round"
          strokeWidth="2"
          opacity="0.55"
        />

        <g className="coaching-artifact__engraving" fill="none" stroke="#c2ada0">
          <path d="M133 345h80l12-11h76" strokeOpacity="0.13" />
          <path d="M130 941h70l11 10h101" strokeOpacity="0.1" />
          <path
            d="m456 906 12-12 12 12-12 12Zm-25 0 7-7 7 7-7 7Z"
            stroke="#aa74c2"
            strokeOpacity="0.34"
          />
        </g>

        <g fill={`url(#${id}-rivet)`}>
          <circle cx="119" cy="323" r="6.5" />
          <circle cx="484" cy="322" r="6.5" />
          <circle cx="133" cy="970" r="6" />
          <circle cx="454" cy="966" r="6" />
        </g>
        <g className="coaching-artifact__scratches" fill="none" stroke="#d4c2b5">
          <path d="m145 401 54-15m-44 27 32-9m241 204 48-14m-54 28 31-9" />
          <path d="m183 824 52-13m-39 25 26-7" />
        </g>
        <g className="coaching-artifact__particles">
          <path d="m66 68 7-17 7 18-7 9Zm487 779 6-14 7 14-6 8Z" fill="#c57b45" />
          <circle cx="49" cy="244" r="3" fill="#a56ebd" />
          <circle cx="569" cy="450" r="3" fill="#d2a452" />
          <circle cx="538" cy="1080" r="2.5" fill="#a970c1" />
        </g>
      </g>

      <path
        className="coaching-artifact__light-sweep"
        d="M73 78 197 48 554 946 449 1028Z"
        fill={`url(#${id}-ivory-light)`}
      />
    </svg>
  );
}

function ReplayRelic({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      className="coaching-artifact__crest-art"
      focusable="false"
      viewBox="0 0 320 360"
    >
      <defs>
        <linearGradient id={`${id}-crest-back`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#99725c" />
          <stop offset="0.22" stopColor="#36504c" />
          <stop offset="0.54" stopColor="#4f3537" />
          <stop offset="0.8" stopColor="#1d2929" />
          <stop offset="1" stopColor="#120e11" />
        </linearGradient>
        <linearGradient id={`${id}-crest-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#575159" />
          <stop offset="0.15" stopColor="#232329" />
          <stop offset="0.53" stopColor="#0a0b0e" />
          <stop offset="0.82" stopColor="#22191f" />
          <stop offset="1" stopColor="#08070a" />
        </linearGradient>
        <linearGradient id={`${id}-crest-bevel`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#c1a98d" />
          <stop offset="0.13" stopColor="#5e4c4a" />
          <stop offset="0.42" stopColor="#263e3a" />
          <stop offset="0.76" stopColor="#3d2932" />
          <stop offset="1" stopColor="#120c11" />
        </linearGradient>
        <radialGradient id={`${id}-crest-core`} cx="0.42" cy="0.36" r="0.72">
          <stop offset="0" stopColor="#d7a76d" />
          <stop offset="0.18" stopColor="#8e4a36" />
          <stop offset="0.47" stopColor="#57305d" />
          <stop offset="0.72" stopColor="#17131b" />
          <stop offset="1" stopColor="#050507" />
        </radialGradient>
        <filter
          id={`${id}-crest-glow`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <path
        d="m38 75 72-48 111 14 58 56-21 69 21 55-49 105-83 25-91-49-8-78-28-58Z"
        fill="#010102"
        opacity="0.76"
        transform="translate(0 12)"
      />
      <path
        d="m28 66 78-51 120 15 63 60-23 73 23 58-51 110-91 27-99-52-9-79-30-62Z"
        fill={`url(#${id}-crest-back)`}
      />
      <path
        d="m45 78 67-43 103 13 52 50-20 65 20 52-42 94-77 24-81-43-7-70-27-55Z"
        fill={`url(#${id}-crest-bevel)`}
      />
      <path
        d="m62 88 57-35 87 11 40 40-16 57 17 47-35 82-64 20-65-35-6-62-23-48Z"
        fill={`url(#${id}-crest-face)`}
      />
      <path
        d="m78 103 47-28 72 9 28 28-12 49 14 42-28 68-51 16-50-27-5-53-19-42Z"
        fill="none"
        stroke="#a8836b"
        strokeOpacity="0.34"
        strokeWidth="2.5"
      />
      <path
        d="M117 117c-29 17-40 50-26 78 13 27 46 40 75 28 17-7 29-20 35-36"
        fill="none"
        stroke="#8e5aa8"
        strokeLinecap="round"
        strokeOpacity="0.34"
        strokeWidth="10"
        filter={`url(#${id}-crest-glow)`}
      />
      <path
        className="coaching-artifact__crest-rune"
        d="M117 117c-29 17-40 50-26 78 13 27 46 40 75 28 17-7 29-20 35-36"
        fill="none"
        stroke="#aa78c0"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="m191 166 19 20-27 7"
        fill="none"
        stroke="#c493d6"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3"
      />
      <path
        d="m118 121 70 42-67 48Z"
        fill="#170a0c"
        stroke="#d2a45e"
        strokeOpacity="0.72"
        strokeWidth="8"
      />
      <path
        className="coaching-artifact__crest-core"
        d="m127 136 48 28-46 33Z"
        fill={`url(#${id}-crest-core)`}
        stroke="#f0c173"
        strokeOpacity="0.52"
        strokeWidth="2"
      />
      <path
        d="m139 76 6 19 17 7-17 7-6 20-7-20-17-7 17-7Zm-42 157 5 13 12 5-12 5-5 13-5-13-12-5 12-5Z"
        fill="#b281c4"
        fillOpacity="0.56"
      />
      <path
        d="m212 57-18 32 10 22-17 25m-98-72 14 25-9 26m126 115-17 21 8 23-16 25"
        fill="none"
        stroke="#0b070a"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path
        className="coaching-artifact__crest-seam"
        d="m212 57-18 32 10 22-17 25m-98-72 14 25-9 26m126 115-17 21 8 23-16 25"
        fill="none"
        stroke="#b76939"
        strokeLinecap="round"
        strokeOpacity="0.72"
        strokeWidth="2"
      />
      <g fill="#09090b" stroke="#9d8c82" strokeOpacity="0.22">
        <path d="m49 117-20 22 9 32 19-10Z" />
        <path d="m246 101 29 12-9 35-22 8Z" />
        <path d="m58 268-18 23 26 20 13-22Z" />
        <path d="m218 287 28 8-8 36-31 8Z" />
      </g>
      <g fill="#d7c6b4" fillOpacity="0.17">
        <circle cx="75" cy="106" r="4" />
        <circle cx="227" cy="104" r="4" />
        <circle cx="82" cy="274" r="3.5" />
        <circle cx="218" cy="273" r="3.5" />
      </g>
    </svg>
  );
}

function BenefitRune() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 28 28">
      <path d="m14 2 10 8-3 12-12 4-7-10L6 5Z" fill="#09090b" />
      <path d="m14 5 7 6-2 8-9 3-5-7 3-8Z" fill="none" stroke="currentColor" />
      <path d="m9 14 3 3 7-8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ArtifactCta({ href, label, id }: { href: string; label: string; id: string }) {
  return (
    <Link className="coaching-artifact__cta" href={href}>
      <svg aria-hidden="true" focusable="false" preserveAspectRatio="none" viewBox="0 0 360 78">
        <defs>
          <linearGradient id={`${id}-cta-metal`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5f4b48" />
            <stop offset="0.2" stopColor="#202329" />
            <stop offset="0.68" stopColor="#121116" />
            <stop offset="1" stopColor="#40272e" />
          </linearGradient>
          <linearGradient id={`${id}-cta-edge`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#49605b" />
            <stop offset="0.45" stopColor="#b37b51" />
            <stop offset="1" stopColor="#5d385f" />
          </linearGradient>
        </defs>
        <path d="m9 10 272-4 23 13 46-2-14 23 12 19-52-2-20 14L4 66 14 40Z" fill="#020203" opacity="0.82" transform="translate(0 5)" />
        <path d="m9 10 272-4 23 13 46-2-14 23 12 19-52-2-20 14L4 66 14 40Z" fill={`url(#${id}-cta-metal)`} />
        <path d="m18 17 257-4 21 13 36-2-9 16 8 12-38-1-20 12-258-4 8-20Z" fill="none" stroke={`url(#${id}-cta-edge)`} strokeOpacity="0.66" strokeWidth="1.5" />
        <path className="coaching-artifact__cta-seam" d="m281 15 13 13-9 12 13 12-15 12" fill="none" stroke="#d99a54" strokeWidth="2" />
      </svg>
      <span>{label}</span>
      <span aria-hidden="true" className="coaching-artifact__cta-arrow">
        <i />
        <b>›</b>
      </span>
    </Link>
  );
}

export function CoachingArtifactCard({
  eyebrow,
  title,
  description,
  bestFor,
  benefits,
  href,
  ctaLabel,
  sequence = "I"
}: CoachingArtifactCardProps) {
  const reactId = useId();
  const id = `coaching-artifact-${reactId.replaceAll(":", "")}`;
  const articleRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const node = articleRef.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      node.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.dataset.revealed = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.16 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    []
  );

  function applyPointerPosition(node: HTMLElement) {
    const { x, y } = pointerRef.current;

    node.style.setProperty("--artifact-tilt-x", `${(-y * 2.2).toFixed(2)}deg`);
    node.style.setProperty("--artifact-tilt-y", `${(x * 2.8).toFixed(2)}deg`);
    node.style.setProperty("--artifact-far-x", `${(-x * 3).toFixed(2)}px`);
    node.style.setProperty("--artifact-far-y", `${(-y * 2).toFixed(2)}px`);
    node.style.setProperty("--artifact-mid-x", `${(x * 3.5).toFixed(2)}px`);
    node.style.setProperty("--artifact-mid-y", `${(y * 2.6).toFixed(2)}px`);
    node.style.setProperty("--artifact-near-x", `${(x * 7).toFixed(2)}px`);
    node.style.setProperty("--artifact-near-y", `${(y * 5).toFixed(2)}px`);
    node.style.setProperty("--artifact-crest-x", `${(x * 8).toFixed(2)}px`);
    node.style.setProperty("--artifact-crest-y", `${(y * 6).toFixed(2)}px`);
    node.style.setProperty("--artifact-light-shift", `${(x * 82).toFixed(1)}px`);
    animationFrameRef.current = null;
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    pointerRef.current = {
      x: Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5)),
      y: Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5))
    };

    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => applyPointerPosition(node));
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const node = event.currentTarget;
    [
      "--artifact-tilt-x",
      "--artifact-tilt-y",
      "--artifact-far-x",
      "--artifact-far-y",
      "--artifact-mid-x",
      "--artifact-mid-y",
      "--artifact-near-x",
      "--artifact-near-y",
      "--artifact-crest-x",
      "--artifact-crest-y",
      "--artifact-light-shift"
    ].forEach((property) => node.style.setProperty(property, property.includes("tilt") ? "0deg" : "0px"));
  }

  return (
    <article
      ref={articleRef}
      className="coaching-artifact"
      data-revealed="false"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <DesktopArtifact id={`${id}-desktop`} />
      <MobileArtifact id={`${id}-mobile`} />

      <div className="coaching-artifact__crest">
        <ReplayRelic id={`${id}-relic`} />
        <span className="coaching-artifact__crest-caption">
          <small>Artifact</small>
          <b>{sequence}</b>
        </span>
      </div>

      <div className="coaching-artifact__content">
        <div className="coaching-artifact__eyebrow">
          <span aria-hidden="true" />
          <p>{eyebrow}</p>
          <em>Replay discipline</em>
        </div>

        <h3>{title}</h3>
        <p className="coaching-artifact__description">{description}</p>

        <p className="coaching-artifact__best-for">
          <span>Best for</span>
          {bestFor}
        </p>

        <ul className="coaching-artifact__benefits">
          {benefits.slice(0, 3).map((benefit, index) => (
            <li key={benefit}>
              <BenefitRune />
              <span>
                <small>0{index + 1}</small>
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        <ArtifactCta href={href} id={id} label={ctaLabel} />
      </div>
    </article>
  );
}
