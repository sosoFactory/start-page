import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { APP_VERSION, COPYRIGHT_HOLDER, GITHUB_REPO_URL } from '../constants/appInfo';

describe('Footer Component', () => {
  it('should render copyright text and GitHub link correctly', () => {
    render(<Footer />);
    const linkElement = screen.getByRole('link', { name: new RegExp(COPYRIGHT_HOLDER) });
    expect(linkElement).toBeTruthy();
    expect(linkElement.getAttribute('href')).toBe(GITHUB_REPO_URL);
    expect(linkElement.getAttribute('target')).toBe('_blank');
  });

  it('should render the app version tag', () => {
    render(<Footer />);
    const versionElement = screen.getByText(`v${APP_VERSION}`);
    expect(versionElement).toBeTruthy();
  });
});
