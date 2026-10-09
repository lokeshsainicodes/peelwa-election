import { nf, pc } from '../lib/filters.js';

export const Legend = () => (
  <div className="lg">
    <span>
      <i className="dot" style={{ background: 'var(--m)' }} />
      पुरुष 
    </span>
    <span>
      <i className="dot" style={{ background: 'var(--f)' }} />
      महिला
    </span>
  </div>
);

export default function BarRows({ items, selected, onPick }) {
  const mx = Math.max(1, ...items.map((x) => x.t));
  return items.map((x) => (
    <button key={x.key} className={`row ${selected === x.key ? 'sel' : ''}`} onClick={() => onPick(x.key)}>
      <span className="nm">{x.label}</span>
      <span className="stk" style={{ width: `${Math.max(3, (x.t * 100) / mx)}%` }}>
        <i style={{ width: `${pc(x.m, x.t)}%`, background: 'var(--m)' }} />
        <i style={{ flex: 1, background: 'var(--f)' }} />
      </span>
      <span className="v">{nf(x.t)}</span>
    </button>
  ));
}
