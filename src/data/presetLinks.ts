export interface BookmarkLink {
  id: string;
  title: string;
  url: string;
  tags?: string[];
}

/**
 * 최초 설치 시 제공되는 기본 대표 바로가기 링크 (5개)
 */
export const PRESET_LINKS: BookmarkLink[] = [
  { id: '1', title: 'YouTube', url: 'https://youtube.com', tags: ['미디어', '영상'] },
  { id: '2', title: 'GitHub', url: 'https://github.com', tags: ['개발', 'Git'] },
  { id: '3', title: 'ChatGPT', url: 'https://chatgpt.com', tags: ['AI', '업무'] },
  { id: '4', title: 'Naver', url: 'https://naver.com', tags: ['포털', '검색'] },
  { id: '5', title: 'Google', url: 'https://google.com', tags: ['검색', '포털'] }
];
