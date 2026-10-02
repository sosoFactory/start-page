import { describe, it, expect } from 'vitest';
import { normalizeTag, cleanTags, suggestTags, extractAllTags } from './tagHelper';
import { BookmarkLink } from '../data/presetLinks';

describe('tagHelper', () => {
  it('normalizes known acronyms to uppercase and English words to title case', () => {
    expect(normalizeTag('ai')).toBe('AI');
    expect(normalizeTag('Ui')).toBe('UI');
    expect(normalizeTag('api')).toBe('API');
    expect(normalizeTag('aws')).toBe('AWS');
    expect(normalizeTag('etf')).toBe('ETF');
    expect(normalizeTag('Etf')).toBe('ETF');
    expect(normalizeTag('svg')).toBe('SVG');
    expect(normalizeTag('Svg')).toBe('SVG');
    expect(normalizeTag('png')).toBe('PNG');
    expect(normalizeTag('jwt')).toBe('JWT');
    expect(normalizeTag('cms')).toBe('CMS');
    expect(normalizeTag('Cms')).toBe('CMS');
    expect(normalizeTag('crm')).toBe('CRM');
    expect(normalizeTag('GLTF')).toBe('GLTF');
    expect(normalizeTag('git')).toBe('Git');
    expect(normalizeTag('notion')).toBe('Notion');
    expect(normalizeTag('DEVELOPER')).toBe('Developer');
    expect(normalizeTag('개발')).toBe('개발');
  });

  it('cleans tag arrays and removes case-insensitive duplicates', () => {
    const raw = ['git', 'Git', 'GIT', '  ', 'ai', '#AI', ''];
    expect(cleanTags(raw)).toEqual(['Git', 'AI']);
  });

  it('merges case-insensitive tags in extractAllTags', () => {
    const mockLinks: BookmarkLink[] = [
      { id: '1', title: 'A', url: 'https://a.com', tags: ['git', 'ai'] },
      { id: '2', title: 'B', url: 'https://b.com', tags: ['Git', 'AI'] },
      { id: '3', title: 'C', url: 'https://c.com', tags: ['GIT'] }
    ];

    const stats = extractAllTags(mockLinks);
    expect(stats).toHaveLength(2);
    expect(stats.find((s) => s.tag === 'Git')?.count).toBe(3);
    expect(stats.find((s) => s.tag === 'AI')?.count).toBe(2);
  });

  it('suggests tags based on URL and title keywords', () => {
    expect(suggestTags('https://github.com/facebook/react', 'React')).toContain('개발');
    expect(suggestTags('https://chatgpt.com', 'ChatGPT')).toContain('AI');
    expect(suggestTags('https://youtube.com', 'YouTube')).toContain('미디어');
    expect(suggestTags('https://naver.com', '네이버')).toContain('포털');
    expect(suggestTags('https://upbit.com', '업비트')).toContain('투자');
  });

  it('suggests matching tags from user existing tag pool', () => {
    const existing = ['디자인', '스터디', '사이드프로젝트'];
    const suggestions = suggestTags('https://figma.com', '스터디 디자인 피그마', existing);
    expect(suggestions).toContain('디자인');
    expect(suggestions).toContain('스터디');
    expect(suggestions).toContain('업무');
  });

  it('extracts all unique tags with counts sorted by frequency', () => {
    const mockLinks: BookmarkLink[] = [
      { id: '1', title: 'A', url: 'https://a.com', tags: ['개발', 'AI'] },
      { id: '2', title: 'B', url: 'https://b.com', tags: ['개발', '업무'] },
      { id: '3', title: 'C', url: 'https://c.com', tags: ['AI'] }
    ];

    const stats = extractAllTags(mockLinks);
    expect(stats).toHaveLength(3);
    expect(stats.find((s) => s.tag === '개발')?.count).toBe(2);
    expect(stats.find((s) => s.tag === 'AI')?.count).toBe(2);
    expect(stats.find((s) => s.tag === '업무')?.count).toBe(1);
  });
});
