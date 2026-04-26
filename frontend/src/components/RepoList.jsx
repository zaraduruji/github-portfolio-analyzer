const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Dart: '#00B4AB',
};

const LANG_TEXT = { JavaScript: '#1a1a1a', Rust: '#1a1a1a' };

function langColor(lang) {
  return LANG_COLORS[lang] || '#7c3aed';
}

function langText(lang) {
  return LANG_TEXT[lang] || '#fff';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function RepoCard({ repo }) {
  const { name, description, language, stargazers_count, forks_count, updated_at, html_url } = repo;

  return (
    <div className="repo-card">
      <div className="repo-header">
        <a href={html_url} target="_blank" rel="noreferrer" className="repo-name">
          {name}
        </a>
        {language && (
          <span className="lang-badge" style={{ backgroundColor: langColor(language), color: langText(language) }}>
            {language}
          </span>
        )}
      </div>
      {description && <p className="repo-description">{description}</p>}
      <div className="repo-meta">
        <span className="meta-item">⭐ {stargazers_count.toLocaleString()}</span>
        <span className="meta-item">🍴 {forks_count.toLocaleString()}</span>
        <span className="meta-item">Updated {formatDate(updated_at)}</span>
      </div>
    </div>
  );
}

function RepoList({ repos }) {
  return (
    <section className="section">
      <h2 className="section-title">Repositories <span className="count-badge">{repos.length}</span></h2>
      <div className="repo-grid">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}

export default RepoList;
