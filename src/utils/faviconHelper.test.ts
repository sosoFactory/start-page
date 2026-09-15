import { describe, it, expect } from 'vitest';
import {
  extractDomain,
  getFaviconSources,
  getSmartInitial,
  getInitialBadgeTheme,
  getCachedFavicon,
  setCachedFavicon
} from './faviconHelper';

describe('faviconHelper', () => {
  describe('extractDomain', () => {
    it('should extract domain from full URL', () => {
      expect(extractDomain('https://www.google.com/search?q=test')).toBe('www.google.com');
      expect(extractDomain('http://sub.domain.co.kr/path/to/page')).toBe('sub.domain.co.kr');
    });

    it('should handle URL without protocol', () => {
      expect(extractDomain('github.com/sosoFactory')).toBe('github.com');
    });
  });

  describe('getFaviconSources', () => {
    it('should return Google FaviconV2, root domain fallback, direct root, and S2 sources', () => {
      const sources = getFaviconSources('https://github.com');
      expect(sources).toHaveLength(3);
      expect(sources[0]).toContain('gstatic.com/faviconV2');
      expect(sources[1]).toBe('https://github.com/favicon.ico');
      expect(sources[2]).toContain('google.com/s2/favicons');

      const subSources = getFaviconSources('https://app.tina.io');
      expect(subSources).toHaveLength(4);
      expect(subSources[0]).toContain('url=https://app.tina.io');
      expect(subSources[1]).toContain('url=https://tina.io');
    });
  });

  describe('getSmartInitial', () => {
    it('should extract 1 character for Korean titles', () => {
      expect(getSmartInitial('네이버', 'https://naver.com')).toBe('네');
      expect(getSmartInitial('카카오뱅크', 'https://kakaobank.com')).toBe('카');
      expect(getSmartInitial('토스 증권', 'https://toss.im')).toBe('토');
    });

    it('should extract 2 characters for multi-word English titles', () => {
      expect(getSmartInitial('Stack Overflow', 'https://stackoverflow.com')).toBe('SO');
      expect(getSmartInitial('Google Cloud', 'https://cloud.google.com')).toBe('GC');
      expect(getSmartInitial('Hacker News', 'https://news.ycombinator.com')).toBe('HN');
    });

    it('should extract 2 characters for CamelCase/PascalCase English titles', () => {
      expect(getSmartInitial('GitHub', 'https://github.com')).toBe('GH');
      expect(getSmartInitial('YouTube', 'https://youtube.com')).toBe('YT');
      expect(getSmartInitial('ChatGPT', 'https://chat.openai.com')).toBe('CG');
    });

    it('should extract 2 characters for single-word English titles', () => {
      expect(getSmartInitial('Notion', 'https://notion.so')).toBe('NO');
      expect(getSmartInitial('Figma', 'https://figma.com')).toBe('FI');
      expect(getSmartInitial('Slack', 'https://slack.com')).toBe('SL');
    });

    it('should fallback to domain when title is empty', () => {
      expect(getSmartInitial('', 'https://google.com')).toBe('GO');
      expect(getSmartInitial('   ', 'https://naver.com')).toBe('NA');
    });
  });

  describe('getInitialBadgeTheme', () => {
    it('should return a consistent theme for the same seed', () => {
      const theme1 = getInitialBadgeTheme('GitHub');
      const theme2 = getInitialBadgeTheme('GitHub');
      expect(theme1).toEqual(theme2);
      expect(theme1).toHaveProperty('bg');
      expect(theme1).toHaveProperty('color');
    });
  });

  describe('favicon cache', () => {
    it('should store and retrieve cached favicon results', () => {
      setCachedFavicon('example.com', { src: 'https://example.com/icon.png' });
      expect(getCachedFavicon('example.com')).toEqual({ src: 'https://example.com/icon.png' });

      setCachedFavicon('unknown-site.xyz', { useInitial: true });
      expect(getCachedFavicon('unknown-site.xyz')).toEqual({ useInitial: true });
    });
  });
});
