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

// 기본 5개 대표 링크
const DEFAULT_PRESETS = [
  { id: '1', title: 'YouTube', url: 'https://youtube.com' },
  { id: '2', title: 'GitHub', url: 'https://github.com' },
  { id: '3', title: 'ChatGPT', url: 'https://chatgpt.com' },
  { id: '4', title: 'Naver', url: 'https://naver.com' },
  { id: '5', title: 'Google', url: 'https://google.com' }
];

// 팝업 로드 시 현재 활성화된 탭의 정보 조회 및 중복 검사
document.addEventListener('DOMContentLoaded', async () => {
  const urlInput = document.getElementById('link-url');
  const titleInput = document.getElementById('link-title');
  const form = document.getElementById('add-form');
  const closeBtn = document.getElementById('btn-close');
  const statusMsg = document.getElementById('status-msg');
  const alreadyBox = document.getElementById('already-box');
  const alreadyLinkTitle = document.getElementById('already-link-title');
  const alreadyCloseBtn = document.getElementById('btn-already-close');

  // 취소 및 닫기 버튼
  if (closeBtn) {
    closeBtn.addEventListener('click', () => window.close());
  }
  if (alreadyCloseBtn) {
    alreadyCloseBtn.addEventListener('click', () => window.close());
  }

  try {
    // 1. 현재 활성 탭 조회
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return;

    const currentTabUrl = tab.url;
    const isInternalPage = currentTabUrl.startsWith('chrome://') || currentTabUrl.startsWith('edge://') || currentTabUrl.startsWith('about:');

    // 2. chrome.storage.local에서 기존 북마크 목록 조회
    const result = await chrome.storage.local.get('saniti_links_v1');
    let currentLinks = [];
    if (result && Array.isArray(result.saniti_links_v1)) {
      currentLinks = result.saniti_links_v1;
    } else {
      currentLinks = DEFAULT_PRESETS;
    }

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

    const newLink = {
      id: Date.now().toString(),
      title: title,
      url: url
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
