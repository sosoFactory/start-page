import { BookmarkLink } from '../data/presetLinks';

/**
 * 도메인 및 키워드 기반 자동 추천 태그 규칙 사전
 */
interface TagRule {
  tag: string;
  keywords: string[];
}

const TAG_RULES: TagRule[] = [
  {
    tag: '개발',
    keywords: ['github', 'gitlab', 'stackoverflow', 'npm', 'yarn', 'deno', 'developer', 'react', 'vue', 'python', 'rust', 'golang', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'vercel', 'netlify', 'git', 'dev', 'code']
  },
  {
    tag: 'AI',
    keywords: ['chatgpt', 'claude', 'gemini', 'openai', 'anthropic', 'deepmind', 'perplexity', 'midjourney', 'huggingface', 'cursor', 'copilot', 'suno', 'runway', 'ai']
  },
  {
    tag: '미디어',
    keywords: ['youtube', 'netflix', 'chzzk', 'twitch', 'wavve', 'tving', 'watcha', 'disney', 'spotify', 'soundcloud', 'melon', 'video', 'tv', 'movie']
  },
  {
    tag: '포털',
    keywords: ['naver', 'daum', 'google', 'bing', 'yahoo', 'nate', 'zum']
  },
  {
    tag: '검색',
    keywords: ['google', 'naver', 'bing', 'daum', 'duckduckgo', 'search']
  },
  {
    tag: '업무',
    keywords: ['notion', 'slack', 'jira', 'confluence', 'figma', 'miro', 'linear', 'asana', 'trello', 'zoom', 'drive.google', 'docs.google', 'mail', 'cal']
  },
  {
    tag: '블로그',
    keywords: ['velog', 'tistory', 'medium', 'brunch', 'blog', 'ghost', 'substack']
  },
  {
    tag: '투자',
    keywords: ['upbit', 'bithumb', 'binance', 'coinmarketcap', 'finance', 'invest', 'stock', 'toss', 'tradingview', 'quant', 'bitcoin', 'crypto']
  },
  {
    tag: '쇼핑',
    keywords: ['coupang', 'smartstore', '11st', 'gmarket', 'auction', 'amazon', 'aliexpress', 'ssg', 'kurly', 'musinsa', '29cm']
  },
  {
    tag: '커뮤니티',
    keywords: ['reddit', 'dcinside', 'fmkorea', 'ruliweb', 'clien', 'ppomppu', 'inven', 'blind', 'threads', 'x.com', 'twitter']
  },
  {
    tag: '뉴스',
    keywords: ['news', 'yonhap', 'chosun', 'donga', 'joongang', 'hankyoreh', 'bbc', 'cnn', 'bloomberg', 'reuters']
  }
];

/**
 * 태그 문자열 정규화 (앞의 '#' 제거, 공백 제거 등)
 */
export const normalizeTag = (tag: string): string => {
  return tag.trim().replace(/^#+/, '').trim();
};

/**
 * 태그 배열 정규화 (공백 제거, 중복 제거, 빈 문자열 필터링)
 */
export const cleanTags = (tags?: string[]): string[] => {
  if (!tags || !Array.isArray(tags)) return [];
  const set = new Set<string>();
  for (const t of tags) {
    const cleaned = normalizeTag(t);
    if (cleaned) {
      set.add(cleaned);
    }
  }
  return Array.from(set);
};

/**
 * URL 및 사이트명, 기존 태그 풀을 기반으로 자동 추천 태그 도출
 */
export const suggestTags = (
  url: string,
  title: string = '',
  existingTags: string[] = []
): string[] => {
  const textToScan = `${url} ${title}`.toLowerCase();
  const suggestions = new Set<string>();

  // 1. 규칙 사전 매칭
  for (const rule of TAG_RULES) {
    for (const kw of rule.keywords) {
      if (textToScan.includes(kw.toLowerCase())) {
        suggestions.add(rule.tag);
        break;
      }
    }
  }

  // 2. 사용자가 기존에 생성한 태그 목록과의 매칭
  for (const userTag of existingTags) {
    const normalized = normalizeTag(userTag);
    if (normalized && normalized.length >= 2 && textToScan.includes(normalized.toLowerCase())) {
      suggestions.add(normalized);
    }
  }

  return Array.from(suggestions);
};

/**
 * 전체 북마크 링크에서 사용된 모든 고유 태그 및 빈도수 통계 추출
 */
export interface TagCount {
  tag: string;
  count: number;
}

export const extractAllTags = (links: BookmarkLink[]): TagCount[] => {
  const countMap = new Map<string, number>();

  for (const link of links) {
    const tags = cleanTags(link.tags);
    for (const tag of tags) {
      countMap.set(tag, (countMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(countMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
};
