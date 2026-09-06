export interface BookmarkLink {
  id: string;
  title: string;
  url: string;
  category?: string;
}

/**
 * 최초 설치 시 제공되는 기본 대표 바로가기 링크 (5개)
 */
export const PRESET_LINKS: BookmarkLink[] = [
  { id: '1', title: 'YouTube', url: 'https://youtube.com', category: 'all' },
  { id: '2', title: 'GitHub', url: 'https://github.com', category: 'all' },
  { id: '3', title: 'ChatGPT', url: 'https://chatgpt.com', category: 'all' },
  { id: '4', title: 'Naver', url: 'https://naver.com', category: 'all' },
  { id: '5', title: 'Google', url: 'https://google.com', category: 'all' }
];
