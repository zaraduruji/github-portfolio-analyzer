function StatCard({ color, icon, label, value, link }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-card-icon" style={{ color }}>{icon}</div>
      <div className="stat-card-label">{label}</div>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="stat-card-value link-value">
          {value}
        </a>
      ) : (
        <div className="stat-card-value">{value}</div>
      )}
    </div>
  );
}

function Insights({ insights }) {
  const { topLanguage, totalStars, mostStarred, mostRecent } = insights;

  return (
    <section className="section">
      <h2 className="section-title">Insights</h2>
      <div className="insights-grid">
        <StatCard
          color="#aa3bff"
          icon="💻"
          label="Top Language"
          value={topLanguage || 'N/A'}
        />
        <StatCard
          color="#7c3aed"
          icon="⭐"
          label="Total Stars"
          value={totalStars.toLocaleString()}
        />
        <StatCard
          color="#9d4edd"
          icon="🏆"
          label="Most Starred Repo"
          value={mostStarred ? `${mostStarred.name} (${mostStarred.stars}★)` : 'N/A'}
          link={mostStarred?.url}
        />
        <StatCard
          color="#6d28d9"
          icon="🕒"
          label="Most Recently Updated"
          value={mostRecent ? mostRecent.name : 'N/A'}
          link={mostRecent?.url}
        />
      </div>
    </section>
  );
}

export default Insights;
