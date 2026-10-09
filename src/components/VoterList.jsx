import { useState, useEffect } from 'react';
import { D, DH, STATUS_LABEL } from '../lib/data.js';
import { nf, sortVoters } from '../lib/filters.js';

const PAGE = 60;
const SORTS = [
  ['id', 'वार्ड / क्रम संख्या'],
  ['d', 'ढाणी के हिसाब से'],
  ['gm', 'पुरुष पहले'],
  ['gf', 'महिला पहले'],
  ['n', 'नाम (अ-ज्ञ)'],
  ['ao', 'उम्र: बड़े से छोटे'],
  ['ay', 'उम्र: छोटे से बड़े'],
];

export default function VoterList({ filters: F, update, filtered }) {
  const [shown, setShown] = useState(PAGE);
  const [copyMsg, setCopyMsg] = useState('सूची कॉपी करें');

  // start from the first page again whenever a filter changes
  const key = JSON.stringify(F);
  useEffect(() => setShown(PAGE), [key]);

  const list = sortVoters(filtered, F.sort);
  const part = list.slice(0, shown);

  const dhaniOptions = DH.filter((d) => (!F.gaon || d.gaon === F.gaon) && D.some((v) => v.di === d.i && (F.w === '' || v.w === Number(F.w))));

  const copy = () => {
    const text = list
      .map((v) => `${v.w}/${v.sr}. ${v.n} - ${v.rel === 'H' ? 'पति' : 'पिता'}: ${v.f} - ID ${v.e || '-'} - ${v.a} साल - ${v.g === 'M' ? 'पुरुष' : 'महिला'} - ${DH[v.di].name}`)
      .join('\n');
    const done = (msg) => {
      setCopyMsg(msg);
      setTimeout(() => setCopyMsg('सूची कॉपी करें'), 1500);
    };
    try {
      navigator.clipboard.writeText(text).then(() => done('कॉपी हो गया'), () => done('कॉपी नहीं हुआ'));
    } catch (e) {
      done('कॉपी नहीं हुआ');
    }
  };

  return (
    <>
      <div className="sbar">
        <b>{nf(list.length)} मतदाता</b>
        <select id="ld" aria-label="ढाणी" value={String(F.di)} onChange={(e) => update({ di: e.target.value })}>
          <option value="">सभी ढाणी / मोहल्ला</option>
          {dhaniOptions.map((d) => (<option key={d.i} value={d.i}>{d.name}</option>))}
        </select>
        <select id="lx" aria-label="लिंग" value={F.g} onChange={(e) => update({ g: e.target.value })}>
          <option value="">पुरुष + महिला</option>
          <option value="M">सिर्फ़ पुरुष</option>
          <option value="F">सिर्फ़ महिला</option>
        </select>
        <select id="so" aria-label="क्रम" value={F.sort} onChange={(e) => update({ sort: e.target.value })}>
          {SORTS.map(([v, t]) => (<option key={v} value={v}>{t}</option>))}
        </select>
        <button className="btn o" onClick={copy}>{copyMsg}</button>
      </div>

      {part.length === 0 && <div className="empty">कोई मतदाता नहीं मिला। ऊपर के फ़िल्टर बदलें या "सब हटाएं" दबाएं।</div>}

      {part.map((v) => (
        <div className={`vc ${v.st ? 'dead' : ''}`} key={v.k}>
          <div className="no">
            {v.sr}
            <small>वार्ड {v.w}</small>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="vn">
              {v.n}
              {v.st && (
                <span className="mt" style={{ display: 'inline-flex' }}>
                  <span className="bd">{STATUS_LABEL[v.st]}</span>
                </span>
              )}
            </div>
            <div className="vr">{v.rel === 'H' ? 'पति' : 'पिता'}: {v.f}</div>
            <div className="mt">
              <span>{v.e ? `ID ${v.e}` : 'ID नहीं'}</span>
              <span>{v.a} साल</span>
              <span className={v.g}>{v.g === 'M' ? 'पुरुष' : 'महिला'}</span>
              <span>{DH[v.di].name}</span>
            </div>
          </div>
        </div>
      ))}

      {list.length > shown && (
        <div style={{ textAlign: 'center', margin: 12 }}>
          <button className="btn" onClick={() => setShown((s) => s + PAGE)}>
            और {Math.min(PAGE, list.length - shown)} दिखाएं ({nf(list.length - shown)} बाकी)
          </button>
        </div>
      )}
    </>
  );
}
