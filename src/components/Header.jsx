import { D, DH, GAONS, WARDS, AGES } from '../lib/data.js';
import { subset, nf, countMale } from '../lib/filters.js';

function toggleTheme() {
  const r = document.documentElement;
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark';
}

function Select({ id, label, value, onChange, options }) {
  return (
    <select id={id} aria-label={label} value={String(value)} onChange={(e) => onChange(e.target.value)}>
      {options.map(([v, t]) => (
        <option key={v} value={String(v)}>
          {t}
        </option>
      ))}
    </select>
  );
}

export default function Header({ filters, update, reset, onSearch, filtered, panelOpen, togglePanel }) {
  const F = filters;
  const counts = {};
  subset(F, ['w']).forEach((v) => (counts[v.w] = (counts[v.w] || 0) + 1));

  const dhaniOptions = DH.filter((d) => (!F.gaon || d.gaon === F.gaon) && D.some((v) => v.di === d.i && (F.w === '' || v.w === Number(F.w))));

  const males = countMale(filtered);
  const tags = [];
  if (F.gaon) tags.push(['gaon', `गांव: ${F.gaon}`]);
  if (F.di !== '') tags.push(['di', DH[Number(F.di)].name]);
  if (F.g) tags.push(['g', F.g === 'M' ? 'पुरुष' : 'महिला']);
  if (F.age !== '') tags.push(['age', `${AGES[Number(F.age)][0]} साल`]);
  if (F.st !== 'act') tags.push(['st', F.st === 'del' ? 'हटाए गए' : 'सब']);
  if (F.q.trim()) tags.push(['q', `खोज: ${F.q.trim()}`]);

  const clear = (k) => (k === 'gaon' ? update({ gaon: '', di: '' }) : update({ [k]: k === 'st' ? 'act' : '' }));

  return (
    <header className="top">
      <div className="wrap">
        <div className="t1">
          <div className="title-wrap">
            <h1>पीलवा कलां ग्राम पंचायत</h1>
          </div>
          <div className="header-actions">
            <button className="ib" onClick={togglePanel} aria-label="फ़िल्टर खोलें">
              फ़िल्टर
            </button>
            <button className="ib" onClick={toggleTheme} aria-label="थीम बदलें">
              थीम
            </button>
          </div>
        </div>

        <div className="chips">
          <button className={`chip ${F.w === '' ? 'on' : ''}`} onClick={() => update({ w: '' })}>
            सभी वार्ड
          </button>
          {WARDS.map((w) => (
            <button key={w} className={`chip ${F.w === String(w) ? 'on' : ''}`} onClick={() => update({ w: String(w) })}>
              वार्ड {w} <small>{nf(counts[w] || 0)}</small>
            </button>
          ))}
        </div>

        <div className="bar2">
          <input
            id="q"
            type="search"
            value={F.q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="नाम, पिता/पति का नाम या वोटर ID (जैसे ZHU1431766) खोजें"
            aria-label="खोजें"
          />
        </div>

        {panelOpen && (
          <div className="panel">
            <Select id="fg" label="गांव" value={F.gaon} onChange={(v) => update({ gaon: v, di: '' })} options={[['', 'सभी गांव'], ...GAONS.map((g) => [g, g])]} />
            <Select id="fd" label="ढाणी" value={F.di} onChange={(v) => update({ di: v })} options={[['', 'सभी ढाणी / मोहल्ला'], ...dhaniOptions.map((d) => [d.i, d.name])]} />
            <Select id="fx" label="लिंग" value={F.g} onChange={(v) => update({ g: v })} options={[['', 'पुरुष + महिला'], ['M', 'सिर्फ़ पुरुष'], ['F', 'सिर्फ़ महिला']]} />
            <Select id="fa" label="उम्र" value={F.age} onChange={(v) => update({ age: v })} options={[['', 'सभी उम्र'], ...AGES.map((a, i) => [i, `${a[0]} साल`])]} />
            <Select id="fs" label="सूची" value={F.st} onChange={(v) => update({ st: v })} options={[['act', 'अंतिम सूची के वोटर'], ['del', 'हटाए गए नाम'], ['all', 'सब']]} />
          </div>
        )}

        <div className="status">
          <b>{nf(filtered.length)}</b> मतदाता · पुरुष {nf(males)} · महिला {nf(filtered.length - males)}
          {tags.map(([k, t]) => (
            <span className="tag" key={k}>
              {t}
              <button onClick={() => clear(k)} aria-label="हटाएं">
                ✕
              </button>
            </span>
          ))}
          {(tags.length > 0 || F.w !== '') && (
            <button className="tag" onClick={reset} style={{ border: 0, color: 'inherit', cursor: 'pointer', padding: '1px 10px' }}>
              सब हटाएं
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
