import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

const LANG_META = {
  JavaScript: { color: '#f7df1e', icon: 'javascript/javascript-original.svg' },
  Python:     { color: '#3572A5', icon: 'python/python-original.svg' },
  Swift:      { color: '#f05138', icon: 'swift/swift-original.svg' },
  TypeScript: { color: '#3178c6', icon: 'typescript/typescript-original.svg' },
  Dart:       { color: '#00b4ab', icon: 'dart/dart-original.svg' },
  CSS:        { color: '#264de4', icon: 'css3/css3-original.svg' },
  HTML:       { color: '#e34c26', icon: 'html5/html5-original.svg' },
  'C++':      { color: '#00599c', icon: 'cplusplus/cplusplus-original.svg' },
  Kotlin:     { color: '#7f52ff', icon: 'kotlin/kotlin-original.svg' },
  Go:         { color: '#00add8', icon: 'go/go-original.svg' },
  Rust:       { color: '#dea584', icon: 'rust/rust-plain.svg' },
  Vue:        { color: '#42b883', icon: 'vuejs/vuejs-original.svg' },
  Java:       { color: '#b07219', icon: 'java/java-original.svg' },
  Ruby:       { color: '#701516', icon: 'ruby/ruby-original.svg' },
  C:          { color: '#555555', icon: 'c/c-original.svg' },
  'C#':       { color: '#178600', icon: 'csharp/csharp-original.svg' },
  PHP:        { color: '#4F5D95', icon: 'php/php-original.svg' },
  Shell:      { color: '#89e051', icon: 'bash/bash-original.svg' },
};

function sliceColor(name) {
  return LANG_META[name]?.color || '#aa3bff';
}

function renderLabel({ percent }) {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(1)}%`;
}

function CustomLegend({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="chart-legend">
      {data.map(entry => {
        const pct = ((entry.value / total) * 100).toFixed(1);
        const meta = LANG_META[entry.name];
        const iconSrc = meta ? `${DEVICON}${meta.icon}` : null;
        const dot = meta?.color || '#aa3bff';

        return (
          <div key={entry.name} className="legend-item">
            {iconSrc
              ? <img
                  src={iconSrc}
                  alt={entry.name}
                  className="legend-icon"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              : <span className="legend-dot" style={{ background: dot }} />
            }
            <span className="legend-label">{entry.name}</span>
            <span className="legend-pct">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function LanguageChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Language Breakdown</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label={renderLabel}
              labelLine={false}
            >
              {data.map(entry => (
                <Cell key={entry.name} fill={sliceColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} repo${value !== 1 ? 's' : ''}`, name]}
              contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(170,59,255,0.3)', borderRadius: 8, color: '#f3f4f6' }}
              itemStyle={{ color: '#f3f4f6' }}
              labelStyle={{ color: '#c084fc' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <CustomLegend data={data} />
      </div>
    </section>
  );
}

export default LanguageChart;
