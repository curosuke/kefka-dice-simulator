const canvas = document.getElementById("arena");
const ctx = canvas.getContext("2d");

const UI = {
  heroEyebrow: document.getElementById("heroEyebrow"),
  heroTitle: document.getElementById("heroTitle"),
  hintMoveKeys: document.getElementById("hintMoveKeys"),
  hintMoveClick: document.getElementById("hintMoveClick"),
  hintFacingLock: document.getElementById("hintFacingLock"),
  hintPanelLabel: document.getElementById("hintPanelLabel"),
  timeLabel: document.getElementById("timeLabel"),
  positionLabel: document.getElementById("positionLabel"),
  facingLabel: document.getElementById("facingLabel"),
  debuffLabel: document.getElementById("debuffLabel"),
  targetLabel: document.getElementById("targetLabel"),
  timelinePanelLabel: document.getElementById("timelinePanelLabel"),
  time: document.getElementById("timeDisplay"),
  position: document.getElementById("positionDisplay"),
  facing: document.getElementById("facingDisplay"),
  debuff: document.getElementById("debuffDisplay"),
  target: document.getElementById("targetDisplay"),
  playerInfoCard: document.getElementById("playerInfoCard"),
  timelineList: document.getElementById("timelineList"),
  timelineItems: Array.from(document.querySelectorAll("#timelineList li")),
  notesPanelLabel: document.getElementById("notesPanelLabel"),
  notesList: document.getElementById("notesList"),
  introModal: document.getElementById("introModal"),
  modalEyebrow: document.getElementById("modalEyebrow"),
  modalTitle: document.getElementById("modalTitle"),
  modalCopy: document.getElementById("modalCopy"),
  modalControlHint: document.getElementById("modalControlHint"),
  languageLabel: document.getElementById("languageLabel"),
  localeRadios: Array.from(document.querySelectorAll('input[name="locale"]')),
  modalGuideToggle: document.getElementById("modalGuideToggle"),
  guideToggleLabel: document.getElementById("guideToggleLabel"),
  startButton: document.getElementById("startButton"),
  guideToggle: document.getElementById("guideToggleButton"),
  resultOverlay: document.getElementById("resultOverlay"),
  resultKicker: document.getElementById("resultKicker"),
  resultTitle: document.getElementById("resultTitle"),
  resultReason: document.getElementById("resultReason"),
  closeResult: document.getElementById("closeResultButton"),
  reset: document.getElementById("resetButton"),
  retry: document.getElementById("retryButton"),
};

const SHOW_RESULT_MODAL = true;
const DEBUG_SUPPRESS_RESULT_MODAL = false;
const LOCALE_STORAGE_KEY = "kefca-p3-simulator-locale";

const TRANSLATIONS = {
  ja: {
    documentTitle: "絶妖精乱舞 P3 アルテマブラスター",
    heroEyebrow: "KEFCA P3 SIMULATOR",
    heroTitle: "絶妖精乱舞 P3 シミュレータ",
    arenaAriaLabel: "アルテマブラスター戦闘フィールド",
    hintMoveKeys: "WASD / 矢印で移動",
    hintMoveClick: "クリックで移動先指定",
    hintFacingLock: "向きは最後に移動した方向で固定",
    hintPanelLabel: "HINT",
    timeLabel: "時間",
    positionLabel: "位置",
    facingLabel: "向き",
    debuffLabel: "混沌の風",
    targetLabel: "移動先",
    timelinePanelLabel: "TIMELINE",
    notesPanelLabel: "Notes",
    timeline: [
      "開始待ち",
      "真空波詠唱",
      "真空波ノックバック",
      "サイコロ予兆付与",
      "頭割り処理",
      "サイコロ散会",
      "アルテマブラスター発動",
    ],
    notes: [
      "真空波はエクスデス基準で背面受けなら OK",
      "向きを誤るとノックバック距離が伸びて NG",
      "並走するケフカの外周観察で開始位置と回転方向を覚える",
    ],
    modalEyebrow: "KEFCA P3 SIMULATOR",
    modalTitle: "絶妖精乱舞 P3 シミュレータ",
    modalCopy:
      "Phase3の真空波詠唱～アルテマブラスターのサイコロ散会までをイメトレするためのシミュレータです。\nタンクLB法を前提として、エクスデスの出現位置に応じて正しい向きで混沌の風を受けて、ノックバック後に頭割りに参加し、サイコロマーカーの付与に応じた散会位置に移動してください。",
    modalControlHint: "WASDもしくはクリックで自キャラを移動できます。",
    languageLabel: "言語",
    guideToggleLabel: "ガイドを表示する",
    startButton: "開始",
    retryButton: "リトライ",
    resetButton: "リセット",
    guideOn: "ガイドON",
    guideOff: "ガイドOFF",
    receiveFront: "正面で受ける",
    receiveBack: "背面で受ける",
    moveTo: (pair) => `${pair} へ移動`,
    vacuumWave: "真空波",
    stack: "頭割り",
    clockwise: "時計回り",
    counterclockwise: "反時計回り",
    successSummary: (start, end, rotation, scatter, dice, pair) =>
      `アルテマブラスター：${start} -> ${end} / ${rotation}（サイコロ${scatter}）\nサイコロ番号：${dice} ( ${pair} )`,
    vacuumFailureFront: "真空波は失敗。混沌の風は正面で受ける必要がありました。",
    vacuumFailureBack: "真空波は失敗。混沌の風は背面で受ける必要がありました。",
    stackFailure: "頭割り発生時に他プレイヤーと重なっておらず、範囲外でした。",
    finalBurstFailurePrefix: "最終8本で巻き込みが発生しました。",
    diceLabel: (value, isYou) => (isYou ? `サイコロ${value}(YOU)` : `サイコロ${value}`),
    closeResultAria: "閉じる",
  },
  en: {
    documentTitle: "Futures Rewritten P3 Ultima Blaster",
    heroEyebrow: "KEFCA P3 SIMULATOR",
    heroTitle: "Futures Rewritten P3 Simulator",
    arenaAriaLabel: "Ultima Blaster training arena",
    hintMoveKeys: "Move with WASD / arrow keys",
    hintMoveClick: "Click to set a movement target",
    hintFacingLock: "Facing follows your last movement direction",
    hintPanelLabel: "HINT",
    timeLabel: "Time",
    positionLabel: "Position",
    facingLabel: "Facing",
    debuffLabel: "Chaos Wind",
    targetLabel: "Target",
    timelinePanelLabel: "TIMELINE",
    notesPanelLabel: "Notes",
    timeline: [
      "Awaiting Start",
      "Vacuum Wave Cast",
      "Vacuum Wave Knockback",
      "Dice Marker Applied",
      "Stack Resolution",
      "Dice Spread",
      "Ultima Blaster",
    ],
    notes: [
      "Vacuum Wave is safe if you resolve it correctly relative to Exdeath.",
      "Incorrect facing causes excessive knockback and failure.",
      "Watch Kefka's outer pattern to identify the starting point and rotation.",
    ],
    modalEyebrow: "KEFCA P3 SIMULATOR",
    modalTitle: "Futures Rewritten P3 Simulator",
    modalCopy:
      "A simulator for practicing the sequence from Vacuum Wave through the Ultima Blaster dice spread in Phase 3.\nBuilt around the tank LB strategy: resolve Chaos Wind with the correct facing based on Exdeath's spawn, join the stack after knockback, and move to the proper spread position for your dice marker.",
    modalControlHint: "Move your character with WASD or click-to-move.",
    languageLabel: "Language",
    guideToggleLabel: "Show guides",
    startButton: "Start",
    retryButton: "Retry",
    resetButton: "Reset",
    guideOn: "Guide ON",
    guideOff: "Guide OFF",
    receiveFront: "Face front",
    receiveBack: "Face back",
    moveTo: (pair) => `Move to ${pair}`,
    vacuumWave: "Vacuum Wave",
    stack: "Stack",
    clockwise: "Clockwise",
    counterclockwise: "Counterclockwise",
    successSummary: (start, end, rotation, scatter, dice, pair) =>
      `Ultima Blaster: ${start} -> ${end} / ${rotation} (dice ${scatter})\nDice number: ${dice} ( ${pair} )`,
    vacuumFailureFront: "Vacuum Wave failed. Chaos Wind required a front-facing resolve.",
    vacuumFailureBack: "Vacuum Wave failed. Chaos Wind required a back-facing resolve.",
    stackFailure: "Stack failed. You were not overlapping the party when the stack resolved.",
    finalBurstFailurePrefix: "The final eight Ultima Blasters clipped other players.",
    diceLabel: (value, isYou) => (isYou ? `Dice ${value} (YOU)` : `Dice ${value}`),
    closeResultAria: "Close",
  },
  zh: {
    documentTitle: "Futures Rewritten P3 究极爆裂",
    heroEyebrow: "KEFCA P3 SIMULATOR",
    heroTitle: "Futures Rewritten P3 模拟器",
    arenaAriaLabel: "究极爆裂训练场",
    hintMoveKeys: "WASD / 方向键移动",
    hintMoveClick: "点击指定移动位置",
    hintFacingLock: "朝向固定为最后一次移动的方向",
    hintPanelLabel: "HINT",
    timeLabel: "时间",
    positionLabel: "位置",
    facingLabel: "朝向",
    debuffLabel: "混沌之风",
    targetLabel: "移动目标",
    timelinePanelLabel: "TIMELINE",
    notesPanelLabel: "NOTES",
    timeline: [
      "等待开始",
      "真空波咏唱",
      "真空波击退",
      "骰子标记附加",
      "分摊处理",
      "骰子散开",
      "究极爆裂发动",
    ],
    notes: [
      "只要按艾克斯迪司为基准正确处理真空波即可通过。",
      "朝向错误会导致击退距离过长并判定失败。",
      "同时观察凯夫卡在外周的突进，记住起点与旋转方向。",
    ],
    modalEyebrow: "KEFCA P3 SIMULATOR",
    modalTitle: "Futures Rewritten P3 模拟器",
    modalCopy:
      "用于练习 Phase 3 从真空波咏唱到究极爆裂骰子散开的模拟器。\n以前排坦克 LB 处理为前提，请根据艾克斯迪司的出现位置，以正确朝向处理混沌之风，在击退后参加分摊，并根据骰子标记移动到对应散开位置。",
    modalControlHint: "可使用 WASD 或点击移动角色。",
    languageLabel: "语言",
    guideToggleLabel: "显示指引",
    startButton: "开始",
    retryButton: "重试",
    resetButton: "重置",
    guideOn: "指引ON",
    guideOff: "指引OFF",
    receiveFront: "正面承伤",
    receiveBack: "背面承伤",
    moveTo: (pair) => `移动到 ${pair}`,
    vacuumWave: "真空波",
    stack: "分摊",
    clockwise: "顺时针",
    counterclockwise: "逆时针",
    successSummary: (start, end, rotation, scatter, dice, pair) =>
      `究极爆裂：${start} -> ${end} / ${rotation}（骰子${scatter}）\n骰子编号：${dice} ( ${pair} )`,
    vacuumFailureFront: "真空波处理失败。混沌之风需要以正面承伤。",
    vacuumFailureBack: "真空波处理失败。混沌之风需要以背面承伤。",
    stackFailure: "分摊失败。分摊结算时你没有和队友重叠。",
    finalBurstFailurePrefix: "最后八道究极爆裂发生了卷入。",
    diceLabel: (value, isYou) => (isYou ? `骰子${value}(YOU)` : `骰子${value}`),
    closeResultAria: "关闭",
  },
  ko: {
    documentTitle: "Futures Rewritten P3 알테마 블래스터",
    heroEyebrow: "KEFCA P3 SIMULATOR",
    heroTitle: "Futures Rewritten P3 시뮬레이터",
    arenaAriaLabel: "알테마 블래스터 연습 필드",
    hintMoveKeys: "WASD / 방향키로 이동",
    hintMoveClick: "클릭으로 이동 위치 지정",
    hintFacingLock: "방향은 마지막으로 이동한 쪽으로 고정",
    hintPanelLabel: "HINT",
    timeLabel: "시간",
    positionLabel: "위치",
    facingLabel: "방향",
    debuffLabel: "혼돈의 바람",
    targetLabel: "이동 위치",
    timelinePanelLabel: "TIMELINE",
    notesPanelLabel: "NOTES",
    timeline: [
      "시작 대기",
      "진공파 시전",
      "진공파 넉백",
      "주사위 징 부여",
      "쉐어 처리",
      "주사위 산개",
      "알테마 블래스터 발동",
    ],
    notes: [
      "엑스데스를 기준으로 진공파를 올바르게 처리하면 통과입니다.",
      "방향을 틀리면 넉백 거리가 길어져 실패합니다.",
      "동시에 케프카의 외곽 돌진을 보고 시작 위치와 회전 방향을 익힙니다.",
    ],
    modalEyebrow: "KEFCA P3 SIMULATOR",
    modalTitle: "Futures Rewritten P3 시뮬레이터",
    modalCopy:
      "Phase 3의 진공파 시전부터 알테마 블래스터 주사위 산개까지 이미지 트레이닝하기 위한 시뮬레이터입니다.\n탱커 LB 공략을 전제로, 엑스데스의 출현 위치에 맞춰 올바른 방향으로 혼돈의 바람을 처리하고, 넉백 후 쉐어에 합류한 뒤, 주사위 징에 맞는 산개 위치로 이동해 주세요.",
    modalControlHint: "WASD 또는 클릭 이동으로 캐릭터를 조작할 수 있습니다.",
    languageLabel: "언어",
    guideToggleLabel: "가이드 표시",
    startButton: "시작",
    retryButton: "다시 하기",
    resetButton: "리셋",
    guideOn: "가이드 ON",
    guideOff: "가이드 OFF",
    receiveFront: "정면으로 받기",
    receiveBack: "뒤를 보고 받기",
    moveTo: (pair) => `${pair} 위치로 이동`,
    vacuumWave: "진공파",
    stack: "쉐어",
    clockwise: "시계",
    counterclockwise: "반시계",
    successSummary: (start, end, rotation, scatter, dice, pair) =>
      `알테마 블래스터: ${start} -> ${end} / ${rotation} (주사위 ${scatter})\n주사위 번호: ${dice} ( ${pair} )`,
    vacuumFailureFront: "진공파 처리 실패. 혼돈의 바람은 정면으로 받아야 했습니다.",
    vacuumFailureBack: "진공파 처리 실패. 혼돈의 바람은 뒤를 보고 받아야 했습니다.",
    stackFailure: "쉐어 실패. 쉐어 판정 시 다른 플레이어와 겹쳐 있지 않았습니다.",
    finalBurstFailurePrefix: "마지막 8개의 알테마 블래스터에서 겹침이 발생했습니다.",
    diceLabel: (value, isYou) => (isYou ? `주사위${value}(YOU)` : `주사위${value}`),
    closeResultAria: "닫기",
  },
};

const ARENA = {
  centerX: canvas.width / 2,
  centerY: canvas.height / 2,
  radius: 384,
  markerRadius: 306,
  numberRadius: 268,
  observationRadius: 356,
  finalPositionRadius: 334,
};

const PLAYER = {
  radius: 18,
  moveSpeed: 210,
  clickStopDistance: 8,
};

const PARTY_IDS = ["YOU", "MT", "ST", "H1", "H2", "D1", "D2", "D3"];

const MARKER_STYLE = {
  A: { stroke: "#ff6b76", fill: "rgba(255, 107, 118, 0.16)", glow: "rgba(255, 107, 118, 0.30)" },
  B: { stroke: "#ffe45f", fill: "rgba(255, 228, 95, 0.16)", glow: "rgba(255, 228, 95, 0.30)" },
  C: { stroke: "#74c8ff", fill: "rgba(116, 200, 255, 0.16)", glow: "rgba(116, 200, 255, 0.30)" },
  D: { stroke: "#ca7bff", fill: "rgba(202, 123, 255, 0.16)", glow: "rgba(202, 123, 255, 0.30)" },
};

const FIELD_MARKERS = [
  { label: "A", angle: -Math.PI / 2 },
  { label: "B", angle: 0 },
  { label: "C", angle: Math.PI / 2 },
  { label: "D", angle: Math.PI },
];

const NUMBER_MARKERS = [
  { label: "1", angle: (-3 * Math.PI) / 4 },
  { label: "2", angle: -Math.PI / 4 },
  { label: "3", angle: Math.PI / 4 },
  { label: "4", angle: (3 * Math.PI) / 4 },
];

const START_LABELS_BY_INDEX = ["A", "2", "B", "3", "C", "4", "D", "1"];

const PAIR_POSITIONS = {
  "1A": (-5 * Math.PI) / 8,
  "A2": (-3 * Math.PI) / 8,
  "2B": -Math.PI / 8,
  "B3": Math.PI / 8,
  "3C": (3 * Math.PI) / 8,
  "C4": (5 * Math.PI) / 8,
  "4D": (7 * Math.PI) / 8,
  "D1": (-7 * Math.PI) / 8,
};

const FINAL_POSITION_TABLE = {
  clockwise: {
    "1": ["B3", "2B", "A2", "1A", "D1", "4D", "C4", "3C"],
    "A": ["3C", "B3", "2B", "A2", "1A", "D1", "4D", "C4"],
    "2": ["C4", "3C", "B3", "2B", "A2", "1A", "D1", "4D"],
    "B": ["4D", "C4", "3C", "B3", "2B", "A2", "1A", "D1"],
    "3": ["D1", "4D", "C4", "3C", "B3", "2B", "A2", "1A"],
    "C": ["1A", "D1", "4D", "C4", "3C", "B3", "2B", "A2"],
    "4": ["A2", "1A", "D1", "4D", "C4", "3C", "B3", "2B"],
    "D": ["2B", "A2", "1A", "D1", "4D", "C4", "3C", "B3"],
  },
  counterclockwise: {
    "1": ["3C", "C4", "4D", "D1", "1A", "A2", "2B", "B3"],
    "A": ["C4", "4D", "D1", "1A", "A2", "2B", "B3", "3C"],
    "2": ["4D", "D1", "1A", "A2", "2B", "B3", "3C", "C4"],
    "B": ["D1", "1A", "A2", "2B", "B3", "3C", "C4", "4D"],
    "3": ["1A", "A2", "2B", "B3", "3C", "C4", "4D", "D1"],
    "C": ["A2", "2B", "B3", "3C", "C4", "4D", "D1", "1A"],
    "4": ["2B", "B3", "3C", "C4", "4D", "D1", "1A", "A2"],
    "D": ["B3", "3C", "C4", "4D", "D1", "1A", "A2", "2B"],
  },
};

const EXDEATH_SPAWNS = [
  { label: "A-B", angle: -Math.PI / 4 },
  { label: "B-C", angle: Math.PI / 4 },
  { label: "C-D", angle: (3 * Math.PI) / 4 },
  { label: "D-A", angle: (-3 * Math.PI) / 4 },
];

const CHAOS_WIND_TYPES = {
  front: {
    key: "front",
    label: "正面で受ける",
    asset: "assets/wind-front.png",
    faceMode: "toward",
  },
  back: {
    key: "back",
    label: "背面で受ける",
    asset: "assets/wind-back.png",
    faceMode: "away",
  },
};

const TIMINGS = {
  castStart: 0.8,
  vacuumVisibleStart: 8.0,
  vacuumResolveAt: 8.8,
  observationStart: 0.8,
  observationInterval: 1.1,
  observationCount: 8,
  diceAt: 10.8,
  preVacuumGatherStartAt: 8.1,
  stackGatherStartAt: 11.8,
  npcRelocateStartAt: 17.4,
  finalBlastAt: 19.4,
  finishAt: 21.0,
};

const FINAL_BURST_SOURCE_ORDER = [1, 8, 7, 6, 5, 4, 3, 2];

const VACUUM_WAVE = {
  safeKnockback: 96,
  failKnockback: 228,
  facingTolerance: Math.PI / 3,
  animationDuration: 0.36,
};

const LINE_VISUAL = {
  width: 60,
  glowWidth: 108,
  travelDuration: 0.56,
  lingerDuration: 0.38,
};

const FINAL_BURST = {
  duration: 1.5,
};

const INITIAL_POSITIONS = [
  { x: ARENA.centerX - 60, y: ARENA.centerY + 210 },
  { x: ARENA.centerX - 140, y: ARENA.centerY + 170 },
  { x: ARENA.centerX - 20, y: ARENA.centerY + 150 },
  { x: ARENA.centerX + 80, y: ARENA.centerY + 190 },
  { x: ARENA.centerX + 145, y: ARENA.centerY + 120 },
  { x: ARENA.centerX - 180, y: ARENA.centerY + 80 },
  { x: ARENA.centerX + 20, y: ARENA.centerY + 240 },
  { x: ARENA.centerX + 180, y: ARENA.centerY + 210 },
];

const keys = new Set();

const state = {
  running: false,
  finished: false,
  time: 0,
  lastFrame: 0,
  moveTarget: null,
  player: null,
  party: [],
  resolvedVacuumWave: false,
  pattern: null,
  exdeath: null,
  vacuumOk: null,
  finalBurstResolved: false,
  chaosWind: null,
  finalBurstFailures: [],
  stackFailure: false,
  stackResolved: false,
  stackResolvedAt: null,
  knockbackAnimation: null,
  pendingFailureReason: null,
  locale: "ja",
  showGuides: true,
};

const chaosImage = new Image();
chaosImage.src = "assets/chaos.png";

const windImages = {
  front: new Image(),
  back: new Image(),
};
windImages.front.src = CHAOS_WIND_TYPES.front.asset;
windImages.back.src = CHAOS_WIND_TYPES.back.asset;

function currentTranslations() {
  return TRANSLATIONS[state.locale] || TRANSLATIONS.ja;
}

function rotationToken(rotationKey) {
  return rotationKey === "clockwise" ? currentTranslations().clockwise : currentTranslations().counterclockwise;
}

function applyLocale() {
  const t = currentTranslations();
  document.documentElement.lang = state.locale;
  document.title = t.documentTitle;
  canvas.setAttribute("aria-label", t.arenaAriaLabel);
  UI.heroEyebrow.textContent = t.heroEyebrow;
  UI.heroTitle.textContent = t.heroTitle;
  UI.hintMoveKeys.textContent = t.hintMoveKeys;
  UI.hintMoveClick.textContent = t.hintMoveClick;
  UI.hintFacingLock.textContent = t.hintFacingLock;
  UI.hintPanelLabel.textContent = t.hintPanelLabel;
  UI.timeLabel.textContent = t.timeLabel;
  UI.positionLabel.textContent = t.positionLabel;
  UI.facingLabel.textContent = t.facingLabel;
  UI.debuffLabel.textContent = t.debuffLabel;
  UI.targetLabel.textContent = t.targetLabel;
  UI.timelinePanelLabel.textContent = t.timelinePanelLabel;
  UI.notesPanelLabel.textContent = t.notesPanelLabel;
  UI.timelineItems.forEach((item, index) => {
    item.textContent = t.timeline[index];
  });
  Array.from(UI.notesList.querySelectorAll("li")).forEach((item, index) => {
    item.textContent = t.notes[index];
  });
  UI.modalEyebrow.textContent = t.modalEyebrow;
  UI.modalTitle.textContent = t.modalTitle;
  UI.modalCopy.textContent = t.modalCopy;
  UI.modalControlHint.textContent = t.modalControlHint;
  UI.languageLabel.textContent = t.languageLabel;
  UI.guideToggleLabel.textContent = t.guideToggleLabel;
  UI.startButton.textContent = t.startButton;
  UI.retry.textContent = t.retryButton;
  UI.closeResult.setAttribute("aria-label", t.closeResultAria);
  UI.localeRadios.forEach((radio) => {
    radio.checked = radio.value === state.locale;
  });
}

function canvasResponsiveScale() {
  const width = canvas.clientWidth || canvas.width;
  if (width <= 360) return 1.6;
  if (width <= 420) return 1.42;
  if (width <= 520) return 1.24;
  return 1;
}

function loadSavedLocale() {
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && TRANSLATIONS[saved]) {
      state.locale = saved;
    }
  } catch {
    // Ignore storage errors and fall back to Japanese.
  }
}

function saveLocale(locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage errors.
  }
}

function pointOnCircle(radius, angle) {
  return {
    x: ARENA.centerX + Math.cos(angle) * radius,
    y: ARENA.centerY + Math.sin(angle) * radius,
  };
}

function exdeathPoint(angle) {
  return pointOnCircle(235, angle);
}

function createExdeathSpawn() {
  const choice = EXDEATH_SPAWNS[Math.floor(Math.random() * EXDEATH_SPAWNS.length)];
  const point = exdeathPoint(choice.angle);
  return {
    label: choice.label,
    x: point.x,
    y: point.y,
    radius: 34,
  };
}

function createPlayer() {
  const start = INITIAL_POSITIONS[0];
  return {
    id: "YOU",
    x: start.x,
    y: start.y,
    facing: -Math.PI / 2,
    debuff: "混沌の風",
    diceValue: 1,
    color: "#6bd4ff",
  };
}

function createObservationPattern() {
  return {
    startIndex: Math.floor(Math.random() * 8),
    direction: Math.random() < 0.5 ? 1 : -1,
  };
}

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const swap = Math.floor(Math.random() * (i + 1));
    [result[i], result[swap]] = [result[swap], result[i]];
  }
  return result;
}

function randomChaosWind() {
  return Math.random() < 0.5 ? CHAOS_WIND_TYPES.front : CHAOS_WIND_TYPES.back;
}

function observationPoint(index) {
  const angle = -Math.PI / 2 + (Math.PI / 4) * index;
  return pointOnCircle(ARENA.observationRadius, angle);
}

function oppositeObservationPoint(index) {
  return observationPoint((index + 4) % 8);
}

function observationLineAt(step) {
  const pointIndex = (state.pattern.startIndex + step * state.pattern.direction + 800) % 8;
  return {
    pointIndex,
    source: observationPoint(pointIndex),
    target: oppositeObservationPoint(pointIndex),
  };
}

function currentStartLabel() {
  return START_LABELS_BY_INDEX[state.pattern.startIndex];
}

function currentEndLabel() {
  return START_LABELS_BY_INDEX[(state.pattern.startIndex + 4) % 8];
}

function currentRotationKey() {
  return state.pattern.direction === 1 ? "clockwise" : "counterclockwise";
}

function oppositeRotationKey(rotationKey) {
  return rotationKey === "clockwise" ? "counterclockwise" : "clockwise";
}

function successResultSummary() {
  const startLabel = currentStartLabel();
  const endLabel = currentEndLabel();
  const rotationKey = currentRotationKey();
  const scatterRotation = oppositeRotationKey(rotationKey);
  const t = currentTranslations();

  return t.successSummary(
    startLabel,
    endLabel,
    rotationToken(rotationKey),
    rotationToken(scatterRotation),
    state.player.diceValue,
    state.player.finalPairLabel
  );
}

function finalPairLabelForDice(diceValue) {
  const startLabel = currentStartLabel();
  const rotationKey = currentRotationKey();
  return FINAL_POSITION_TABLE[rotationKey][startLabel][diceValue - 1];
}

function finalPositionForDice(diceValue) {
  const pairLabel = finalPairLabelForDice(diceValue);
  return pointOnCircle(ARENA.finalPositionRadius, PAIR_POSITIONS[pairLabel]);
}

function createParty(player) {
  const diceOrder = shuffled([1, 2, 3, 4, 5, 6, 7, 8]);
  const controlledDice = diceOrder[0];
  player.diceValue = controlledDice;

  const party = [player];
  for (let i = 1; i < PARTY_IDS.length; i += 1) {
    const start = INITIAL_POSITIONS[i];
    const diceValue = diceOrder[i];
    const finalPosition = finalPositionForDice(diceValue);
    party.push({
      id: PARTY_IDS[i],
      x: start.x,
      y: start.y,
      facing: -Math.PI / 2,
      diceValue,
      color: "#cfd7e8",
      finalPosition,
      finalPairLabel: finalPairLabelForDice(diceValue),
    });
  }
  player.finalPosition = finalPositionForDice(controlledDice);
  player.finalPairLabel = finalPairLabelForDice(controlledDice);
  return party;
}

function resetSimulation() {
  const t = currentTranslations();
  state.running = false;
  state.finished = false;
  state.time = 0;
  state.lastFrame = 0;
  state.moveTarget = null;
  state.player = createPlayer();
  state.resolvedVacuumWave = false;
  state.pattern = createObservationPattern();
  state.exdeath = createExdeathSpawn();
  state.vacuumOk = null;
  state.finalBurstResolved = false;
  state.chaosWind = randomChaosWind();
  state.finalBurstFailures = [];
  state.stackFailure = false;
  state.stackResolved = false;
  state.stackResolvedAt = null;
  state.knockbackAnimation = null;
  state.pendingFailureReason = null;
  state.party = createParty(state.player);
  UI.guideToggle.textContent = state.showGuides ? t.guideOff : t.guideOn;
  UI.reset.textContent = t.resetButton;
  if (UI.modalGuideToggle) {
    UI.modalGuideToggle.checked = state.showGuides;
  }
  UI.resultOverlay.classList.add("hidden");
  UI.resultReason.style.display = "none";
  syncHud();
  draw();
}

function startSimulation() {
  if (UI.modalGuideToggle) {
    state.showGuides = UI.modalGuideToggle.checked;
  }
  resetSimulation();
  state.running = true;
  UI.introModal.classList.add("hidden");
}

function restartSimulation() {
  startSimulation();
}

function currentTimelineIndex() {
  const checkpoints = [
    0,
    TIMINGS.castStart,
    TIMINGS.vacuumResolveAt,
    TIMINGS.diceAt,
    state.stackResolvedAt ?? Number.POSITIVE_INFINITY,
    TIMINGS.npcRelocateStartAt,
    TIMINGS.finalBlastAt,
  ];
  let index = 0;
  for (let i = 0; i < checkpoints.length; i += 1) {
    if (state.time >= checkpoints[i]) index = i;
  }
  return index;
}

function normalizeDegrees(radian) {
  const degrees = (radian * 180) / Math.PI;
  return (degrees + 360) % 360;
}

function angleDifference(a, b) {
  let diff = a - b;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return Math.abs(diff);
}

function clampToArena(x, y) {
  const dx = x - ARENA.centerX;
  const dy = y - ARENA.centerY;
  const distance = Math.hypot(dx, dy);
  const maxDistance = ARENA.radius - PLAYER.radius - 8;
  if (distance <= maxDistance || distance === 0) return { x, y };
  const scale = maxDistance / distance;
  return {
    x: ARENA.centerX + dx * scale,
    y: ARENA.centerY + dy * scale,
  };
}

function updateFacing(dx, dy) {
  if (dx === 0 && dy === 0) return;
  state.player.facing = Math.atan2(dy, dx);
}

function handleKeyboardMovement(dt) {
  let dx = 0;
  let dy = 0;
  if (keys.has("w") || keys.has("arrowup")) dy -= 1;
  if (keys.has("s") || keys.has("arrowdown")) dy += 1;
  if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
  if (keys.has("d") || keys.has("arrowright")) dx += 1;
  if (dx === 0 && dy === 0) return false;

  const length = Math.hypot(dx, dy);
  const nextX = state.player.x + (dx / length) * PLAYER.moveSpeed * dt;
  const nextY = state.player.y + (dy / length) * PLAYER.moveSpeed * dt;
  const clamped = clampToArena(nextX, nextY);
  updateFacing(clamped.x - state.player.x, clamped.y - state.player.y);
  state.player.x = clamped.x;
  state.player.y = clamped.y;
  state.moveTarget = null;
  return true;
}

function handleClickMovement(dt) {
  if (!state.moveTarget) return;
  const dx = state.moveTarget.x - state.player.x;
  const dy = state.moveTarget.y - state.player.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= PLAYER.clickStopDistance) {
    state.player.x = state.moveTarget.x;
    state.player.y = state.moveTarget.y;
    state.moveTarget = null;
    return;
  }

  const step = Math.min(distance, PLAYER.moveSpeed * dt);
  const nextX = state.player.x + (dx / distance) * step;
  const nextY = state.player.y + (dy / distance) * step;
  const clamped = clampToArena(nextX, nextY);
  updateFacing(clamped.x - state.player.x, clamped.y - state.player.y);
  state.player.x = clamped.x;
  state.player.y = clamped.y;
}

function syncHud() {
  const t = currentTranslations();
  UI.time.textContent = state.showGuides ? `${state.time.toFixed(1)}s` : "—";
  UI.position.textContent = state.showGuides ? `X ${state.player.x.toFixed(1)} / Y ${state.player.y.toFixed(1)}` : "—";
  UI.facing.textContent = state.showGuides ? `${normalizeDegrees(state.player.facing).toFixed(0)}°` : "—";
  if (state.showGuides) {
    UI.debuff.textContent = state.chaosWind?.faceMode === "toward" ? t.receiveFront : t.receiveBack;
    UI.target.textContent = t.moveTo(state.player.finalPairLabel);
  } else {
    UI.debuff.textContent = "—";
    UI.target.textContent = "—";
  }
  UI.playerInfoCard.style.display = state.showGuides ? "grid" : "none";
  UI.timelineList.style.display = state.showGuides ? "grid" : "none";
  UI.notesList.style.display = state.showGuides ? "block" : "none";
  const activeIndex = state.finished ? UI.timelineItems.length - 1 : currentTimelineIndex();
  UI.timelineItems.forEach((item, index) => {
    item.classList.toggle("is-active", state.showGuides && index === activeIndex);
  });
}

function activeObservationLines() {
  const lines = [];
  if (state.time < TIMINGS.observationStart) return lines;

  const elapsed = state.time - TIMINGS.observationStart;
  const latestIndex = Math.min(
    TIMINGS.observationCount - 1,
    Math.floor(elapsed / TIMINGS.observationInterval)
  );

  for (let step = 0; step <= latestIndex; step += 1) {
    const startAt = TIMINGS.observationStart + step * TIMINGS.observationInterval;
    const age = state.time - startAt;
    const maxAge = LINE_VISUAL.travelDuration + LINE_VISUAL.lingerDuration;
    if (age < 0 || age > maxAge) continue;
    lines.push({
      ...observationLineAt(step),
      step,
      age,
    });
  }
  return lines;
}

function updateParty(dt) {
  if (state.knockbackAnimation) return;
  for (const member of state.party) {
    if (member.id === "YOU") continue;
    const target = npcTargetPosition(member);
    const dx = target.x - member.x;
    const dy = target.y - member.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) {
      member.x = target.x;
      member.y = target.y;
      continue;
    }
    const step = Math.min(distance, 200 * dt);
    member.x += (dx / distance) * step;
    member.y += (dy / distance) * step;
    member.facing = Math.atan2(dy, dx);
  }
}

function stackGatherPoint(index, total) {
  const awayAngle = Math.atan2(ARENA.centerY - state.exdeath.y, ARENA.centerX - state.exdeath.x);
  const base = {
    x: state.exdeath.x + Math.cos(awayAngle) * 94,
    y: state.exdeath.y + Math.sin(awayAngle) * 94,
  };
  const perpendicular = awayAngle + Math.PI / 2;
  const offset = (index - (total - 1) / 2) * 18;
  return clampToArena(
    base.x + Math.cos(perpendicular) * offset,
    base.y + Math.sin(perpendicular) * offset
  );
}

function npcTargetPosition(member) {
  if (state.time >= TIMINGS.preVacuumGatherStartAt && state.time < TIMINGS.npcRelocateStartAt) {
    const npcs = state.party.filter((item) => item.id !== "YOU");
    const index = npcs.findIndex((item) => item.id === member.id);
    return stackGatherPoint(index, npcs.length);
  }
  if (state.time >= TIMINGS.npcRelocateStartAt) {
    return member.finalPosition;
  }
  return { x: member.x, y: member.y };
}

function drawArenaBase() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createRadialGradient(
    ARENA.centerX,
    ARENA.centerY,
    50,
    ARENA.centerX,
    ARENA.centerY,
    ARENA.radius
  );
  gradient.addColorStop(0, "#1d2431");
  gradient.addColorStop(1, "#0d1118");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(ARENA.centerX, ARENA.centerY, ARENA.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let ring = 1; ring <= 4; ring += 1) {
    ctx.beginPath();
    ctx.arc(ARENA.centerX, ARENA.centerY, ring * 72, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 16; i += 1) {
    const angle = (Math.PI * 2 * i) / 16;
    const x = ARENA.centerX + Math.cos(angle) * ARENA.radius;
    const y = ARENA.centerY + Math.sin(angle) * ARENA.radius;
    ctx.beginPath();
    ctx.moveTo(ARENA.centerX, ARENA.centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFieldMarkers() {
  FIELD_MARKERS.forEach((marker) => {
    const style = MARKER_STYLE[marker.label];
    const point = pointOnCircle(ARENA.markerRadius, marker.angle);
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.fillStyle = style.glow;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = style.fill;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.shadowColor = style.stroke;
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#f4f1ea";
    ctx.font = "700 22px 'Yu Gothic UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(marker.label, 0, 2);
    ctx.restore();
  });
}

function drawNumberMarkers() {
  NUMBER_MARKERS.forEach((marker) => {
    const point = pointOnCircle(ARENA.numberRadius, marker.angle);
    const style = MARKER_STYLE[String(marker.label).replace("1", "A").replace("2", "B").replace("3", "C").replace("4", "D")];
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.fillStyle = style.glow;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = style.fill;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.shadowColor = style.stroke;
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#f4f1ea";
    ctx.font = "700 22px 'Yu Gothic UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(marker.label, 0, 2);
    ctx.restore();
  });
}

function drawExdeath() {
  ctx.save();
  ctx.translate(state.exdeath.x, state.exdeath.y);
  ctx.fillStyle = "rgba(184, 145, 255, 0.18)";
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.fill();

  if (chaosImage.complete && chaosImage.naturalWidth > 0) {
    ctx.drawImage(chaosImage, -48, -48, 96, 96);
  } else {
    ctx.fillStyle = "#b99a5c";
    ctx.beginPath();
    ctx.arc(0, 0, state.exdeath.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawExdeathCastBar() {
  if (state.time < TIMINGS.castStart || state.resolvedVacuumWave) return;
  const t = currentTranslations();

  const castDuration = TIMINGS.vacuumResolveAt - TIMINGS.castStart;
  const progress = Math.max(0, Math.min(1, (state.time - TIMINGS.castStart) / castDuration));
  const barWidth = 168;
  const barHeight = 18;
  const x = state.exdeath.x - barWidth / 2;
  const y = state.exdeath.y - 92;

  ctx.save();
  ctx.fillStyle = "rgba(10, 14, 22, 0.92)";
  ctx.beginPath();
  ctx.roundRect(x, y, barWidth, barHeight, 999);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#f4dc8a";
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 2, (barWidth - 4) * progress, barHeight - 4, 999);
  ctx.fill();

  ctx.fillStyle = "#f4f1ea";
  ctx.font = "700 12px 'Yu Gothic UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(t.vacuumWave, state.exdeath.x, y - 6);
  ctx.restore();
}

function drawChaosWindPanel() {
  const scale = canvasResponsiveScale();
  const panelW = 116 * scale;
  const panelH = 94 * scale;
  const panelX = canvas.width - panelW - 28;
  const panelY = 28;
  const outerRadius = 18 * scale;
  const innerRadius = 12 * scale;
  const innerX = panelX + 12 * scale;
  const innerY = panelY + 10 * scale;
  const innerW = 92 * scale;
  const innerH = 72 * scale;
  const imageSize = 40 * scale;

  ctx.save();
  ctx.fillStyle = "rgba(20, 24, 34, 0.88)";
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, outerRadius);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const activeImage = state.chaosWind?.key === "back" ? windImages.back : windImages.front;
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.beginPath();
  ctx.roundRect(innerX, innerY, innerW, innerH, innerRadius);
  ctx.fill();
  if (activeImage.complete && activeImage.naturalWidth > 0) {
    ctx.drawImage(
      activeImage,
      panelX + (panelW - imageSize) / 2,
      panelY + 16 * scale,
      imageSize,
      imageSize
    );
  }
  if (state.showGuides) {
    ctx.fillStyle = "#ffe45f";
    ctx.font = `700 ${12 * scale}px 'Yu Gothic UI', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(state.chaosWind?.label || "", panelX + panelW / 2, panelY + 73 * scale);
  }
  ctx.restore();
}

function drawVacuumWave() {
  if (state.time < TIMINGS.vacuumVisibleStart || state.time > TIMINGS.vacuumResolveAt + 0.25) return;

  const progress = Math.min(
    1,
    (state.time - TIMINGS.vacuumVisibleStart) / (TIMINGS.vacuumResolveAt - TIMINGS.vacuumVisibleStart)
  );
  const radius = 90 + progress * 330;

  ctx.save();
  ctx.strokeStyle = "rgba(173, 142, 255, 0.82)";
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(state.exdeath.x, state.exdeath.y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(173, 142, 255, 0.28)";
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.arc(state.exdeath.x, state.exdeath.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawPassingLine(source, target, age, emphasis = 1) {
  const totalDuration = LINE_VISUAL.travelDuration + LINE_VISUAL.lingerDuration;
  const clampedAge = Math.max(0, Math.min(totalDuration, age));
  const progress = Math.min(1, clampedAge / LINE_VISUAL.travelDuration);
  const fadeProgress = Math.max(0, clampedAge - LINE_VISUAL.travelDuration) / LINE_VISUAL.lingerDuration;
  const tailProgress = Math.max(0, fadeProgress);

  const headX = source.x + (target.x - source.x) * progress;
  const headY = source.y + (target.y - source.y) * progress;
  const tailX = source.x + (target.x - source.x) * tailProgress;
  const tailY = source.y + (target.y - source.y) * tailProgress;

  ctx.save();
  ctx.lineCap = "butt";
  ctx.strokeStyle = `rgba(216, 168, 255, ${(0.30 - fadeProgress * 0.18) * emphasis})`;
  ctx.lineWidth = LINE_VISUAL.glowWidth;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(headX, headY);
  ctx.stroke();

  ctx.strokeStyle = `rgba(180, 74, 242, ${(0.76 - fadeProgress * 0.34) * emphasis})`;
  ctx.lineWidth = LINE_VISUAL.width;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(headX, headY);
  ctx.stroke();
  ctx.restore();
}

function drawObservation() {
  const lines = activeObservationLines();
  for (const line of lines) {
    drawPassingLine(line.source, line.target, line.age, 0.96);
  }
}

function drawFinalBurst() {
  if (state.time < TIMINGS.finalBlastAt) return;
  const age = state.time - TIMINGS.finalBlastAt;
  if (age > FINAL_BURST.duration) return;

  for (const member of state.party) {
    const line = finalBurstLineForMember(member);
    const emphasis = member.id === "YOU" ? 1.08 : 0.76;
    drawPassingLine(line.source, line.target, age, emphasis);
  }
}

function drawStackTelegraph() {
  if (state.time < TIMINGS.stackGatherStartAt) return;
  if (state.stackResolved && state.time > state.stackResolvedAt + 0.15) return;
  const t = currentTranslations();

  const player = state.player;
  const resolving = state.stackResolved;
  const radius = resolving ? 96 : 76;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.strokeStyle = resolving ? "rgba(255, 199, 92, 0.9)" : "rgba(255, 255, 255, 0.82)";
  ctx.lineWidth = resolving ? 14 : 8;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "700 18px 'Yu Gothic UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(t.stack, 0, -96);
  ctx.restore();
}

function diceLayout(value) {
  const layouts = {
    1: { width: 30, points: [[0, 0]] },
    2: { width: 38, points: [[-8, 0], [8, 0]] },
    3: { width: 40, points: [[0, -10], [-10, 8], [10, 8]] },
    4: { width: 40, points: [[-10, -10], [10, -10], [-10, 10], [10, 10]] },
    5: { width: 62, points: [[-24, 0], [4, -10], [20, -10], [4, 10], [20, 10]] },
    6: { width: 70, points: [[-20, -12], [-30, 8], [-10, 8], [8, -8], [28, -8], [18, 12]] },
    7: { width: 88, points: [[-24, -10], [-34, 8], [-14, 8], [12, -10], [32, -10], [12, 10], [32, 10]] },
    8: { width: 96, points: [[-30, -10], [-30, 10], [-10, -10], [-10, 10], [14, -10], [14, 10], [34, -10], [34, 10]] },
  };
  return layouts[value];
}

function drawDicePips(value, centerX, centerY, color) {
  const blue = "#8fd1ff";
  const red = "#ff6c6c";
  const pipColor = color || (value % 2 === 1 ? blue : red);
  const layout = diceLayout(value);

  layout.points.forEach(([dx, dy]) => {
    ctx.save();
    ctx.translate(centerX + dx, centerY + dy);
    ctx.shadowColor = pipColor;
    ctx.shadowBlur = 14;
    ctx.fillStyle = pipColor;
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  return layout.width;
}

function drawDiceMarkerFor(member) {
  if (state.time < TIMINGS.diceAt) return;
  const lift = 76;
  const x = member.x;
  const y = member.y - lift;
  const width = Math.max(60, diceLayout(member.diceValue).width + 24);
  ctx.save();
  ctx.fillStyle = "rgba(10, 12, 18, 0.92)";
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - 26, width, 52, 18);
  ctx.fill();
  ctx.strokeStyle = member.id === "YOU" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  drawDicePips(member.diceValue, x, y);
  ctx.restore();
}

function drawMoveTarget() {
  if (!state.moveTarget) return;
  ctx.save();
  ctx.translate(state.moveTarget.x, state.moveTarget.y);
  ctx.strokeStyle = "rgba(104, 215, 178, 0.82)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-24, 0);
  ctx.lineTo(24, 0);
  ctx.moveTo(0, -24);
  ctx.lineTo(0, 24);
  ctx.stroke();
  ctx.restore();
}

function drawMember(member) {
  ctx.save();
  ctx.translate(member.x, member.y);
  ctx.fillStyle = member.color;
  ctx.beginPath();
  ctx.arc(0, 0, PLAYER.radius, 0, Math.PI * 2);
  ctx.fill();

  const facing = member.id === "YOU" ? state.player.facing : member.facing;
  ctx.strokeStyle = member.id === "YOU" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)";
  ctx.lineWidth = member.id === "YOU" ? 4 : 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(facing) * 26, Math.sin(facing) * 26);
  ctx.stroke();

  if (member.id === "YOU") {
    ctx.fillStyle = "#f4f1ea";
    ctx.font = "700 13px 'Yu Gothic UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(member.id, 0, 38);
  }
  ctx.restore();
}

function draw() {
  drawArenaBase();
  drawFieldMarkers();
  drawNumberMarkers();
  drawObservation();
  drawFinalBurst();
  drawExdeath();
  drawExdeathCastBar();
  drawVacuumWave();
  drawStackTelegraph();
  drawMoveTarget();
  for (const member of state.party) {
    drawMember(member);
  }
  for (const member of state.party) {
    drawDiceMarkerFor(member);
  }
  drawChaosWindPanel();
}

function renderResult(status, reason = "") {
  const t = currentTranslations();
  state.running = false;
  state.finished = true;
  UI.reset.textContent = t.retryButton;
  if (!SHOW_RESULT_MODAL || DEBUG_SUPPRESS_RESULT_MODAL) return;

  UI.resultKicker.textContent = "";
  UI.resultTitle.textContent = status;
  UI.resultReason.textContent = reason;
  UI.resultReason.style.display = reason ? "block" : "none";
  UI.resultOverlay.classList.remove("hidden");
}

function showFailureResult(reason) {
  renderResult("FAILED", reason);
}

function vacuumFailureReason() {
  const t = currentTranslations();
  if (state.chaosWind?.faceMode === "toward") {
    return t.vacuumFailureFront;
  }
  return t.vacuumFailureBack;
}

function startKnockbackAnimation(ok) {
  const members = {};
  for (const member of state.party) {
    const memberAwayAngle = Math.atan2(member.y - state.exdeath.y, member.x - state.exdeath.x);
    const knockbackDistance =
      member.id === "YOU"
        ? (ok ? VACUUM_WAVE.safeKnockback : VACUUM_WAVE.failKnockback)
        : VACUUM_WAVE.safeKnockback;
    const target = clampToArena(
      member.x + Math.cos(memberAwayAngle) * knockbackDistance,
      member.y + Math.sin(memberAwayAngle) * knockbackDistance
    );
    members[member.id] = {
      fromX: member.x,
      fromY: member.y,
      toX: target.x,
      toY: target.y,
    };
  }

  state.knockbackAnimation = {
    startAt: state.time,
    duration: VACUUM_WAVE.animationDuration,
    members,
  };
}

function updateKnockbackAnimation() {
  if (!state.knockbackAnimation) return;
  const { startAt, duration, members } = state.knockbackAnimation;
  const progress = Math.max(0, Math.min(1, (state.time - startAt) / duration));
  const eased = 1 - (1 - progress) * (1 - progress);

  for (const member of state.party) {
    const motion = members[member.id];
    member.x = motion.fromX + (motion.toX - motion.fromX) * eased;
    member.y = motion.fromY + (motion.toY - motion.fromY) * eased;
  }

  if (progress >= 1) {
    state.knockbackAnimation = null;
    if (state.pendingFailureReason) {
      const reason = state.pendingFailureReason;
      state.pendingFailureReason = null;
      showFailureResult(reason);
    }
  }
}

function resolveVacuumWave() {
  if (state.resolvedVacuumWave) return;
  state.resolvedVacuumWave = true;

  const towardAngle = Math.atan2(state.exdeath.y - state.player.y, state.exdeath.x - state.player.x);
  const awayAngle = Math.atan2(state.player.y - state.exdeath.y, state.player.x - state.exdeath.x);
  const requiredAngle = state.chaosWind.faceMode === "toward" ? towardAngle : awayAngle;
  const difference = angleDifference(state.player.facing, requiredAngle);
  const ok = difference <= VACUUM_WAVE.facingTolerance;
  state.vacuumOk = ok;
  startKnockbackAnimation(ok);

  if (!ok) {
    state.pendingFailureReason = vacuumFailureReason();
  }
}

function evaluateStackFailure() {
  if (state.time < TIMINGS.stackGatherStartAt || state.stackResolved || state.stackFailure) return;
  const stackNpcs = state.party.filter((member) => member.id !== "YOU");
  const allNpcGathered = stackNpcs.every((member, index) => {
    const target = stackGatherPoint(index, stackNpcs.length);
    return Math.hypot(member.x - target.x, member.y - target.y) <= 10;
  });
  if (!allNpcGathered) return;

  state.stackResolved = true;
  state.stackResolvedAt = state.time;

  const nearestDistance = Math.min(
    ...stackNpcs.map((member) => Math.hypot(member.x - state.player.x, member.y - state.player.y))
  );
  state.stackFailure = nearestDistance > 72;
  if (state.stackFailure) {
    showFailureResult(currentTranslations().stackFailure);
  }
}

function finalBurstLineForMember(member) {
  const sourceSequence = FINAL_BURST_SOURCE_ORDER[member.diceValue - 1];
  const sourceLine = observationLineAt(sourceSequence - 1);
  const dx = member.x - sourceLine.source.x;
  const dy = member.y - sourceLine.source.y;
  const length = Math.hypot(dx, dy) || 1;
  const unitX = dx / length;
  const unitY = dy / length;
  const farPoint = clampToArena(
    member.x + unitX * ARENA.radius * 1.2,
    member.y + unitY * ARENA.radius * 1.2
  );
  return {
    source: sourceLine.source,
    target: farPoint,
    intendedTarget: { x: member.x, y: member.y },
    targetId: member.id,
  };
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  const projX = start.x + dx * t;
  const projY = start.y + dy * t;
  return Math.hypot(point.x - projX, point.y - projY);
}

function evaluateFinalBurstCollisions() {
  const failures = [];
  for (const casterTarget of state.party) {
    const line = finalBurstLineForMember(casterTarget);
    for (const other of state.party) {
      if (other.id === casterTarget.id) continue;
      const distance = distanceToSegment({ x: other.x, y: other.y }, line.source, line.target);
      if (distance <= LINE_VISUAL.width * 0.65) {
        failures.push(`${casterTarget.id}->${other.id}`);
      }
    }
  }
  state.finalBurstFailures = failures;
}

function diceLabelForMemberId(memberId) {
  const member = state.party.find((item) => item.id === memberId);
  if (!member) return currentTranslations().diceLabel("?", false);
  return currentTranslations().diceLabel(member.diceValue, member.id === "YOU");
}

function formatFinalBurstFailures() {
  return state.finalBurstFailures
    .map((entry) => {
      const [fromId, toId] = entry.split("->");
      return `${diceLabelForMemberId(fromId)} -> ${diceLabelForMemberId(toId)}`;
    })
    .join("\n");
}

function maybeFinish() {
  if (state.finalBurstResolved || state.time < TIMINGS.finishAt) return;
  state.finalBurstResolved = true;
  evaluateFinalBurstCollisions();
  state.running = false;
  state.finished = true;

  if (SHOW_RESULT_MODAL) {
    const finalOk = state.vacuumOk && !state.stackFailure && state.finalBurstFailures.length === 0;
    renderResult(
      finalOk ? "SUCESS" : "FAILED",
      finalOk
        ? successResultSummary()
        : state.finalBurstFailures.length
        ? `${currentTranslations().finalBurstFailurePrefix}\n${formatFinalBurstFailures()}`
          : state.stackFailure
            ? currentTranslations().stackFailure
            : vacuumFailureReason()
    );
  }
}

function tick(timestamp) {
  if (state.lastFrame === 0) state.lastFrame = timestamp;
  const dt = Math.min((timestamp - state.lastFrame) / 1000, 0.05);
  state.lastFrame = timestamp;

  if (state.running) {
    state.time += dt;
    if (!state.knockbackAnimation) {
      const keyboardMoved = handleKeyboardMovement(dt);
      if (!keyboardMoved) {
        handleClickMovement(dt);
      }
    }
    if (state.time >= TIMINGS.vacuumResolveAt) {
      resolveVacuumWave();
    }
    updateKnockbackAnimation();
    updateParty(dt);
    evaluateStackFailure();
    maybeFinish();
  }

  syncHud();
  draw();
  requestAnimationFrame(tick);
}

function canvasPointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  return clampToArena(x, y);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
    keys.add(key);
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("pointerdown", (event) => {
  if (!state.running) return;
  state.moveTarget = canvasPointFromEvent(event);
});

UI.startButton.addEventListener("click", startSimulation);
UI.reset.addEventListener("click", restartSimulation);
UI.retry.addEventListener("click", restartSimulation);
UI.closeResult.addEventListener("click", () => {
  UI.resultOverlay.classList.add("hidden");
});
UI.guideToggle.addEventListener("click", () => {
  const t = currentTranslations();
  state.showGuides = !state.showGuides;
  UI.guideToggle.textContent = state.showGuides ? t.guideOff : t.guideOn;
  if (UI.modalGuideToggle) {
    UI.modalGuideToggle.checked = state.showGuides;
  }
  syncHud();
  draw();
});
if (UI.modalGuideToggle) {
  UI.modalGuideToggle.addEventListener("change", () => {
    const t = currentTranslations();
    state.showGuides = UI.modalGuideToggle.checked;
    UI.guideToggle.textContent = state.showGuides ? t.guideOff : t.guideOn;
    syncHud();
    draw();
  });
}

UI.localeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (!radio.checked) return;
    state.locale = radio.value;
    saveLocale(state.locale);
    applyLocale();
    syncHud();
    draw();
  });
});

loadSavedLocale();
applyLocale();
resetSimulation();
requestAnimationFrame(tick);
