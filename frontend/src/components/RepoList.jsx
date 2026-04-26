import { useState } from 'react';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

const LANG_ICON = {
  JavaScript:  'javascript/javascript-original.svg',
  TypeScript:  'typescript/typescript-original.svg',
  Python:      'python/python-original.svg',
  Swift:       'swift/swift-original.svg',
  'C++':       'cplusplus/cplusplus-original.svg',
  HTML:        'html5/html5-original.svg',
  CSS:         'css3/css3-original.svg',
  Dart:        'dart/dart-original.svg',
  Java:        'java/java-original.svg',
  Go:          'go/go-original.svg',
  Ruby:        'ruby/ruby-original.svg',
  C:           'c/c-original.svg',
  'C#':        'csharp/csharp-original.svg',
  PHP:         'php/php-original.svg',
  Kotlin:      'kotlin/kotlin-original.svg',
  Shell:       'bash/bash-original.svg',
  Vue:         'vuejs/vuejs-original.svg',
  Rust:        'rust/rust-plain.svg',
};

const LANG_DOT = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  C: '#555555', 'C++': '#f34b7d', 'C#': '#178600', PHP: '#4F5D95',
  Swift: '#F05138', Kotlin: '#A97BFF', HTML: '#e34c26', CSS: '#563d7c',
  Shell: '#89e051', Vue: '#41b883', Dart: '#00B4AB',
};

function LangBadge({ language }) {
  const src = LANG_ICON[language] ? `${DEVICON}${LANG_ICON[language]}` : null;
  const dot = LANG_DOT[language] || '#7c3aed';

  return (
    <span className="lang-badge">
      {src
        ? <img src={src} alt="" className="lang-icon" onError={e => { e.target.style.display = 'none'; }} />
        : <span className="lang-dot" style={{ background: dot }} />
      }
      {language}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function RepoCard({ repo }) {
  const { name, description, language, stargazers_count, forks_count, updated_at, html_url } = repo;

  return (
    <div className="repo-card">
      <div className="repo-header">
        <a href={html_url} target="_blank" rel="noreferrer" className="repo-name">{name}</a>
        {language && <LangBadge language={language} />}
      </div>
      <p className="repo-description">
        {description || <span className="repo-no-desc">No description provided.</span>}
      </p>
      <div className="repo-meta">
        <span className="meta-item">⭐ {stargazers_count.toLocaleString()}</span>
        <span className="meta-item">🍴 {forks_count.toLocaleString()}</span>
        <span className="meta-item">Updated {formatDate(updated_at)}</span>
      </div>
    </div>
  );
}

function buildTabs(repos) {
  const counts = {};
  let otherCount = 0;
  repos.forEach(r => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    else otherCount++;
  });
  const tabs = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ label: lang, key: lang, count }));
  if (otherCount > 0) tabs.push({ label: 'Other', key: 'other', count: otherCount });
  return [{ label: 'All', key: 'all', count: repos.length }, ...tabs];
}

function RepoList({ repos }) {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const tabs = buildTabs(repos);

  const filtered = repos.filter(r => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'other' ? !r.language : r.language === activeTab);
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  return (
    <section className="section">
      <h2 className="section-title">
        Repositories <span className="count-badge">{repos.length}</span>
      </h2>

      <input
        type="text"
        className="repo-search"
        placeholder="Search repositories..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="lang-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`lang-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="repo-empty">No repositories match your filters.</p>
      ) : (
        <div className="repo-grid">
          {filtered.map(repo => <RepoCard key={repo.id} repo={repo} />)}
        </div>
      )}
    </section>
  );
}

export default RepoList;
