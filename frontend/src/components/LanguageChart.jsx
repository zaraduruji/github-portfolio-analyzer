import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#aa3bff', '#7c3aed', '#9d4edd', '#c084fc', '#e879f9', '#6d28d9', '#a855f7', '#d946ef', '#8b5cf6', '#c026d3'];

function renderLabel({ name, percent }) {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(1)}%`;
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
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} repo${value !== 1 ? 's' : ''}`, name]}
            />
            <Legend
              formatter={(value, entry) => {
                const total = data.reduce((sum, d) => sum + d.value, 0);
                const pct = ((entry.payload.value / total) * 100).toFixed(1);
                return `${value} (${pct}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default LanguageChart;
