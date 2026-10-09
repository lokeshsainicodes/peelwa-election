import { useState } from 'react';
import { DH, GAONS, WARDS } from '../lib/data.js';
import { subset, nf } from '../lib/filters.js';

export default function DhaniTable({ filters: F, update, goList, goHome }) {
  const [sort, setSort] = useState({ k: 't', d: -1 });
  const l = subset(F, ['gaon', 'di']);

  const rows = {};
  l.forEach((v) => {
    const r = rows[v.di] || (rows[v.di] = { di: v.di, t: 0, m: 0, y: 0, o: 0, ws: new Set() });
    r.t++;
    if (v.g === 'M') r.m++;
    if (v.a <= 19) r.y++;
    if (v.a >= 60) r.o++;
    r.ws.add(v.w);
  });
  const arr = Object.values(rows).filter((r) => !F.gaon || DH[r.di].gaon === F.gaon);
  const val = (r) => ({ n: DH[r.di].name, g: DH[r.di].gaon, t: r.t, m: r.m, f: r.t - r.m, y: r.y, o: r.o }[sort.k]);
  arr.sort((a, b) => {
    const x = val(a);
    const y = val(b);
    return (typeof x === 'string' ? x.localeCompare(y, 'hi') : x - y) * sort.d;
  });
  const tot = arr.reduce((s, r) => ({ t: s.t + r.t, m: s.m + r.m, y: s.y + r.y, o: s.o + r.o }), { t: 0, m: 0, y: 0, o: 0 });

  const sortBy = (k) => setSort((s) => (s.k === k ? { k, d: -s.d } : { k, d: k === 'n' || k === 'g' ? 1 : -1 }));
  const Th = ({ k, children }) => (
    <th onClick={() => sortBy(k)}>
      {children}
      {sort.k === k ? (sort.d < 0 ? ' ↓' : ' ↑') : ''}
    </th>
  );

  const wg = {};
  subset(F, ['w', 'gaon', 'di']).forEach((v) => {
    const k = `${v.w}|${DH[v.di].gaon}`;
    wg[k] = (wg[k] || 0) + 1;
  });

  return (
    <>
      <div className="card" style={{ marginBottom: 12 }}>
        <h2>ढाणी / मोहल्ला तालिका</h2>
        <p className="hint">हर पंक्ति पर दबाने से उस ढाणी के मतदाता खुलेंगे। ऊपर वार्ड या लिंग चुनने पर यही तालिका उसी हिसाब से बदलेगी।</p>
      </div>
      <div className="tw">
        <table>
          <thead>
            <tr>
              <Th k="n">ढाणी / मोहल्ला</Th>
              <Th k="g">गांव</Th>
              <th>वार्ड</th>
              <Th k="t">कुल</Th>
              <Th k="m">पुरुष</Th>
              <Th k="f">महिला</Th>
              <Th k="y">18-19</Th>
              <Th k="o">60+</Th>
            </tr>
          </thead>
          <tbody>
            {arr.length === 0 && (
              <tr>
                <td colSpan={8} className="empty">कोई ढाणी नहीं मिली</td>
              </tr>
            )}
            {arr.map((r) => (
              <tr
                key={r.di}
                className="cl"
                onClick={() => {
                  update({ di: String(r.di), gaon: DH[r.di].gaon });
                  goList();
                }}
              >
                <td>{DH[r.di].name}</td>
                <td style={{ textAlign: 'left' }}>{DH[r.di].gaon}</td>
                <td>{[...r.ws].sort((a, b) => a - b).join(', ')}</td>
                <td><b>{nf(r.t)}</b></td>
                <td>{r.m}</td>
                <td>{r.t - r.m}</td>
                <td>{r.y}</td>
                <td>{r.o}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>कुल</td><td /><td />
              <td>{nf(tot.t)}</td><td>{nf(tot.m)}</td><td>{nf(tot.t - tot.m)}</td><td>{tot.y}</td><td>{nf(tot.o)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h2 style={{ margin: '18px 0 8px' }}>वार्ड × गांव</h2>
      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>वार्ड</th>
              {GAONS.map((g) => (<th key={g}>{g}</th>))}
              <th>कुल</th>
            </tr>
          </thead>
          <tbody>
            {WARDS.map((w) => {
              const c = GAONS.map((g) => wg[`${w}|${g}`] || 0);
              return (
                <tr key={w} className="cl" onClick={() => { update({ w: String(w) }); goHome(); }}>
                  <td>वार्ड {w}</td>
                  {c.map((x, i) => (<td key={i}>{x || '–'}</td>))}
                  <td><b>{c.reduce((a, b) => a + b, 0)}</b></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
