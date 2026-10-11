import React from "react";
import { Img, staticFile } from "remotion";
import { SAMPLES, type PhotoId } from "../timeline";

/**
 * Studio-style illustrations used as the "uploaded photos".
 * To use real photos instead, drop JPGs in public/samples/ and render them with <Img> in <Photo>.
 */

const Backdrop: React.FC<{ id: string; from: string; to: string }> = ({ id, from, to }) => (
  <>
    <defs>
      <radialGradient id={`${id}-bg`} cx="50%" cy="38%" r="75%">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </radialGradient>
      <radialGradient id={`${id}-shadow`}>
        <stop offset="0%" stopColor="#000" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="800" height="800" fill={`url(#${id}-bg)`} />
    <rect y="560" width="800" height="240" fill="#000" opacity="0.05" />
  </>
);

const Shadow: React.FC<{ id: string; cx?: number; cy?: number; rx?: number }> = ({ id, cx = 400, cy = 640, rx = 190 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.14} fill={`url(#${id}-shadow)`} />
);

const Plastic = () => (
  <svg viewBox="0 0 800 800" width="100%" height="100%">
    <Backdrop id="pl" from="#f4f7f8" to="#cfd9dc" />
    <Shadow id="pl" rx={210} />
    <defs>
      <linearGradient id="pl-body" x1="0" x2="1">
        <stop offset="0" stopColor="#dbeaf3" />
        <stop offset="0.35" stopColor="#f6fbfd" />
        <stop offset="0.7" stopColor="#cfe1ec" />
        <stop offset="1" stopColor="#a9c3d3" />
      </linearGradient>
    </defs>
    {/* jug body */}
    <path d="M300 250 Q300 210 340 200 L460 200 Q500 210 500 250 L520 330 Q540 360 540 410 L540 600 Q540 650 490 650 L310 650 Q260 650 260 600 L260 410 Q260 360 280 330 Z" fill="url(#pl-body)" stroke="#9db6c6" strokeWidth="3" />
    {/* handle */}
    <path d="M520 290 Q610 290 610 370 Q610 450 530 450" fill="none" stroke="#b9cfdc" strokeWidth="26" strokeLinecap="round" />
    <path d="M520 290 Q610 290 610 370 Q610 450 530 450" fill="none" stroke="#eef6fa" strokeWidth="8" strokeLinecap="round" />
    {/* cap */}
    <rect x="345" y="150" width="110" height="62" rx="10" fill="#2f7fd1" />
    <rect x="345" y="150" width="110" height="18" rx="9" fill="#5ea2ea" />
    {[...Array(7)].map((_, i) => <rect key={i} x={356 + i * 14} y="172" width="4" height="34" fill="#235f9e" opacity="0.5" />)}
    {/* label */}
    <rect x="262" y="400" width="276" height="170" fill="#ffffff" />
    <rect x="262" y="400" width="276" height="44" fill="#2f7fd1" />
    <text x="400" y="432" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="26" fill="#fff">PURE MILK</text>
    <circle cx="400" cy="505" r="38" fill="#e7f1fb" />
    <path d="M385 520 Q400 480 415 520 Z" fill="#2f7fd1" />
    {/* highlights */}
    <path d="M300 260 L286 410 L286 600" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
  </svg>
);

const Cardboard = () => (
  <svg viewBox="0 0 800 800" width="100%" height="100%">
    <Backdrop id="cb" from="#f7f3ec" to="#d9cdb8" />
    <Shadow id="cb" rx={260} cy={660} />
    {/* box: front, right side, top */}
    <polygon points="170,330 520,330 520,640 170,640" fill="#c8964f" />
    <polygon points="520,330 640,270 640,580 520,640" fill="#a97a38" />
    <polygon points="170,330 290,270 640,270 520,330" fill="#dcae6a" />
    {/* tape */}
    <polygon points="318,330 372,330 492,270 438,270" fill="#e9d7a8" opacity="0.9" />
    <rect x="318" y="330" width="54" height="120" fill="#e9d7a8" opacity="0.85" />
    {/* corrugation lines */}
    {[...Array(9)].map((_, i) => <line key={i} x1="180" x2="510" y1={360 + i * 32} y2={360 + i * 32} stroke="#b5833f" strokeWidth="3" opacity="0.5" />)}
    {/* label */}
    <rect x="215" y="500" width="160" height="96" fill="#fff" opacity="0.92" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x="230" y={514 + i * 18} width={i === 0 ? 120 : 90 + (i % 2) * 30} height="7" fill="#6b6b6b" opacity="0.7" />)}
    {/* arrows */}
    <path d="M440 560 l30 -36 l30 36 M470 524 v70" fill="none" stroke="#6d4b1c" strokeWidth="6" opacity="0.7" strokeLinecap="round" />
    {/* flaps */}
    <polygon points="170,330 140,300 260,250 290,270" fill="#e3b872" />
  </svg>
);

const Glass = () => (
  <svg viewBox="0 0 800 800" width="100%" height="100%">
    <Backdrop id="gl" from="#f2f8f3" to="#c4d6c8" />
    <Shadow id="gl" rx={150} />
    <defs>
      <linearGradient id="gl-body" x1="0" x2="1">
        <stop offset="0" stopColor="#0f4d2b" />
        <stop offset="0.3" stopColor="#2e9a5c" />
        <stop offset="0.55" stopColor="#1d7a43" />
        <stop offset="1" stopColor="#0b3a20" />
      </linearGradient>
    </defs>
    <path d="M350 120 L450 120 L450 250 Q450 300 500 350 Q530 380 530 440 L530 600 Q530 650 480 650 L320 650 Q270 650 270 600 L270 440 Q270 380 300 350 Q350 300 350 250 Z" fill="url(#gl-body)" />
    {/* lip */}
    <rect x="340" y="104" width="120" height="34" rx="10" fill="#0d3d22" />
    <rect x="344" y="108" width="40" height="8" rx="4" fill="#5cc788" opacity="0.7" />
    {/* label */}
    <rect x="272" y="430" width="256" height="150" fill="#f5efe0" />
    <rect x="272" y="430" width="256" height="20" fill="#c9a24b" />
    <text x="400" y="505" textAnchor="middle" fontFamily="serif" fontSize="40" fontWeight="700" fill="#2b2b2b">VERDE</text>
    <text x="400" y="545" textAnchor="middle" fontFamily="serif" fontSize="20" fill="#555">SPARKLING WATER</text>
    {/* highlights */}
    <path d="M318 360 Q296 420 296 470 L296 610" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" opacity="0.55" />
    <path d="M372 150 L372 260" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
    <path d="M502 450 L502 600" stroke="#9be8bb" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const Metal = () => (
  <svg viewBox="0 0 800 800" width="100%" height="100%">
    <Backdrop id="mt" from="#f3f4f6" to="#c3c8cf" />
    <Shadow id="mt" rx={170} />
    <defs>
      <linearGradient id="mt-body" x1="0" x2="1">
        <stop offset="0" stopColor="#8d96a1" />
        <stop offset="0.25" stopColor="#eef1f4" />
        <stop offset="0.5" stopColor="#c0c7cf" />
        <stop offset="0.8" stopColor="#7f8893" />
        <stop offset="1" stopColor="#5d6670" />
      </linearGradient>
      <linearGradient id="mt-label" x1="0" x2="1">
        <stop offset="0" stopColor="#a31d24" />
        <stop offset="0.3" stopColor="#e23a40" />
        <stop offset="1" stopColor="#7e1218" />
      </linearGradient>
    </defs>
    <rect x="270" y="190" width="260" height="450" rx="14" fill="url(#mt-body)" />
    <ellipse cx="400" cy="190" rx="130" ry="22" fill="#d7dce1" />
    <ellipse cx="400" cy="190" rx="104" ry="15" fill="#aab2ba" />
    <ellipse cx="400" cy="186" rx="26" ry="7" fill="#868f98" />
    <ellipse cx="400" cy="640" rx="130" ry="22" fill="#6a737d" />
    {/* ridges */}
    <rect x="270" y="205" width="260" height="14" fill="#fff" opacity="0.25" />
    <rect x="270" y="610" width="260" height="14" fill="#000" opacity="0.18" />
    {/* label band */}
    <rect x="270" y="290" width="260" height="250" fill="url(#mt-label)" />
    <text x="400" y="395" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="54" fill="#fff" fontStyle="italic">COLA</text>
    <path d="M285 440 Q340 410 400 440 T515 440" fill="none" stroke="#fff" strokeWidth="8" opacity="0.9" />
    <text x="400" y="500" textAnchor="middle" fontFamily="sans-serif" fontWeight="600" fontSize="22" fill="#fff" opacity="0.9">330 ml</text>
    {/* sheen */}
    <rect x="296" y="205" width="24" height="420" fill="#fff" opacity="0.55" />
    <rect x="470" y="205" width="10" height="420" fill="#fff" opacity="0.2" />
  </svg>
);

const Paper = () => (
  <svg viewBox="0 0 800 800" width="100%" height="100%">
    <Backdrop id="pp" from="#f6f7f8" to="#d3d7dd" />
    <Shadow id="pp" rx={250} cy={650} />
    {[
      { r: -9, x: 0, y: 14, c: "#f1f2f4" },
      { r: 5, x: 22, y: 6, c: "#f7f7f8" },
      { r: -2, x: 8, y: -4, c: "#ffffff" },
    ].map((s, i) => (
      <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.r} 400 400)`}>
        <rect x="235" y="140" width="330" height="460" rx="4" fill={s.c} stroke="#cfd3d8" strokeWidth="2" />
        {i === 2 && (
          <>
            <rect x="275" y="190" width="170" height="20" fill="#2c3440" />
            {[...Array(14)].map((_, j) => <rect key={j} x="275" y={240 + j * 24} width={j % 5 === 4 ? 140 : 250} height="8" fill="#6b7480" opacity="0.65" />)}
            <rect x="275" y="500" width="120" height="70" fill="#dfe8f5" />
            <path d="M285 560 l25 -30 l20 20 l30 -40 l25 50 Z" fill="#7aa2d9" />
          </>
        )}
      </g>
    ))}
    <rect x="270" y="150" width="14" height="14" rx="7" fill="#b8bcc4" />
  </svg>
);

const Trash = () => (
  <svg viewBox="0 0 800 800" width="100%" height="100%">
    <Backdrop id="tr" from="#f1efec" to="#cbc6bf" />
    <Shadow id="tr" rx={250} cy={660} />
    <defs>
      <radialGradient id="tr-bag" cx="40%" cy="30%" r="80%">
        <stop offset="0" stopColor="#5a5f66" />
        <stop offset="1" stopColor="#1c1f23" />
      </radialGradient>
    </defs>
    {/* crumpled bag */}
    <polygon points="210,520 190,430 250,330 330,300 380,230 450,260 520,230 580,320 620,400 600,520 540,620 420,650 300,630" fill="url(#tr-bag)" />
    <polygon points="250,330 330,300 360,420 270,450" fill="#fff" opacity="0.1" />
    <polygon points="450,260 520,230 540,360 470,380" fill="#fff" opacity="0.12" />
    <polygon points="300,630 420,650 400,540 320,520" fill="#000" opacity="0.18" />
    <path d="M330 300 L380 430 L300 520 M450 260 L430 400 L540 450 M520 230 L560 350" stroke="#8d939b" strokeWidth="3" fill="none" opacity="0.6" />
    {/* tie */}
    <path d="M380 230 Q400 170 360 140 M450 260 Q480 190 520 160" stroke="#3b3f45" strokeWidth="16" strokeLinecap="round" fill="none" />
    {/* wrapper + peel */}
    <polygon points="560,560 700,520 720,600 590,640" fill="#e8483f" />
    <polygon points="600,575 690,550 698,585 610,610" fill="#ffd34d" />
    <path d="M110 600 Q160 560 230 590 Q170 600 140 640 Z" fill="#e5c85a" />
  </svg>
);

const Water = () => (
  <svg viewBox="0 0 800 800" width="100%" height="100%">
    <Backdrop id="wt" from="#f1f6fb" to="#c7d6e6" />
    <Shadow id="wt" rx={130} />
    <defs>
      <linearGradient id="wt-body" x1="0" x2="1">
        <stop offset="0" stopColor="#bfe0f5" />
        <stop offset="0.35" stopColor="#f2faff" />
        <stop offset="0.75" stopColor="#c7e4f7" />
        <stop offset="1" stopColor="#8fc1e2" />
      </linearGradient>
    </defs>
    {/* cap */}
    <rect x="365" y="70" width="70" height="48" rx="8" fill="#1d6fd1" />
    {[...Array(6)].map((_, i) => <rect key={i} x={372 + i * 11} y="84" width="3" height="28" fill="#14509a" opacity="0.5" />)}
    {/* neck */}
    <path d="M370 118 L430 118 L436 170 Q470 200 490 250 L520 330 L520 600 Q520 645 478 645 L322 645 Q280 645 280 600 L280 330 L310 250 Q330 200 364 170 Z" fill="url(#wt-body)" stroke="#8fb9d6" strokeWidth="3" />
    <rect x="360" y="150" width="80" height="10" fill="#8fb9d6" opacity="0.7" />
    {/* label */}
    <rect x="281" y="360" width="238" height="140" fill="#1d6fd1" />
    <path d="M281 440 Q340 400 400 440 T519 440 L519 500 L281 500 Z" fill="#4da0f0" />
    <text x="400" y="420" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="40" fill="#fff">AQUA</text>
    {/* water line */}
    <path d="M283 290 Q340 275 400 290 T517 290" stroke="#fff" strokeWidth="5" fill="none" opacity="0.7" />
    {/* highlights */}
    <path d="M306 270 L300 340 L300 600" stroke="#fff" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.75" />
    <path d="M498 380 L498 600" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
  </svg>
);

const MAP: Record<PhotoId, React.FC> = {
  plastic: Plastic,
  cardboard: Cardboard,
  glass: Glass,
  metal: Metal,
  paper: Paper,
  trash: Trash,
  water: Water,
  bins: Trash,
};

export const Photo: React.FC<{ id: PhotoId; style?: React.CSSProperties; fit?: "cover" | "contain" }> = ({ id, style, fit = "cover" }) => {
  const src = SAMPLES[id].src;
  if (src) {
    return <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, display: "block", ...style }} />;
  }
  const Cmp = MAP[id] ?? MAP.trash;
  return (
    <div style={{ width: "100%", height: "100%", ...style }}>
      <Cmp />
    </div>
  );
};
