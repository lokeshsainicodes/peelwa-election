import { D, DH, AGES } from './data.js';

export const DEFAULT_FILTERS = { w: '', gaon: '', di: '', g: '', age: '', st: 'act', q: '', sort: 'id' };

export const nf = (n) => n.toLocaleString('en-IN');
export const pc = (a, b) => (b ? Math.round((a * 100) / b) : 0);
export const countMale = (l) => l.reduce((s, v) => s + (v.g === 'M'), 0);

const DEVANAGARI_BASE = {
  'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u', 'ऋ': 'r', 'ॠ': 'r', 'ऌ': 'l', 'ॡ': 'l',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'स': 's',
  'श': 'sh', 'ष': 'sh', 'ह': 'h', 'ळ': 'l', 'ऱ': 'r', 'ॐ': 'om',
};

const DEVANAGARI_VOWEL_MARKS = {
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'r', 'ॄ': 'r', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ॉ': 'o', 'ॆ': 'e', 'ॊ': 'o', 'ॢ': 'l', 'ॣ': 'l', 'ं': '', 'ँ': '', 'ः': '', '़': '', '्': '',
};

export function normalizeSearchText(value = '') {
  const text = String(value || '').trim().toLowerCase();
  if (!text) return '';

  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (DEVANAGARI_BASE[ch] && i + 1 < text.length && DEVANAGARI_VOWEL_MARKS[text[i + 1]]) {
      const mark = DEVANAGARI_VOWEL_MARKS[text[i + 1]];
      out += DEVANAGARI_BASE[ch] + (mark || '');
      i += 1;
      continue;
    }

    if (DEVANAGARI_BASE[ch]) {
      out += DEVANAGARI_BASE[ch];
      continue;
    }

    if (DEVANAGARI_VOWEL_MARKS[ch]) {
      continue;
    }

    if (/[a-z0-9]/.test(ch)) {
      out += ch;
    }
  }

  return out.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export function matches(v, x) {
  if (x.w !== '' && v.w !== Number(x.w)) return false;
  if (x.gaon && DH[v.di].gaon !== x.gaon) return false;
  if (x.di !== '' && v.di !== Number(x.di)) return false;
  if (x.g && v.g !== x.g) return false;
  if (x.age !== '') {
    const b = AGES[Number(x.age)];
    if (v.a < b[1] || v.a > b[2]) return false;
  }
  if (x.st === 'act' && v.st) return false;
  if (x.st === 'del' && !v.st) return false;
  const q = normalizeSearchText(x.q);
  if (q) {
    const hay = normalizeSearchText(`${v.n} ${v.f} ${v.e} ${v.e.replace(/\//g, '')} ${v.sr}`);
    for (const t of q.split(/\s+/).filter(Boolean)) {
      if (!hay.includes(t)) return false;
    }
  }
  return true;
}

// Voters matching every filter except the ones named in `skip`
// (used so a chart can still show all its own bars while other filters apply).
export function subset(filters, skip = []) {
  const x = { ...filters };
  skip.forEach((k) => (x[k] = DEFAULT_FILTERS[k]));
  return D.filter((v) => matches(v, x));
}

export function aggregate(list, keyOf, labelOf) {
  const m = new Map();
  for (const v of list) {
    const k = keyOf(v);
    let o = m.get(k);
    if (!o) {
      o = { key: String(k), label: labelOf(k), t: 0, m: 0 };
      m.set(k, o);
    }
    o.t++;
    if (v.g === 'M') o.m++;
  }
  return [...m.values()];
}

const cmp = {
  id: (a, b) => a.w - b.w || a.sr - b.sr,
  n: (a, b) => a.n.localeCompare(b.n, 'hi'),
  ao: (a, b) => b.a - a.a,
  ay: (a, b) => a.a - b.a,
  d: (a, b) => a.di - b.di || a.w - b.w || a.sr - b.sr,
  gm: (a, b) => (a.g === b.g ? 0 : a.g === 'M' ? -1 : 1) || a.w - b.w || a.sr - b.sr,
  gf: (a, b) => (a.g === b.g ? 0 : a.g === 'F' ? -1 : 1) || a.w - b.w || a.sr - b.sr,
};
export const sortVoters = (list, key) => list.slice().sort(cmp[key] || cmp.id);
