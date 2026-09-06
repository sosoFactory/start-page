// 팝업 로드 시 현재 활성화된 탭의 정보 조회
document.addEventListener('DOMContentLoaded', async () => {
  const urlInput = document.getElementById('link-url');
  const titleInput = document.getElementById('link-title');
  const form = document.getElementById('add-form');
  const closeBtn = document.getElementById('btn-close');
  const statusMsg = document.getElementById('status-msg');

  // 취소 버튼
  closeBtn.addEventListener('click', () => {
    window.close();
  });

  try {
    // 현재 활성 탭 조회
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      // chrome:// 이나 edge:// 같은 내부 페이지 방어
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
        urlInput.value = tab.url;
        titleInput.value = tab.title || '새 탭';
      } else {
        urlInput.value = tab.url;
        titleInput.value = tab.title || new URL(tab.url).hostname.replace(/^www\./, '');
      }
      titleInput.select();
    }
  } catch (err) {
    console.error('현재 탭 조회 실패:', err);
  }

  // 폼 제출 (저장)
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
      // chrome.storage.local에서 기존 링크 목록 조회
      const result = await chrome.storage.local.get('saniti_links_v1');
      let currentLinks = [];

      if (result && Array.isArray(result.saniti_links_v1)) {
        currentLinks = result.saniti_links_v1;
      } else {
        // 스토리지가 비어있을 경우 기본 5개 대표 링크 불러오기
        currentLinks = [
          { id: '1', title: 'YouTube', url: 'https://youtube.com' },
          { id: '2', title: 'GitHub', url: 'https://github.com' },
          { id: '3', title: 'ChatGPT', url: 'https://chatgpt.com' },
          { id: '4', title: 'Naver', url: 'https://naver.com' },
          { id: '5', title: 'Google', url: 'https://google.com' }
        ];
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
