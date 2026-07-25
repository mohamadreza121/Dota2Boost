const forgeRifts = [
  {
    id: "spine",
    className: "forge-fracture--spine",
    d: "M604 -120 C590 80 630 180 586 330 C540 488 622 615 566 770 C510 925 592 1052 535 1215 C480 1375 557 1510 500 1675 C445 1838 532 1978 474 2145 C418 2310 505 2455 450 2620 C395 2782 482 2935 425 3100 C368 3265 458 3415 401 3585 C345 3750 438 3905 382 4080 C328 4250 414 4410 359 4588 C306 4760 398 4925 343 5100 C290 5278 381 5452 327 5630 C273 5805 365 5980 310 6162 C255 6340 350 6518 296 6700 C243 6885 334 7055 282 7240 C230 7422 302 7520 278 7720",
    branches: [
      "M566 770 C710 845 756 980 884 1045",
      "M500 1675 C342 1745 270 1890 116 1965",
      "M450 2620 C610 2700 690 2850 846 2915",
      "M401 3585 C248 3660 205 3810 46 3895",
      "M359 4588 C526 4680 598 4830 772 4898",
      "M327 5630 C180 5705 118 5868 -32 5955",
      "M296 6700 C454 6785 535 6945 710 7010"
    ]
  },
  {
    id: "upper-left",
    className: "forge-fracture--flank forge-fracture--upper-left",
    d: "M-80 380 C110 430 175 555 130 720 C95 850 245 930 205 1085 C170 1220 338 1320 295 1490 C260 1630 414 1745 370 1915 C330 2060 455 2160 430 2350",
    branches: [
      "M130 720 C40 790 12 900 -76 955",
      "M295 1490 C178 1538 116 1630 24 1670",
      "M370 1915 C485 1970 545 2065 650 2110"
    ]
  },
  {
    id: "upper-right",
    className: "forge-fracture--flank forge-fracture--upper-right",
    d: "M1290 180 C1100 290 1038 430 1082 595 C1118 735 966 850 1012 1025 C1050 1175 895 1280 940 1450 C980 1600 820 1740 868 1910 C905 2040 770 2200 815 2380 C850 2525 730 2680 760 2880 C780 3020 700 3140 676 3320",
    branches: [
      "M1082 595 C1160 690 1198 805 1280 860",
      "M940 1450 C1058 1505 1110 1610 1218 1650",
      "M815 2380 C690 2448 632 2570 520 2630"
    ]
  },
  {
    id: "lower-left",
    className: "forge-fracture--flank forge-fracture--lower-left",
    d: "M-90 2600 C100 2660 170 2820 126 2990 C90 3140 240 3260 198 3435 C160 3590 312 3715 268 3895 C228 4060 382 4200 336 4380 C294 4548 444 4690 398 4875 C354 5050 500 5210 448 5400 C408 5552 485 5670 470 5845",
    branches: [
      "M198 3435 C80 3500 32 3625 -72 3680",
      "M336 4380 C455 4440 530 4550 646 4605",
      "M448 5400 C318 5470 260 5590 146 5650"
    ]
  },
  {
    id: "lower-right",
    className: "forge-fracture--flank forge-fracture--lower-right",
    d: "M1300 3500 C1110 3590 1040 3755 1082 3930 C1118 4085 968 4220 1015 4400 C1055 4560 900 4705 946 4888 C985 5050 828 5205 874 5390 C914 5555 760 5720 805 5905 C846 6078 690 6240 735 6435 C774 6610 628 6780 670 6970 C706 7135 604 7310 590 7600",
    branches: [
      "M1082 3930 C1172 4010 1210 4130 1292 4195",
      "M946 4888 C820 4950 758 5075 650 5135",
      "M805 5905 C925 5970 990 6085 1102 6145",
      "M670 6970 C540 7040 482 7170 370 7240"
    ]
  },
  {
    id: "river-scar",
    className: "forge-fracture--crossing",
    d: "M-120 4680 C120 4590 306 4650 470 4850 C635 5050 812 5140 1010 5075 C1115 5040 1212 4998 1320 5045",
    branches: [
      "M470 4850 C400 4960 390 5090 338 5190",
      "M1010 5075 C1060 5170 1130 5235 1235 5280"
    ]
  }
] as const;

const forgeVents = [
  { x: 565, y: 770, r: 18 },
  { x: 500, y: 1675, r: 14 },
  { x: 450, y: 2620, r: 20 },
  { x: 401, y: 3585, r: 15 },
  { x: 470, y: 4850, r: 22 },
  { x: 327, y: 5630, r: 16 },
  { x: 670, y: 6970, r: 19 }
] as const;

const forgeSigils = [
  { x: 880, y: 920, r: 82 },
  { x: 190, y: 2100, r: 64 },
  { x: 930, y: 3180, r: 72 },
  { x: 210, y: 4310, r: 74 },
  { x: 940, y: 5480, r: 68 },
  { x: 150, y: 6750, r: 76 }
] as const;

export function ForgeWorldAtmosphere() {
  return (
    <div className="forge-atmosphere forge-atmosphere--fractured" aria-hidden="true">
      <div className="forge-atmosphere__terrain" />
      <div className="forge-atmosphere__magma-haze" />
      <div className="forge-atmosphere__smoke forge-atmosphere__smoke--fractured" />
      <div className="forge-atmosphere__embers forge-atmosphere__embers--fractured" />

      <svg
        className="forge-fracture-field"
        viewBox="0 0 1200 7600"
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="forge-fracture-lava"
            x1="0"
            y1="0"
            x2="0"
            y2="7600"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#5f1209" />
            <stop offset="0.08" stopColor="#e33a12" />
            <stop offset="0.16" stopColor="#ff8a22" />
            <stop offset="0.24" stopColor="#ffd06b" />
            <stop offset="0.34" stopColor="#bf260d" />
            <stop offset="0.45" stopColor="#ff6419" />
            <stop offset="0.56" stopColor="#ffbc4f" />
            <stop offset="0.67" stopColor="#a91e0b" />
            <stop offset="0.78" stopColor="#ff761d" />
            <stop offset="0.9" stopColor="#ffc65a" />
            <stop offset="1" stopColor="#76150a" />
          </linearGradient>
          <linearGradient
            id="forge-fracture-core"
            x1="0"
            y1="0"
            x2="0"
            y2="7600"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ff5a18" />
            <stop offset="0.18" stopColor="#fff0ae" />
            <stop offset="0.36" stopColor="#ff7c1d" />
            <stop offset="0.54" stopColor="#ffd879" />
            <stop offset="0.72" stopColor="#ff5d17" />
            <stop offset="0.9" stopColor="#ffe19a" />
            <stop offset="1" stopColor="#ff6b19" />
          </linearGradient>
          <radialGradient id="forge-vent-lava">
            <stop offset="0" stopColor="#fff4bf" />
            <stop offset="0.22" stopColor="#ffc054" />
            <stop offset="0.52" stopColor="#ff5f18" />
            <stop offset="1" stopColor="#8e1809" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path className="forge-world-lane forge-world-lane--one" d="M-80 940 C300 760 595 830 1250 420" />
        <path className="forge-world-lane forge-world-lane--two" d="M-70 3810 C370 3560 735 3600 1260 3290" />
        <path className="forge-world-lane forge-world-lane--three" d="M-100 6740 C330 6440 760 6500 1290 6100" />

        {forgeSigils.map((sigil, index) => (
          <g key={`${sigil.x}-${sigil.y}`} className={`forge-world-sigil forge-world-sigil--${index + 1}`}>
            <circle cx={sigil.x} cy={sigil.y} r={sigil.r} />
            <circle cx={sigil.x} cy={sigil.y} r={sigil.r * 0.66} />
            <path d={`M${sigil.x} ${sigil.y - sigil.r * 0.9} L${sigil.x + sigil.r * 0.72} ${sigil.y} L${sigil.x} ${sigil.y + sigil.r * 0.9} L${sigil.x - sigil.r * 0.72} ${sigil.y} Z`} />
          </g>
        ))}

        {forgeRifts.map((rift) => (
          <g key={rift.id} className={`forge-fracture ${rift.className}`}>
            <path className="forge-fracture__bed" d={rift.d} />
            <path className="forge-fracture__aura" pathLength="1" d={rift.d} />
            <path className="forge-fracture__magma" pathLength="1" d={rift.d} />
            <path className="forge-fracture__core" pathLength="1" d={rift.d} />

            {rift.branches.map((branch, index) => (
              <g key={`${rift.id}-branch-${index}`} className="forge-fracture__branch">
                <path className="forge-fracture__branch-bed" d={branch} />
                <path className="forge-fracture__branch-magma" pathLength="1" d={branch} />
                <path className="forge-fracture__branch-core" pathLength="1" d={branch} />
              </g>
            ))}
          </g>
        ))}

        {forgeVents.map((vent, index) => (
          <g key={`${vent.x}-${vent.y}`} className={`forge-vent forge-vent--${index + 1}`}>
            <circle className="forge-vent__aura" cx={vent.x} cy={vent.y} r={vent.r * 3.4} />
            <circle className="forge-vent__rim" cx={vent.x} cy={vent.y} r={vent.r * 1.35} />
            <circle className="forge-vent__core" cx={vent.x} cy={vent.y} r={vent.r} />
          </g>
        ))}
      </svg>

      <div className="forge-atmosphere__vignette" />
    </div>
  );
}
