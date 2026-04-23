import { useState } from 'react';
import axios from 'axios';
import './App.css';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
import Insights from './components/Insights';
import LanguageChart from './components/LanguageChart';
import RepoList from './components/RepoList';

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await axios.get(`http://localhost:3001/api/analyze?username=${encodeURIComponent(trimmed)}`);
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`User "${trimmed}" not found on GitHub.`);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-logo">
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>i</span>
          <span style={{ color: '#FBBC05' }}>t</span>
          <span style={{ color: '#34A853' }}>H</span>
          <span style={{ color: '#4285F4' }}>u</span>
          <span style={{ color: '#EA4335' }}>b</span>
        </div>
        <h1 className="hero-title">Portfolio Analyzer</h1>
        <p className="hero-subtitle">Explore any GitHub profile with beautiful insights</p>
        <SearchBar
          value={username}
          onChange={setUsername}
          onSearch={handleSearch}
          loading={loading}
        />
      </header>

      <main className="main">
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p className="loading-text">Fetching GitHub data…</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}

        {data && (
          <div className="results">
            <ProfileCard profile={data.profile} />
            <Insights insights={data.insights} />
            <LanguageChart data={data.insights.languageChartData} />
            <RepoList repos={data.repos} />
          </div>
        )}

        {!loading && !error && !data && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>Enter a GitHub username above to get started</p>
          </div>
        )}
      </main>

      <footer className="footer">
        Built with React &amp; Recharts · Powered by GitHub API
      </footer>
    </div>
  );
}

export default App;
