/**
 * 파비콘 다단계 폴백 및 스마트 이니셜 배지 헬퍼 유틸리티
 */

// 인메모리 파비콘 리졸버 캐시 (세션 동안 유지되어 불필요한 반복 404 요청 방지)
const faviconCache = new Map<string, { src?: string; useInitial?: boolean }>();

/**
 * 도메인 추출 헬퍼
 */
export const extractDomain = (url: string): string => {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.toLowerCase();
  } catch {
    return url.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
  }
};

/**
 * 서브도메인이 독립된 개별 프로젝트/블로그인 멀티 테넌트 호스팅 플랫폼 목록
 * 이 플랫폼들은 상위 도메인의 파비콘(예: github.io 옥토캣 로고 등)을 상속받지 않고 스마트 이니셜 배지로 폴백합니다.
 */
export const MULTI_TENANT_HOSTS = new Set([
  'github.io',
  'gitlab.io',
  'vercel.app',
  'netlify.app',
  'pages.dev',
  'web.app',
  'firebaseapp.com',
  'surge.sh',
  'render.com',
  'tistory.com',
  'notion.site',
  'blogspot.com',
  'wordpress.com'
]);

/**
 * 루트 도메인 추출 헬퍼 (서브도메인 브랜드 폴백용)
 */
export const getRootDomain = (domain: string): string => {
  const parts = domain.split('.');
  if (parts.length > 2) {
    let candidate = parts.slice(-2).join('.');
    if (['co.kr', 'or.kr', 'ne.kr', 're.kr', 'pe.kr', 'go.kr'].some(cctld => domain.endsWith(cctld))) {
      candidate = parts.slice(-3).join('.');
    }

    // 멀티 테넌트 호스팅 플랫폼인 경우 상위 플랫폼 파비콘 상속 제외
    if (MULTI_TENANT_HOSTS.has(candidate)) {
      return domain;
    }

    return candidate;
  }
  return domain;
};

/**
 * 고화질 파비콘 URL 후보 목록 생성 (1차 Google FaviconV2, 2차 루트 도메인 FaviconV2, 3차 사이트 자체 /favicon.ico, 4차 Google S2)
 */
export const getFaviconSources = (url: string): string[] => {
  const domain = extractDomain(url);
  if (!domain) return [];

  const rootDomain = getRootDomain(domain);
  const sources = [
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`
  ];

  if (rootDomain !== domain) {
    sources.push(`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${rootDomain}&size=64`);
  }

  sources.push(`https://${domain}/favicon.ico`);
  sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);

  return sources;
};

/**
 * 파비콘 캐시 조회
 */
export const getCachedFavicon = (domain: string) => {
  return faviconCache.get(domain) || null;
};

/**
 * Google S2의 726 바이트 기본 회색 지구본 PNG인지 정밀 확인
 */
export const isDefaultGlobeImage = async (src: string): Promise<boolean> => {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return blob.size === 726;
  } catch {
    return false;
  }
};

/**
 * 파비콘 캐시 저장
 */
export const setCachedFavicon = (domain: string, result: { src?: string; useInitial?: boolean }) => {
  faviconCache.set(domain, result);
};

/**
 * 스마트 이니셜 추출 함수
 * - 한글: 첫 1글자 (예: '네이버' -> '네', '카카오뱅크' -> '카')
 * - 영문: 식별력을 높인 2글자 (복합어/공백/대문자 분기는 단어별 앞글자, 단일 단어는 앞 2글자)
 */
export const getSmartInitial = (title: string, url: string): string => {
  const cleanTitle = title.trim();
  const sourceText = cleanTitle || extractDomain(url) || 'Site';

  // 1. 첫 글자가 한글인지 확인
  const firstChar = sourceText.charAt(0);
  const isKorean = /[가-힣]/.test(firstChar);

  if (isKorean) {
    return firstChar;
  }

  // 2. 영문/숫자 처리
  // 공백, 하이픈, 언더스코어로 단어 분리
  const words = sourceText.split(/[\s\-_]+/).filter(Boolean);

  if (words.length >= 2) {
    // 2단어 이상인 경우: 각 단어의 첫 글자 2개 (예: "Stack Overflow" -> "SO", "Google Cloud" -> "GC")
    const char1 = words[0].charAt(0).toUpperCase();
    const char2 = words[1].charAt(0).toUpperCase();
    if (/[A-Z0-9]/i.test(char1) && /[A-Z0-9]/i.test(char2)) {
      return `${char1}${char2}`;
    }
  }

  // 단일 단어 내 CamelCase / PascalCase 대문자 검출 (예: "GitHub" -> "GH", "YouTube" -> "YT")
  const capitalMatches = sourceText.match(/[A-Z]/g);
  if (capitalMatches && capitalMatches.length >= 2) {
    return `${capitalMatches[0]}${capitalMatches[1]}`.toUpperCase();
  }

  // 일반 단일 영문 단어: 앞 2글자 대문자 (예: "Notion" -> "NO", "Figma" -> "FI")
  const alphanumericOnly = sourceText.replace(/[^a-zA-Z0-9]/g, '');
  if (alphanumericOnly.length >= 2) {
    return alphanumericOnly.substring(0, 2).toUpperCase();
  }

  return (alphanumericOnly.charAt(0) || firstChar || '?').toUpperCase();
};

/**
 * 7대 감각적인 파스텔 브랜드 테마 세트 (배경색 및 텍스트 색상)
 */
const BADGE_THEMES = [
  { bg: '#fee2e2', color: '#e11d48' }, // 코랄/로즈
  { bg: '#e0e7ff', color: '#4338ca' }, // 인디고/블루
  { bg: '#dcfce7', color: '#15803d' }, // 에메랄드
  { bg: '#e0f2fe', color: '#0369a1' }, // 스카이블루/오션
  { bg: '#f3e8ff', color: '#7e22ce' }, // 바이올렛/퍼플
  { bg: '#fef3c7', color: '#b45309' }, // 앰버/골드
  { bg: '#f1f5f9', color: '#334155' }  // 모던 슬레이트
];

/**
 * 문자열 해시 기반 일관된 뱃지 테마 반환
 */
export const getInitialBadgeTheme = (seed: string): { bg: string; color: string } => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BADGE_THEMES.length;
  return BADGE_THEMES[index];
};
