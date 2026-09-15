import React from 'react';
import { APP_VERSION, COPYRIGHT_HOLDER, GITHUB_REPO_URL } from '../constants/appInfo';

export const Footer: React.FC = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-left">
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-copyright-link"
        >
          © {COPYRIGHT_HOLDER}
        </a>
      </div>

      <div className="footer-right">
        <span className="footer-version-tag">v{APP_VERSION}</span>
      </div>
    </footer>
  );
};
