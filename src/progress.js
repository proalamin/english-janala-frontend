const STORAGE_KEY = "ej-known-words";

function readKnownIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeKnownIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage may be unavailable (private browsing, quota). Fail silently.
  }
}

export function isWordKnown(wordId) {
  return readKnownIds().includes(wordId);
}

export function markWordKnown(wordId) {
  const ids = readKnownIds();
  if (!ids.includes(wordId)) {
    writeKnownIds([...ids, wordId]);
  }
}

export function unmarkWordKnown(wordId) {
  writeKnownIds(readKnownIds().filter((id) => id !== wordId));
}

export function toggleWordKnown(wordId) {
  if (isWordKnown(wordId)) {
    unmarkWordKnown(wordId);
  } else {
    markWordKnown(wordId);
  }
}

export function getKnownCount(wordIds) {
  const known = new Set(readKnownIds());
  return wordIds.reduce((count, id) => (known.has(id) ? count + 1 : count), 0);
}

export function getBundleProgress(wordIds) {
  if (!wordIds.length) {
    return { known: 0, total: 0, percent: 0, complete: false };
  }
  const known = getKnownCount(wordIds);
  const percent = Math.round((known / wordIds.length) * 100);
  return { known, total: wordIds.length, percent, complete: known === wordIds.length };
}
