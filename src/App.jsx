import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import DhaniTable from './components/DhaniTable.jsx';
import VoterList from './components/VoterList.jsx';
import { DEFAULT_FILTERS, subset } from './lib/filters.js';

const TABS = [
  { id: 'home', label: 'सार', icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2' },
  { id: 'tab', label: 'ढाणी तालिका', icon: 'M3 5h18M3 12h18M3 19h18M9 5v14' },
  {
    id: 'list',
    label: 'मतदाता',
    icon: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20c.6-4 3.2-6 6.5-6s5.9 2 6.5 6M17 6.5a3 3 0 0 1 0 5.5M18.5 14.2c1.8.7 3 2.6 3.3 5.8',
  },
];

function loadTab() {
  try {
    const t = localStorage.getItem('pk_tab');
    if (TABS.some((x) => x.id === t)) return t;
  } catch (e) {
    /* storage can be blocked */
  }
  return 'home';
}

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tab, setTabState] = useState(loadTab);
  const [panelOpen, setPanelOpen] = useState(false);

  const setTab = (t) => {
    setTabState(t);
    try {
      localStorage.setItem('pk_tab', t);
    } catch (e) {
      /* ignore */
    }
    window.scrollTo(0, 0);
  };

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const filtered = useMemo(() => subset(filters), [filters]);

  // typing in the search box from another tab jumps to the voter list
  const onSearch = (q) => {
    update({ q });
    if (q.trim() && tab !== 'list') setTab('list');
  };

  useEffect(() => {
    document.title = 'पंचायत वोटर विश्लेषण';
  }, []);

  return (
    <>
      <Header
        filters={filters}
        update={update}
        reset={() => setFilters({ ...DEFAULT_FILTERS })}
        onSearch={onSearch}
        filtered={filtered}
        panelOpen={panelOpen}
        togglePanel={() => setPanelOpen((p) => !p)}
      />
      <main className="wrap">
        {tab === 'home' && <Home filters={filters} update={update} filtered={filtered} />}
        {tab === 'tab' && <DhaniTable filters={filters} update={update} goList={() => setTab('list')} goHome={() => setTab('home')} />}
        {tab === 'list' && <VoterList filters={filters} update={update} filtered={filtered} />}

        <section className="developer-card" aria-label="Developed by profile">
          <img
            className="developer-avatar"
            src="/lokesh-saini.jpeg"
            alt="Lokesh Saini"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/lokesh-saini.svg';
            }}
          />
          <div className="developer-copy">
            <p className="developer-kicker">Developed by</p>
            <h3>Lokesh Saini</h3>
            <p className="developer-note">Chaina Wali Dhani • Community awareness initiative for better voter reach and village information access.</p>
            <div className="developer-tags">
              <span>Community App</span>
              <span>Voter Insight</span>
              <span>Local Reach</span>
            </div>
          </div>
        </section>
      </main>
      <nav className="tabs" aria-label="मुख्य मेनू">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </nav>
    </>
  );
}
