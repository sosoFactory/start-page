// ==================== URL & 태그 도우미 로직 (Vanilla JS 호환) ====================

// URL 정규화 함수 (프로토콜, www, 마지막 슬래시 제거하여 정확한 비교)
const normalizeUrl = (rawUrl) => {
  if (!rawUrl) return '';
  return rawUrl
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
};

// 도메인 및 키워드 기반 자동 추천 태그 규칙 사전
const TAG_RULES = [
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

// 주요 테크/금융/웹/포맷 표준 약어 사전 (대문자 정규화)
const KNOWN_ACRONYMS = new Set([
  'AI', 'ML', 'DL', 'LLM', 'GPT', 'AGI', 'NLP', 'OCR', 'RAG', 'TTS', 'STT',
  'UI', 'UX', 'SVG', 'PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'PDF', 'CSS', 'HTML', 'DOM', 'BOM',
  'CSV', 'TSV', 'XML', 'JSON', 'YAML', 'TOML', 'WASM',
  'API', 'AWS', 'GCP', 'IT', 'DB', 'SQL', 'SDK', 'IDE', 'CLI', 'GUI', 'NPM',
  'CI', 'CD', 'IP', 'DNS', 'SSH', 'FTP', 'SSL', 'TLS', 'HTTP', 'HTTPS', 'URL', 'URI',
  'CDN', 'ORM', 'RPC', 'GRPC', 'BFF', 'REST', 'JWT', 'JS', 'TS', 'OS',
  'GPU', 'CPU', 'RAM', 'SSD', 'HDD', 'USB', 'LAN', 'WAN', 'VPN', 'VR', 'AR',
  'SEO', 'SNS', 'RSS', 'OTT', 'FAQ', 'QNA', 'MVP', 'QA',
  'CMS', 'CRM', 'ERP', 'LMS', 'POS', 'SCM', 'HRM',
  'ETF', 'IPO', 'KRX', 'SEC', 'FED', 'FOMC', 'NFT', 'DAO', 'DEX', 'CEX', 'DEFI', 'P2P'
]);

// 태그 문자열 정규화
const normalizeTag = (rawTag) => {
  if (!rawTag) return '';
  const trimmed = rawTag.trim().replace(/^#+/, '').trim();
  if (!trimmed) return '';

  const upper = trimmed.toUpperCase();
  if (KNOWN_ACRONYMS.has(upper)) {
    return upper;
  }

  if (/^[a-zA-Z]+$/.test(trimmed)) {
    if (trimmed.length >= 2 && trimmed.length <= 5 && !/[aeiouAEIOU]/.test(trimmed)) {
      return upper;
    }
    if (trimmed.length >= 2 && trimmed.length <= 5 && trimmed === upper) {
      return upper;
    }
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  }

  return trimmed;
};

// 태그 배열 정규화 (공백 제거, 대소문자 무시 중복 제거)
const cleanTags = (tags) => {
  if (!tags || !Array.isArray(tags)) return [];
  const map = new Map();
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

// 자동 추천 태그 도출
const suggestTags = (url, title = '', existingTags = []) => {
  const textToScan = `${url} ${title}`.toLowerCase();
  const suggestions = new Map();

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

  // 2. 기존 사용자 태그 매칭
  for (const userTag of existingTags) {
    const norm = normalizeTag(userTag);
    if (norm && norm.length >= 2 && textToScan.includes(norm.toLowerCase())) {
      suggestions.set(norm.toLowerCase(), norm);
    }
  }

  return Array.from(suggestions.values());
};

// 기본 5개 대표 링크
const DEFAULT_PRESETS = [
  { id: '1', title: 'YouTube', url: 'https://youtube.com', tags: ['미디어'] },
  { id: '2', title: 'GitHub', url: 'https://github.com', tags: ['개발'] },
  { id: '3', title: 'ChatGPT', url: 'https://chatgpt.com', tags: ['AI'] },
  { id: '4', title: 'Naver', url: 'https://naver.com', tags: ['포털', '검색'] },
  { id: '5', title: 'Google', url: 'https://google.com', tags: ['포털', '검색'] }
];

// ==================== 팝업 인터랙션 & 저장 로직 ====================

document.addEventListener('DOMContentLoaded', async () => {
  const urlInput = document.getElementById('link-url');
  const titleInput = document.getElementById('link-title');
  const tagInput = document.getElementById('tag-input');
  const tagsBox = document.getElementById('tags-box');
  const tagsList = document.getElementById('tags-list');
  const suggestedContainer = document.getElementById('suggested-tags-container');
  const suggestedList = document.getElementById('suggested-list');
  const form = document.getElementById('add-form');
  const closeBtn = document.getElementById('btn-close');
  const statusMsg = document.getElementById('status-msg');
  const alreadyBox = document.getElementById('already-box');
  const alreadyLinkTitle = document.getElementById('already-link-title');
  const alreadyCloseBtn = document.getElementById('btn-already-close');

  let selectedTags = [];
  let userExistingTags = [];
  let hasManuallyEditedTags = false;
  let currentTabUrl = '';

  // 닫기 및 취소 버튼
  if (closeBtn) {
    closeBtn.addEventListener('click', () => window.close());
  }
  if (alreadyCloseBtn) {
    alreadyCloseBtn.addEventListener('click', () => window.close());
  }

  // 추천 태그 영역 렌더링
  const renderSuggestions = () => {
    if (!suggestedContainer || !suggestedList) return;

    const currentTitle = titleInput ? titleInput.value.trim() : '';
    const allSuggested = suggestTags(currentTabUrl, currentTitle, userExistingTags);
    const available = allSuggested.filter(
      (st) => !selectedTags.some((t) => t.toLowerCase() === st.toLowerCase())
    );

    if (available.length === 0) {
      suggestedContainer.style.display = 'none';
      suggestedList.innerHTML = '';
      return;
    }

    suggestedContainer.style.display = 'flex';
    suggestedList.innerHTML = '';

    available.forEach((tag) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'modal-suggest-chip';
      chip.innerHTML = `<span>+</span><span>#${tag}</span>`;
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        addTag(tag);
        if (tagInput) tagInput.focus();
      });
      suggestedList.appendChild(chip);
    });
  };

  // 태그 칩 렌더링
  const renderTags = () => {
    if (!tagsList || !tagInput) return;

    // 기존 칩 제거 (tagInput은 유지)
    const chips = tagsList.querySelectorAll('.modal-tag-chip');
    chips.forEach((chip) => chip.remove());

    // 태그 칩 추가
    selectedTags.forEach((tag) => {
      const chip = document.createElement('span');
      chip.className = 'modal-tag-chip';
      chip.textContent = `#${tag}`;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'modal-tag-remove-btn';
      removeBtn.setAttribute('aria-label', `${tag} 태그 삭제`);
      removeBtn.innerHTML = `
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTag(tag);
      });

      chip.appendChild(removeBtn);
      tagsList.insertBefore(chip, tagInput);
    });

    tagInput.placeholder = selectedTags.length === 0 ? '태그 입력... (Enter 또는 쉼표)' : '태그 추가...';
    renderSuggestions();
  };

  // 태그 추가
  const addTag = (rawTag) => {
    const cleaned = normalizeTag(rawTag);
    if (!cleaned) return;
    if (!selectedTags.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      selectedTags.push(cleaned);
      hasManuallyEditedTags = true;
      renderTags();
    }
    if (tagInput) tagInput.value = '';
  };

  // 태그 삭제
  const removeTag = (tagToRemove) => {
    selectedTags = selectedTags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase());
    hasManuallyEditedTags = true;
    renderTags();
    if (tagInput) tagInput.focus();
  };

  // 태그 입력 박스 클릭 시 인풋에 포커스
  if (tagsBox && tagInput) {
    tagsBox.addEventListener('click', (e) => {
      if (e.target !== tagInput && !e.target.closest('.modal-tag-remove-btn')) {
        tagInput.focus();
      }
    });
  }

  // 태그 인풋 키보드 이벤트 핸들러
  if (tagInput) {
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(tagInput.value);
      } else if (e.key === 'Backspace' && !tagInput.value && selectedTags.length > 0) {
        removeTag(selectedTags[selectedTags.length - 1]);
      }
    });

    tagInput.addEventListener('blur', () => {
      if (tagInput.value.trim()) {
        addTag(tagInput.value);
      }
    });
  }

  // 사이트 제목 변경 시 자동 추천 재계산 (사용자가 직접 태그를 수정하지 않은 경우)
  if (titleInput) {
    titleInput.addEventListener('input', () => {
      if (!hasManuallyEditedTags) {
        const autoTags = suggestTags(currentTabUrl, titleInput.value.trim(), userExistingTags);
        selectedTags = autoTags;
        renderTags();
      } else {
        renderSuggestions();
      }
    });
  }

  try {
    // 1. 현재 활성 탭 조회
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return;

    currentTabUrl = tab.url;
    const isInternalPage = currentTabUrl.startsWith('chrome://') || currentTabUrl.startsWith('edge://') || currentTabUrl.startsWith('about:');

    // 2. chrome.storage.local에서 기존 북마크 목록 조회
    const result = await chrome.storage.local.get('saniti_links_v1');
    let currentLinks = [];
    if (result && Array.isArray(result.saniti_links_v1)) {
      currentLinks = result.saniti_links_v1;
    } else {
      currentLinks = DEFAULT_PRESETS;
    }

    // 기존 사용된 태그 목록 추출
    const tagsSet = new Set();
    currentLinks.forEach((link) => {
      if (Array.isArray(link.tags)) {
        link.tags.forEach((t) => tagsSet.add(t));
      }
    });
    userExistingTags = Array.from(tagsSet);

    // 3. 중복 검사 (URL 정규화 비교)
    const normalizedCurrentUrl = normalizeUrl(currentTabUrl);
    const existingBookmark = isInternalPage
      ? null
      : currentLinks.find((link) => normalizeUrl(link.url) === normalizedCurrentUrl);

    if (existingBookmark) {
      // 이미 즐겨찾기에 존재하는 경우 안내 박스 노출
      alreadyLinkTitle.textContent = existingBookmark.title || currentTabUrl;
      alreadyBox.style.display = 'block';
    } else {
      // 신규 링크인 경우 추가 폼 노출
      urlInput.value = currentTabUrl;
      if (isInternalPage) {
        titleInput.value = tab.title || '새 탭';
      } else {
        titleInput.value = tab.title || new URL(currentTabUrl).hostname.replace(/^www\./, '');
      }

      // 스마트 추천 태그 도출 및 기본 선택값 세팅
      const initialSuggested = suggestTags(currentTabUrl, titleInput.value, userExistingTags);
      selectedTags = [...initialSuggested];
      renderTags();

      form.style.display = 'block';
      titleInput.select();
    }
  } catch (err) {
    console.error('현재 탭 조회 및 중복 검사 실패:', err);
    if (form) form.style.display = 'block';
  }

  // 폼 제출 (신규 저장)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value.trim();
    const title = titleInput.value.trim() || url;
    if (!url) return;

    // 만약 인풋에 작성 중이던 태그가 있다면 포함
    if (tagInput && tagInput.value.trim()) {
      const pending = normalizeTag(tagInput.value);
      if (pending && !selectedTags.some((t) => t.toLowerCase() === pending.toLowerCase())) {
        selectedTags.push(pending);
      }
    }

    const finalTags = cleanTags(selectedTags);

    const newLink = {
      id: Date.now().toString(),
      title: title,
      url: url,
      tags: finalTags
    };

    try {
      // 최신 링크 목록 조회
      const result = await chrome.storage.local.get('saniti_links_v1');
      let currentLinks = [];

      if (result && Array.isArray(result.saniti_links_v1)) {
        currentLinks = result.saniti_links_v1;
      } else {
        currentLinks = DEFAULT_PRESETS;
      }

      // 새 링크 추가
      const updatedLinks = [...currentLinks, newLink];
      await chrome.storage.local.set({ saniti_links_v1: updatedLinks });

      // 완료 안내 후 팝업 닫기
      form.style.display = 'none';
      statusMsg.style.display = 'block';

      setTimeout(() => {
        window.close();
      }, 600);
    } catch (err) {
      console.error('바로가기 저장 실패:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  });
});
