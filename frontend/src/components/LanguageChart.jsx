import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#AB47BC', '#00ACC1', '#FF7043', '#8D6E63', '#5C6BC0', '#26A69A'];

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
