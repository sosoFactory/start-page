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
    keywords: ['github', 'gitlab', 'stackoverflow', 'npm', 'yarn', 'deno', 'developer', 'react', 'vue', 'python', 'rust', 'golang', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'vercel', 'netlify', 'git', 'dev', 'code', '개발', '코딩', '깃허브', 'tina']
  },
  {
    tag: 'AI',
    keywords: ['chatgpt', 'claude', 'gemini', 'openai', 'anthropic', 'deepmind', 'perplexity', 'midjourney', 'huggingface', 'cursor', 'copilot', 'suno', 'runway', 'ai', '인공지능', '챗gpt', '클로드', '제미나이']
  },
  {
    tag: '미디어',
    keywords: ['youtube', 'netflix', 'chzzk', 'twitch', 'wavve', 'tving', 'watcha', 'disney', 'spotify', 'soundcloud', 'melon', 'video', 'tv', 'movie', '유튜브', '넷플릭스', '치지직', '영상', '음악']
  },
  {
    tag: '포털',
    keywords: ['naver', 'daum', 'google', 'bing', 'yahoo', 'nate', 'zum', '네이버', '다음', '구글']
  },
  {
    tag: '검색',
    keywords: ['google', 'naver', 'bing', 'daum', 'duckduckgo', 'search', '검색']
  },
  {
    tag: '업무',
    keywords: ['notion', 'slack', 'jira', 'confluence', 'figma', 'miro', 'linear', 'asana', 'trello', 'zoom', 'drive.google', 'docs.google', 'mail', 'cal', '노션', '슬랙', '피그마', '업무', '문서', '협업']
  },
  {
    tag: '블로그',
    keywords: ['velog', 'tistory', 'medium', 'brunch', 'blog', 'ghost', 'substack', '벨로그', '티스토리', '미디엄', '브런치', '블로그']
  },
  {
    tag: '투자',
    keywords: ['upbit', 'bithumb', 'binance', 'coinmarketcap', 'finance', 'invest', 'stock', 'etf', 'toss', 'tradingview', 'quant', 'bitcoin', 'crypto', '업비트', '빗썸', '바이낸스', '비트코인', '퀀트', '주식', '투자', '증권', '코인']
  },
  {
    tag: '쇼핑',
    keywords: ['coupang', 'smartstore', '11st', 'gmarket', 'auction', 'amazon', 'aliexpress', 'ssg', 'kurly', 'musinsa', '29cm', '쿠팡', '스마트스토어', '쇼핑', '무신사']
  },
  {
    tag: '커뮤니티',
    keywords: ['reddit', 'dcinside', 'fmkorea', 'ruliweb', 'clien', 'ppomppu', 'inven', 'blind', 'threads', 'x.com', 'twitter', '디시', '클리앙', '뽐뿌', '인벤', '블라인드', '커뮤니티']
  },
  {
    tag: '뉴스',
    keywords: ['news', 'yonhap', 'chosun', 'donga', 'joongang', 'hankyoreh', 'bbc', 'cnn', 'bloomberg', 'reuters', '연합뉴스', '뉴스', '신문']
  }
];

/**
 * 주요 테크/금융/웹/포맷 표준 약어 사전 (대문자 정규화 대상)
 */
export const KNOWN_ACRONYMS = new Set([
  // AI & 데이터
  'AI', 'ML', 'DL', 'LLM', 'GPT', 'AGI', 'NLP', 'OCR', 'RAG', 'TTS', 'STT',
  // 디자인 & 프론트엔드 & 포맷
  'UI', 'UX', 'SVG', 'PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'PDF', 'CSS', 'HTML', 'DOM', 'BOM',
  'CSV', 'TSV', 'XML', 'JSON', 'YAML', 'TOML', 'WASM',
  // 개발 도구 & 프로그래밍 & 인프라
  'API', 'AWS', 'GCP', 'IT', 'DB', 'SQL', 'SDK', 'IDE', 'CLI', 'GUI', 'NPM',
  'CI', 'CD', 'IP', 'DNS', 'SSH', 'FTP', 'SSL', 'TLS', 'HTTP', 'HTTPS', 'URL', 'URI',
  'CDN', 'ORM', 'RPC', 'GRPC', 'BFF', 'REST', 'JWT', 'JS', 'TS', 'OS',
  // 하드웨어 & 네트워크 & 기타 테크 & 솔루션
  'GPU', 'CPU', 'RAM', 'SSD', 'HDD', 'USB', 'LAN', 'WAN', 'VPN', 'VR', 'AR',
  'SEO', 'SNS', 'RSS', 'OTT', 'FAQ', 'QNA', 'MVP', 'QA',
  'CMS', 'CRM', 'ERP', 'LMS', 'POS', 'SCM', 'HRM',
  // 금융 & 비즈니스 & 블록체인
  'ETF', 'IPO', 'KRX', 'SEC', 'FED', 'FOMC', 'NFT', 'DAO', 'DEX', 'CEX', 'DEFI', 'P2P'
]);

/**
 * 태그 문자열 정규화:
 * 1. 앞 '#' 및 공백 제거
 * 2. 알려진 약어 사전 매칭 -> 대문자 (예: 'ai' -> 'AI', 'svg' -> 'SVG', 'etf' -> 'ETF')
 * 3. 2~5글자의 모음 없는 자음 약어/포맷 -> 대문자 (예: 'png' -> 'PNG', 'xml' -> 'XML', 'jwt' -> 'JWT')
 * 4. 2~5글자 전체 대문자 입력 -> 사용자 약어 의도 존중하여 대문자 유지 (예: 'GLTF' -> 'GLTF')
 * 5. 일반 순수 영단어 -> Title Case (예: 'git' -> 'Git', 'notion' -> 'Notion')
 * 6. 한글/숫자/특수문자 -> 원본 유지
 */
export const normalizeTag = (rawTag: string): string => {
  const trimmed = rawTag.trim().replace(/^#+/, '').trim();
  if (!trimmed) return '';

  const upper = trimmed.toUpperCase();

  // 1. 알려진 약어 사전 매칭 (예: 'etf', 'svg', 'ai' -> 'ETF', 'SVG', 'AI')
  if (KNOWN_ACRONYMS.has(upper)) {
    return upper;
  }

  // 영문 알파벳으로만 구성된 경우 스마트 약어/일반단어 판별
  if (/^[a-zA-Z]+$/.test(trimmed)) {
    // 2. 2~5글자이면서 모음(a, e, i, o, u)이 전혀 없는 경우 -> 100% 약어/확장자/포맷으로 판별 (예: 'png' -> 'PNG', 'xml' -> 'XML')
    if (trimmed.length >= 2 && trimmed.length <= 5 && !/[aeiouAEIOU]/.test(trimmed)) {
      return upper;
    }

    // 3. 사용자가 원래 2~5글자 전체 대문자로 입력한 경우 -> 약어 의도로 간주하여 대문자 유지
    if (trimmed.length >= 2 && trimmed.length <= 5 && trimmed === upper) {
      return upper;
    }

    // 4. 일반 영단어 -> 첫 글자 대문자 Title Case (예: 'git' -> 'Git', 'notion' -> 'Notion')
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  }

  // 5. 한글, 숫자, 복합/특수 문자열 등은 원본 형태 유지 (예: '개발', '3D', 'Next.js', 'C++')
  return trimmed;
};

/**
 * 태그 배열 정규화 (공백 제거, 대소문자 무시 중복 제거, 빈 문자열 필터링)
 */
export const cleanTags = (tags?: string[]): string[] => {
  if (!tags || !Array.isArray(tags)) return [];
  const map = new Map<string, string>(); // lowerKey -> normalizedTag
  for (const t of tags) {
    const normalized = normalizeTag(t);
    if (normalized) {
      const lowerKey = normalized.toLowerCase();
      if (!map.has(lowerKey)) {
        map.set(lowerKey, normalized);
      }
    }
  }
  return Array.from(map.values());
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
  const suggestions = new Map<string, string>(); // lowerKey -> normalizedTag

  // 1. 규칙 사전 매칭
  for (const rule of TAG_RULES) {
    for (const kw of rule.keywords) {
      if (textToScan.includes(kw.toLowerCase())) {
        const norm = normalizeTag(rule.tag);
        suggestions.set(norm.toLowerCase(), norm);
        break;
      }
    }
  }

  // 2. 사용자가 기존에 생성한 태그 목록과의 매칭
  for (const userTag of existingTags) {
    const norm = normalizeTag(userTag);
    if (norm && norm.length >= 2 && textToScan.includes(norm.toLowerCase())) {
      suggestions.set(norm.toLowerCase(), norm);
    }
  }

  return Array.from(suggestions.values());
};

/**
 * 전체 북마크 링크에서 사용된 모든 고유 태그 및 빈도수 통계 추출 (대소문자 통합 집계)
 */
export interface TagCount {
  tag: string; // 정규화된 대표 태그명 (예: 'Git', 'AI')
  count: number;
}

export const extractAllTags = (links: BookmarkLink[]): TagCount[] => {
  const map = new Map<string, { tag: string; count: number }>();

  for (const link of links) {
    const tags = cleanTags(link.tags);
    for (const tag of tags) {
      const lowerKey = tag.toLowerCase();
      const existing = map.get(lowerKey);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(lowerKey, { tag, count: 1 });
      }
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
};
