export interface BookmarkLink {
  id: string;
  title: string;
  url: string;
}

/**
 * 최초 설치 시 제공되는 기본 대표 바로가기 링크 (5개)
 */
export const PRESET_LINKS: BookmarkLink[] = [
  { id: '1', title: 'YouTube', url: 'https://youtube.com' },
  { id: '2', title: 'GitHub', url: 'https://github.com' },
  { id: '3', title: 'ChatGPT', url: 'https://chatgpt.com' },
  { id: '4', title: 'Naver', url: 'https://naver.com' },
  { id: '5', title: 'Google', url: 'https://google.com' }
];
