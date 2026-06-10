/* ===== AlgoArcade: progression state (localStorage-backed) ===== */

var STORAGE_KEY = 'algoarcade.v1';
var State = loadState();

function defaultState() {
  return { xp: 0, scores: {}, badges: [], sound: true };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    return Object.assign(defaultState(), s);
  } catch (e) {
    return defaultState();
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(State)); } catch (e) {}
}

function resetState() {
  State = defaultState();
  saveState();
}

// ----- derived helpers -----
function levelFromXp(xp) { return Math.floor(xp / 100) + 1; }
function xpIntoLevel(xp) { return xp % 100; }

function topicIndex(id) { return TOPICS.findIndex((t) => t.id === id); }

function isCompleted(id) { return State.scores[id] != null; }

// Level locking is disabled — every level is freely accessible. Stars/XP/badges
// remain as optional achievements. (Kept as a function so callers stay unchanged.)
function isUnlocked(index) {
  return true;
}

function starsFor(percent) {
  if (percent >= 100) return 3;
  if (percent >= 80) return 2;
  if (percent >= 60) return 1;
  return 0; // below the pass threshold
}

var PASS_THRESHOLD = 60;

// Record a challenge result. Returns a summary used to drive celebrations.
function recordResult(id, percent) {
  const passed = percent >= PASS_THRESHOLD;
  const prevBest = State.scores[id];
  const firstClear = passed && prevBest == null;

  let gained = 0;
  if (passed) {
    if (firstClear) {
      gained = 40 + Math.round(percent * 0.6);     // clear bonus + performance
    } else if (percent > (prevBest || 0)) {
      gained = Math.round((percent - prevBest) * 0.6); // reward improvement
    } else {
      gained = 5;                                   // small consolation for a replay
    }
  }

  const prevLevel = levelFromXp(State.xp);
  if (passed) {
    State.xp += gained;
    State.scores[id] = Math.max(prevBest || 0, percent);
  }
  const leveledUp = levelFromXp(State.xp) > prevLevel;

  const newBadges = [];
  for (const b of BADGES) {
    if (!State.badges.includes(b.id) && b.test(State)) {
      State.badges.push(b.id);
      newBadges.push(b);
    }
  }
  saveState();
  return { passed, firstClear, gained, leveledUp, newBadges, best: State.scores[id] || 0 };
}
