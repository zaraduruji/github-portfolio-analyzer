const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/analyze', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const profileResponse = await axios.get(
      'https://api.github.com/users/' + username
    );
    const reposResponse = await axios.get(
      'https://api.github.com/users/' + username + '/repos?per_page=100&sort=updated'
    );

    const profile = profileResponse.data;
    const repos = reposResponse.data;

    const languageCounts = {};
    repos.forEach(function(repo) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const topLanguage = Object.keys(languageCounts).sort(function(a, b) {
      return languageCounts[b] - languageCounts[a];
    })[0] || 'N/A';

    const mostStarred = repos.reduce(function(best, repo) {
      return repo.stargazers_count > (best ? best.stargazers_count : 0) ? repo : best;
    }, null);

    const mostRecent = repos[0] || null;

    const totalStars = repos.reduce(function(sum, repo) {
      return sum + repo.stargazers_count;
    }, 0);

    const languageChartData = Object.entries(languageCounts).map(function(entry) {
      return { name: entry[0], value: entry[1] };
    });

    res.json({
      profile: {
        name: profile.name,
        login: profile.login,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        followers: profile.followers,
        following: profile.following,
        public_repos: profile.public_repos,
        html_url: profile.html_url
      },
      repos: repos.map(function(repo) {
        return {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          html_url: repo.html_url
        };
      }),
      insights: {
        topLanguage: topLanguage,
        totalStars: totalStars,
        mostStarred: mostStarred ? {
          name: mostStarred.name,
          stars: mostStarred.stargazers_count,
          url: mostStarred.html_url
        } : null,
        mostRecent: mostRecent ? {
          name: mostRecent.name,
          updated_at: mostRecent.updated_at,
          url: mostRecent.html_url
        } : null,
        languageChartData: languageChartData
      }
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found' });
    }
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ error: 'GitHub API rate limit exceeded. Please wait a few minutes.' });
    }
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.listen(PORT, function() {
  console.log('Backend server running at http://localhost:' + PORT);
});