import raw from '../data/voters.json';

// raw.D rows: [ward, serial, name, relative, relType(P|H), house, age, gender(M|F), status, dhaniIndex, voterId]
// raw.DH rows: [gaon, dhaniName]
// Ghar (house) number is kept in the data but is not shown anywhere in the UI.
export const D = raw.D.map((a) => ({
  w: a[0],
  sr: a[1],
  n: a[2],
  f: a[3],
  rel: a[4],
  a: a[6],
  g: a[7],
  st: a[8],
  di: a[9],
  e: a[10],
  k: `${a[0]}-${a[1]}`,
}));

export const DH = raw.DH.map((x, i) => ({ i, gaon: x[0], name: x[1] }));
export const GAONS = ['पीलवा कलां', 'पीलवा खुर्द', 'नहरना'];
export const WARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const AGES = [
  ['18-19', 18, 19],
  ['20-29', 20, 29],
  ['30-39', 30, 39],
  ['40-49', 40, 49],
  ['50-59', 50, 59],
  ['60-69', 60, 69],
  ['70+', 70, 200],
];
export const STATUS_LABEL = { E: 'मृत', S: 'शिफ्ट', R: 'दोहरा नाम' };
