import { DH, AGES } from '../lib/data.js';
import { subset, aggregate, nf, pc, countMale } from '../lib/filters.js';
import BarRows, { Legend } from './BarRows.jsx';

const toggle = (cur, v) => (String(cur) === String(v) ? '' : String(v));

export default function Home({ filters: F, update, filtered: l }) {
  const m = countMale(l);
  const f = l.length - m;
  const avg = l.length ? Math.round(l.reduce((s, v) => s + v.a, 0) / l.length) : 0;
  const young = l.filter((v) => v.a <= 19).length;
  const old = l.filter((v) => v.a >= 60).length;

  const byWard = aggregate(subset(F, ['w']), (v) => v.w, (k) => `वार्ड ${k}`).sort((a, b) => a.key - b.key);
  const byGaon = aggregate(subset(F, ['gaon', 'di']), (v) => DH[v.di].gaon, (k) => k).sort((a, b) => b.t - a.t);
  const byDhani = aggregate(subset(F, ['di']), (v) => v.di, (k) => DH[k].name).sort((a, b) => b.t - a.t);

  const ageBase = subset(F, ['age']);
  const ages = AGES.map((b, i) => {
    const s = ageBase.filter((v) => v.a >= b[1] && v.a <= b[2]);
    const mm = countMale(s);
    return { i, t: s.length, m: mm, f: s.length - mm, label: b[0] };
  });
  const mxa = Math.max(1, ...ages.map((a) => Math.max(a.m, a.f)));

  return (
    <>
      <div className="grid kp">
        <div className="card kpi"><div className="n">{nf(l.length)}</div><div className="l">कुल मतदाता</div></div>
        <div className="card kpi"><div className="n" style={{ color: 'var(--m)' }}>{nf(m)}</div><div className="l">पुरुष</div><div className="s">{pc(m, l.length)}%</div></div>
        <div className="card kpi"><div className="n" style={{ color: 'var(--f)' }}>{nf(f)}</div><div className="l">महिला</div><div className="s">{pc(f, l.length)}%</div></div>
        <div className="card kpi"><div className="n">{avg}</div><div className="l">औसत उम्र (साल)</div></div>
        <div className="card kpi"><div className="n">{nf(young)}</div><div className="l">पहली बार (18-19 साल)</div></div>
        <div className="card kpi"><div className="n">{nf(old)}</div><div className="l">60 साल से ऊपर</div></div>
      </div>

      <div className="grid two" style={{ marginTop: 12 }}>
        <div className="card">
          <h2>वार्ड के हिसाब से</h2>
          <p className="hint">वार्ड पर दबाएं, पूरा डैशबोर्ड उसी वार्ड का हो जाएगा</p>
          <Legend />
          <BarRows items={byWard} selected={String(F.w)} onPick={(k) => update({ w: toggle(F.w, k) })} />
        </div>
        <div className="card">
          <h2>गांव के हिसाब से</h2>
          <p className="hint">पीलवा कलां, पीलवा खुर्द, नहरना</p>
          <Legend />
          <BarRows items={byGaon} selected={F.gaon} onPick={(k) => update({ gaon: F.gaon === k ? '' : k, di: '' })} />
          <h2 style={{ marginTop: 14 }}>उम्र के हिसाब से</h2>
          <p className="hint">पुरुष और महिला अलग-अलग · दबाकर फ़िल्टर करें</p>
          <div className="age">
            {ages.map((a) => (
              <div key={a.i} className={String(F.age) === String(a.i) ? 'sel' : ''} onClick={() => update({ age: toggle(F.age, a.i) })}>
                <b>{nf(a.t)}</b>
                <div className="pair">
                  <i style={{ height: `${(a.m * 100) / mxa}%`, background: 'var(--m)', minHeight: a.m ? 2 : 0 }} />
                  <i style={{ height: `${(a.f * 100) / mxa}%`, background: 'var(--f)', minHeight: a.f ? 2 : 0 }} />
                </div>
                <small>{a.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="card">
          <h2>ढाणी / मोहल्ले (सबसे ज़्यादा वोट)</h2>
          <p className="hint">पूरी सूची और गांव-वार तालिका "ढाणी तालिका" टैब में</p>
          <Legend />
          <BarRows items={byDhani.slice(0, 12)} selected={F.di === '' ? '' : String(F.di)} onPick={(k) => update({ di: toggle(F.di, k) })} />
        </div>
      </div>
    </>
  );
}
