function ProfileCard({ profile }) {
  const { name, login, avatar_url, bio, followers, following, public_repos, html_url } = profile;

  return (
    <div className="profile-card">
      <img src={avatar_url} alt={login} className="avatar" />
      <div className="profile-info">
        <a href={html_url} target="_blank" rel="noreferrer" className="profile-name">
          {name || login}
        </a>
        <p className="profile-login">@{login}</p>
        {bio && <p className="profile-bio">{bio}</p>}
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">{followers.toLocaleString()}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">{following.toLocaleString()}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat">
            <span className="stat-value">{public_repos.toLocaleString()}</span>
            <span className="stat-label">Repos</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
