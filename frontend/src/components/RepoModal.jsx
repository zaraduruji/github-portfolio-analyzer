import { useEffect, useState } from 'react';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

const LANG_META = {
  JavaScript: { color: '#f7df1e', icon: 'javascript/javascript-original.svg' },
  TypeScript: { color: '#3178c6', icon: 'typescript/typescript-original.svg' },
  Python:     { color: '#3572A5', icon: 'python/python-original.svg' },
  Swift:      { color: '#f05138', icon: 'swift/swift-original.svg' },
  'C++':      { color: '#00599c', icon: 'cplusplus/cplusplus-original.svg' },
  HTML:       { color: '#e34c26', icon: 'html5/html5-original.svg' },
  CSS:        { color: '#264de4', icon: 'css3/css3-original.svg' },
  Dart:       { color: '#00b4ab', icon: 'dart/dart-original.svg' },
  Java:       { color: '#b07219', icon: 'java/java-original.svg' },
  Go:         { color: '#00add8', icon: 'go/go-original.svg' },
  Ruby:       { color: '#701516', icon: 'ruby/ruby-original.svg' },
  C:          { color: '#555555', icon: 'c/c-original.svg' },
  'C#':       { color: '#178600', icon: 'csharp/csharp-original.svg' },
  PHP:        { color: '#4F5D95', icon: 'php/php-original.svg' },
  Kotlin:     { color: '#7f52ff', icon: 'kotlin/kotlin-original.svg' },
  Shell:      { color: '#89e051', icon: 'bash/bash-original.svg' },
  Vue:        { color: '#42b883', icon: 'vuejs/vuejs-original.svg' },
  Rust:       { color: '#dea584', icon: 'rust/rust-plain.svg' },
};

function fmt(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function RepoModal({ repo, onClose }) {
  const [details, setDetails]   = useState(null);
  const [languages, setLanguages] = useState(null);
  const [readme, setReadme]     = useState(null);
  const [loading, setLoading]   = useState(true);

  const [owner, repoName] = new URL(repo.html_url).pathname.slice(1).split('/');
  const apiBase = `https://api.github.com/repos/${owner}/${repoName}`;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(apiBase).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${apiBase}/languages`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${apiBase}/readme`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([det, langs, rdm]) => {
      setDetails(det);
      setLanguages(langs && !langs.message ? langs : {});
      if (rdm?.content) {
        try {
          const raw = atob(rdm.content.replace(/\n/g, ''));
          const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
          const text = new TextDecoder('utf-8').decode(bytes);
          setReadme(text.slice(0, 300));
        } catch { setReadme(null); }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [apiBase]);

  const langEntries = languages ? Object.entries(languages) : [];
  const langTotal   = langEntries.reduce((s, [, v]) => s + v, 0);
  const meta        = LANG_META[repo.language];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {loading ? (
          <div className="modal-loading">
            <div className="spinner" />
            <p className="loading-text">Loading…</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-title-row">
                {meta && (
                  <img
                    src={`${DEVICON}${meta.icon}`}
                    alt={repo.language}
                    className="modal-lang-icon"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
                <h2 className="modal-title">{repo.name}</h2>
              </div>
              {repo.language && (
                <span
                  className="modal-lang-badge"
                  style={{ color: meta?.color || '#aa3bff', borderColor: meta?.color || '#aa3bff' }}
                >
                  {repo.language}
                </span>
              )}
            </div>

            {repo.description && (
              <p className="modal-description">{repo.description}</p>
            )}

            <div className="modal-stats">
              <div className="modal-stat">
                <span className="modal-stat-icon">⭐</span>
                <span className="modal-stat-val">{repo.stargazers_count.toLocaleString()}</span>
                <span className="modal-stat-lbl">Stars</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-icon">🍴</span>
                <span className="modal-stat-val">{repo.forks_count.toLocaleString()}</span>
                <span className="modal-stat-lbl">Forks</span>
              </div>
              {details?.subscribers_count != null && (
                <div className="modal-stat">
                  <span className="modal-stat-icon">👁</span>
                  <span className="modal-stat-val">{details.subscribers_count.toLocaleString()}</span>
                  <span className="modal-stat-lbl">Watchers</span>
                </div>
              )}
              {details?.open_issues_count != null && (
                <div className="modal-stat">
                  <span className="modal-stat-icon">🐛</span>
                  <span className="modal-stat-val">{details.open_issues_count.toLocaleString()}</span>
                  <span className="modal-stat-lbl">Issues</span>
                </div>
              )}
            </div>

            {details?.topics?.length > 0 && (
              <div className="modal-topics">
                {details.topics.map(t => (
                  <span key={t} className="modal-topic">{t}</span>
                ))}
              </div>
            )}

            {langEntries.length > 0 && (
              <div className="modal-lang-section">
                <div className="modal-lang-bar">
                  {langEntries.map(([lang, bytes]) => (
                    <div
                      key={lang}
                      className="modal-lang-segment"
                      style={{
                        width: `${(bytes / langTotal * 100).toFixed(2)}%`,
                        background: LANG_META[lang]?.color || '#7c3aed',
                      }}
                      title={`${lang} ${(bytes / langTotal * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>
                <div className="modal-lang-labels">
                  {langEntries.map(([lang, bytes]) => {
                    const pct   = (bytes / langTotal * 100).toFixed(1);
                    const lmeta = LANG_META[lang];
                    return (
                      <span key={lang} className="modal-lang-label">
                        <span className="modal-lang-dot" style={{ background: lmeta?.color || '#7c3aed' }} />
                        {lang} <span className="modal-lang-pct">{pct}%</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="modal-dates">
              {details?.created_at && <span>📅 Created {fmt(details.created_at)}</span>}
              <span>🔄 Updated {fmt(repo.updated_at)}</span>
            </div>

            {readme && (
              <div className="modal-readme">
                <div className="modal-readme-label">README preview</div>
                <pre className="modal-readme-content">{readme}{readme.length >= 300 && '…'}</pre>
              </div>
            )}

            <a href={repo.html_url} target="_blank" rel="noreferrer" className="modal-cta">
              View on GitHub ↗
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default RepoModal;
